import { Footer } from "./footer";
import { Header } from "./header";
import { SkipLink } from "./skip-link";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
