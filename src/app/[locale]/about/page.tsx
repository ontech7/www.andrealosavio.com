import { BeyondCodeSection } from "./sections/beyond-code-section";
import { HeroSection } from "./sections/hero-section";

export default async function AboutPage() {
  return (
    <>
      <HeroSection id="hero" />
      <BeyondCodeSection id="beyond-code" />
    </>
  );
}
