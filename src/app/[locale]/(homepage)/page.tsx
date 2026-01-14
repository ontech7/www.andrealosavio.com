import { HeroSection } from "./sections/hero-section";
import { MakingAnImpactSection } from "./sections/making-an-impact-section";

export default async function Home() {
  return (
    <>
      <HeroSection id="hero" />
      <MakingAnImpactSection id="making-an-impact" />
    </>
  );
}
