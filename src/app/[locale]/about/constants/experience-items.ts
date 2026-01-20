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
    roleKey: "fullStackAemDeveloper",
    company: "Minsait",
    logo: "/images/clients/minsait.svg",
    startDate: "2022-01",
    endDate: "2022-10",
    location: "Italy",
    type: "permanent",
    workMode: "hybrid",
  },
  {
    id: "doing",
    roleKey: "backEndAemDeveloper",
    company: "DOING",
    logo: "/images/clients/doing.svg",
    startDate: "2021-03",
    endDate: "2022-01",
    location: "Italy",
    type: "permanent",
    workMode: "hybrid",
  },
  {
    id: "deloitte",
    roleKey: "juniorAemDeveloper",
    company: "Deloitte Digital",
    logo: "/images/clients/deloitte.svg",
    startDate: "2019-07",
    endDate: "2021-03",
    location: "Italy",
    type: "permanent",
    workMode: "onsite",
  },
  {
    id: "ibm",
    roleKey: "itSpecialist",
    company: "IBM",
    logo: "/images/clients/ibm.svg",
    startDate: "2018-12",
    endDate: "2019-06",
    location: "Italy",
    type: "apprenticeship",
    workMode: "onsite",
  },
];
