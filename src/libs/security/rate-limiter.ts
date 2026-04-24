interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

const store = new Map<string, number[]>();

function createRateLimiter({ maxRequests, windowMs }: RateLimiterConfig) {
  return {
    check(ip: string): RateLimitResult {
      const now = Date.now();
      const windowStart = now - windowMs;

      const timestamps = (store.get(ip) || []).filter((t) => t > windowStart);

      if (store.size > 10_000) {
        for (const [key, value] of store) {
          const active = value.filter((t) => t > windowStart);
          if (active.length === 0) {
            store.delete(key);
          } else {
            store.set(key, active);
          }
        }
      }

      if (timestamps.length >= maxRequests) {
        const retryAfterMs = timestamps[0] + windowMs - now;
        store.set(ip, timestamps);
        return { allowed: false, remaining: 0, retryAfterMs };
      }

      timestamps.push(now);
      store.set(ip, timestamps);

      return {
        allowed: true,
        remaining: maxRequests - timestamps.length,
        retryAfterMs: 0,
      };
    },
  };
}

export const contactRateLimiter = createRateLimiter({
  maxRequests: 3,
  windowMs: 15 * 60 * 1000,
});
