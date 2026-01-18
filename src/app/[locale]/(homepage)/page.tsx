import { FeedbackSection } from "./sections/feedback-section";
import { HeroSection } from "./sections/hero-section";
import { MakingAnImpactSection } from "./sections/making-an-impact-section";
import { QuoteSection } from "./sections/quote-section";
import { YouCouldBeNextSection } from "./sections/you-could-be-next-section";

export default async function HomePage() {
  return (
    <>
      <HeroSection id="hero" />
      <MakingAnImpactSection id="making-an-impact" />
      <YouCouldBeNextSection id="you-could-be-next" />
      <FeedbackSection id="feedback" />
      <QuoteSection id="quote" />
    </>
  );
}
