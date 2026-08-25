import {
  Building2Icon,
  CompassIcon,
  GlobeIcon,
  ServerIcon,
  SmartphoneIcon,
  SparklesIcon,
} from "lucide-react";

export type ImpactTile =
  | {
      kind: "kpi";
      id: string;
      featured?: boolean;
      className?: string;
    }
  | {
      kind: "outcome";
      id: string;
      icon: typeof SparklesIcon;
      className?: string;
    };

export const IMPACT_TILES: ImpactTile[] = [
  {
    kind: "kpi",
    id: "investment",
    featured: true,
    className: "sm:col-span-2 lg:row-span-2",
  },
  { kind: "kpi", id: "clients" },
  { kind: "kpi", id: "since" },
  {
    kind: "outcome",
    id: "architecture",
    icon: ServerIcon,
    className: "sm:col-span-2",
  },
  { kind: "outcome", id: "web", icon: GlobeIcon, className: "sm:col-span-2" },
  { kind: "outcome", id: "mobile", icon: SmartphoneIcon },
  { kind: "outcome", id: "ai", icon: SparklesIcon },
  {
    kind: "outcome",
    id: "product",
    icon: CompassIcon,
    className: "sm:col-span-2",
  },
  {
    kind: "outcome",
    id: "enterprise",
    icon: Building2Icon,
    className: "sm:col-span-2",
  },
];
