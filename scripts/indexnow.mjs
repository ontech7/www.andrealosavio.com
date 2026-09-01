/**
 * Notifies IndexNow (Bing, Yandex, Seznam, Naver) that URLs changed.
 * Google does not participate in IndexNow.
 *
 * Run it AFTER a deploy is live: the protocol expects every submitted URL to
 * be fetchable, and a URL that 404s counts against the host's reputation.
 *
 *   node scripts/indexnow.mjs                  URLs whose <lastmod> is within 7 days
 *   node scripts/indexnow.mjs --since=30       ...within 30 days
 *   node scripts/indexnow.mjs --all            every URL in the sitemap
 *   node scripts/indexnow.mjs <url> [url...]   exactly these URLs
 *   node scripts/indexnow.mjs --dry-run        print the payload, submit nothing
 *
 * The key is not configured anywhere: it is read from the only file in
 * public/ whose name is a valid IndexNow key and whose body repeats that name,
 * which is exactly the file the protocol requires you to publish. One source
 * of truth, so rotating the key means replacing one file.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const PUBLIC_DIR = new URL("../public/", import.meta.url).pathname;
const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;
const DEFAULT_WINDOW_DAYS = 7;

const host = process.env.NEXT_PUBLIC_SITE_URL ?? "www.andrealosavio.com";
const origin = `https://${host}`;

function fail(message, hint) {
  console.error(`\n  ✗ ${message}`);
  if (hint) console.error(`    ${hint}`);
  console.error("");
  process.exit(1);
}

async function findKey() {
  const entries = await readdir(PUBLIC_DIR, { withFileTypes: true });
  const candidates = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".txt")) continue;

    const name = entry.name.slice(0, -".txt".length);
    if (!KEY_PATTERN.test(name)) continue;

    const body = (await readFile(join(PUBLIC_DIR, entry.name), "utf8")).trim();
    if (body === name) candidates.push(name);
  }

  if (candidates.length === 0) {
    fail(
      "No IndexNow key file found in public/.",
      "Create public/<key>.txt containing exactly <key>, 8-128 chars of [A-Za-z0-9-]."
    );
  }

  if (candidates.length > 1) {
    fail(
      `Multiple IndexNow key files in public/: ${candidates.join(", ")}.`,
      "Keep one. The others are stale keys and make submissions ambiguous."
    );
  }

  return candidates[0];
}

async function assertKeyIsLive(key) {
  const url = `${origin}/${key}.txt`;
  let response;

  try {
    response = await fetch(url, { redirect: "manual" });
  } catch (error) {
    fail(`Cannot reach ${url}`, String(error));
  }

  if (response.status >= 300 && response.status < 400) {
    fail(
      `${url} answered ${response.status} → ${response.headers.get("location")}`,
      "The proxy is intercepting it. Add the file to the matcher exclusions in src/proxy.ts."
    );
  }

  if (!response.ok) {
    fail(
      `${url} answered ${response.status}.`,
      "The key must be public before any submission, or every URL is rejected."
    );
  }

  const body = (await response.text()).trim();
  if (body !== key) {
    fail(
      `${url} does not contain the key.`,
      `Expected "${key}", got "${body.slice(0, 60)}".`
    );
  }
}

async function readSitemap() {
  const response = await fetch(`${origin}/sitemap.xml`);
  if (!response.ok) fail(`sitemap.xml answered ${response.status}.`);

  const xml = await response.text();
  const entries = [];

  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (loc) entries.push({ loc, lastmod: lastmod ? new Date(lastmod) : null });
  }

  if (entries.length === 0) fail("sitemap.xml contains no <url> entries.");

  return entries;
}

async function selectUrls(args) {
  const explicit = args.filter((arg) => arg.startsWith("http"));
  if (explicit.length > 0)
    return { urls: explicit, reason: "passed on the command line" };

  const entries = await readSitemap();
  if (args.includes("--all")) {
    return {
      urls: entries.map((e) => e.loc),
      reason: "every URL in the sitemap",
    };
  }

  const sinceArg = args.find((arg) => arg.startsWith("--since="));
  const days = sinceArg
    ? Number(sinceArg.slice("--since=".length))
    : DEFAULT_WINDOW_DAYS;
  if (!Number.isFinite(days) || days <= 0)
    fail(`Invalid --since value: ${sinceArg}`);

  const cutoff = Date.now() - days * 86_400_000;
  const urls = entries
    .filter((e) => e.lastmod && e.lastmod.getTime() >= cutoff)
    .map((e) => e.loc);

  return { urls, reason: `<lastmod> within ${days} day(s)` };
}

async function submit(key, urls) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${origin}/${key}.txt`,
      urlList: urls,
    }),
  });

  const detail = (await response.text()).trim();

  switch (response.status) {
    case 200:
      console.log(`  ✓ ${urls.length} URL accepted.\n`);
      return;
    case 202:
      console.log(`  ✓ ${urls.length} URL accepted, key validation pending.\n`);
      return;
    case 403:
      fail(
        "403: the key was rejected.",
        `Check that ${origin}/${key}.txt is live and matches.`
      );
      break;
    case 422:
      fail(
        "422: URLs do not belong to this host, or the key does not match.",
        detail
      );
      break;
    case 429:
      fail(
        "429: too many requests. Submit only what actually changed.",
        detail
      );
      break;
    default:
      fail(`${response.status} from IndexNow.`, detail || "(empty body)");
  }
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const key = await findKey();
console.log(`\n  host  ${host}`);
console.log(`  key   ${key}`);

const { urls, reason } = await selectUrls(args);

if (urls.length === 0) {
  console.log(`\n  Nothing to submit (${reason}).\n`);
  process.exit(0);
}

console.log(`\n  ${urls.length} URL selected, ${reason}:`);
for (const url of urls) console.log(`    ${url.replace(origin, "")}`);

if (dryRun) {
  console.log("\n  --dry-run: nothing submitted.\n");
  process.exit(0);
}

await assertKeyIsLive(key);
await submit(key, urls);
