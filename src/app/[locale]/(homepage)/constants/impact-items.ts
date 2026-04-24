import {
  GemIcon,
  GlobeIcon,
  LayersIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react";

export interface ImpactItem {
  icon: typeof SparklesIcon;
  textKey: string;
  highlightKey: string;
  position: "left" | "right";
}

export const IMPACT_ITEMS: ImpactItem[] = [
  {
    icon: SparklesIcon,
    textKey: "homepage.makingAnImpact.items.brandIdentity",
    highlightKey: "homepage.makingAnImpact.items.brandIdentityHighlight",
    position: "left",
  },
  {
    icon: LayersIcon,
    textKey: "homepage.makingAnImpact.items.infrastructure",
    highlightKey: "homepage.makingAnImpact.items.infrastructureHighlight",
    position: "right",
  },
  {
    icon: GlobeIcon,
    textKey: "homepage.makingAnImpact.items.platforms",
    highlightKey: "homepage.makingAnImpact.items.platformsHighlight",
    position: "left",
  },
  {
    icon: RefreshCwIcon,
    textKey: "homepage.makingAnImpact.items.transition",
    highlightKey: "homepage.makingAnImpact.items.transitionHighlight",
    position: "right",
  },
  {
    icon: GemIcon,
    textKey: "homepage.makingAnImpact.items.investment",
    highlightKey: "homepage.makingAnImpact.items.investmentHighlight",
    position: "left",
  },
];
