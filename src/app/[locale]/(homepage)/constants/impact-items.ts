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
    textKey: "makingAnImpact.items.brandIdentity",
    highlightKey: "makingAnImpact.items.brandIdentityHighlight",
    position: "left",
  },
  {
    icon: LayersIcon,
    textKey: "makingAnImpact.items.infrastructure",
    highlightKey: "makingAnImpact.items.infrastructureHighlight",
    position: "right",
  },
  {
    icon: GlobeIcon,
    textKey: "makingAnImpact.items.platforms",
    highlightKey: "makingAnImpact.items.platformsHighlight",
    position: "left",
  },
  {
    icon: RefreshCwIcon,
    textKey: "makingAnImpact.items.transition",
    highlightKey: "makingAnImpact.items.transitionHighlight",
    position: "right",
  },
  {
    icon: GemIcon,
    textKey: "makingAnImpact.items.investment",
    highlightKey: "makingAnImpact.items.investmentHighlight",
    position: "left",
  },
];
