export enum ProjectPhase {
  INITIATION = "Iniciação",
  PLANNING = "Planejamento",
  EXECUTION = "Execução",
  CONTROL = "Controle",
  CLOSURE = "Encerramento"
}

export interface StageData {
  phase: ProjectPhase;
  description: string;
  evidenceLinks: string[]; // Links to drive, docs, photos
  peerRating: number; // 0 to 20
  myRating?: number; // User's rating for this session
  lastUpdated: string;
}

export interface Project {
  id: string;
  title: string;
  author: string;
  authorId: string; // Link to the user
  coverImage?: string; // Preview of final product
  description: string;
  tags: string[]; // Palavras-chave
  totalHumanityScore: number; // 0 to 100
  stages: Record<ProjectPhase, StageData>;
  verified: boolean;
  createdAt: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface UserContacts {
  phone?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for mock auth check
  role: string;       // Cargo/Ocupação
  bio: string;
  photoUrl?: string;  // URL da foto de perfil
  education: EducationItem[];
  experience: ExperienceItem[];
  location: string;
  isVerifiedHuman: boolean;
  followers: number;
  following: string[]; // array of user IDs
  contacts?: UserContacts;
}