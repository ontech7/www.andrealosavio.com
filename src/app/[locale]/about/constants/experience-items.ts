export interface ExperienceItem {
  id: string;
  roleKey: string;
  company: string;
  logo: string;
  startDate: string;
  endDate: string | null;
  location: string;
  type: "freelance" | "permanent" | "apprenticeship";
  workMode: "remote" | "hybrid" | "onsite";
}

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "andrealosavio",
    roleKey: "softwareEngineerTechPartner",
    company: "Andrea Losavio",
    logo: "/images/clients/andrealosavio.svg",
    startDate: "2023-01",
    endDate: null,
    location: "Italy",
    type: "freelance",
    workMode: "remote",
  },
  {
    id: "minsait",
    roleKey: "fullStackDeveloper",
    company: "Minsait, part of Indra",
    logo: "/images/clients/minsait.svg",
    startDate: "2022-01",
    endDate: "2022-12",
    location: "Italy",
    type: "permanent",
    workMode: "hybrid",
  },
  {
    id: "doing",
    roleKey: "fullStackDeveloper",
    company: "Doing, part of Capgemini",
    logo: "/images/clients/doing.svg",
    startDate: "2021-03",
    endDate: "2022-01",
    location: "Italy",
    type: "permanent",
    workMode: "hybrid",
  },
  {
    id: "deloitte",
    roleKey: "juniorFullStackDeveloper",
    company: "Deloitte Digital Italia",
    logo: "/images/clients/deloitte.svg",
    startDate: "2018-12",
    endDate: "2021-03",
    location: "Italy",
    type: "permanent",
    workMode: "onsite",
  },
];
