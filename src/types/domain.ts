export interface Task {
  id: string;
  name: string;
  completed: boolean;
  dependsOn?: string[];
}

export interface Domain {
  id: string;
  name: string;
  url: string;
  position: { x: number; y: number };
  tasks: Task[];
  createdAt: string;
}

export type TaskType =
  | "installation"
  | "configuration"
  | "gscCfSetup"
  | "content"
  | "www"
  | "lhWhPublishing"
  | "traffic"
  | "monetization";

export const DEFAULT_TASKS: Task[] = [
  { id: "installation", name: "Installation", completed: false },
  {
    id: "configuration",
    name: "Configuration",
    completed: false,
    dependsOn: ["installation"],
  },
  {
    id: "gscCfSetup",
    name: "GSC/CF Setup",
    completed: false,
    dependsOn: ["installation"],
  },
  {
    id: "content",
    name: "Content",
    completed: false,
    dependsOn: ["configuration"],
  },
  {
    id: "www",
    name: "WWW Status",
    completed: false,
    dependsOn: ["configuration"],
  },
  {
    id: "lhWhPublishing",
    name: "LH/WH Publishing",
    completed: false,
    dependsOn: ["content", "gscCfSetup"],
  },
  {
    id: "traffic",
    name: "Traffic",
    completed: false,
    dependsOn: ["lhWhPublishing"],
  },
  {
    id: "monetization",
    name: "Monetization",
    completed: false,
    dependsOn: ["traffic"],
  },
];
