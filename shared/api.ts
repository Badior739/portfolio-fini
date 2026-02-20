export interface DemoResponse {
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export type ExpertiseLevel = "Expert" | "Avancé" | "Maîtrisé" | "Advanced" | "Mastered";

export interface Skill {
  name: string;
  description: string;
  expertise: ExpertiseLevel;
  icon: string;
  level?: number; // Added for progress bars
  color: {
    from: string;
    to: string;
    accent: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  role: string;
  tools: string[];
  year: number;
  link?: string;
  github?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface Experience {
  id: string;
  year: string;
  role: string;
  company: string;
  description?: string;
  icon?: string;
  technologies?: string[];
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  enable2FA: boolean;
  web3formsKey?: string;
  gaId?: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export interface AboutContent {
  titleMain: string;
  titleSub: string;
  quote: string;
  description: string;
  profileImage: string;
}

export interface BentoItem {
  title: string;
  icon: string;
  content: string;
  className?: string;
  bg?: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface Admin {
  salt: string;
  hash: string;
  otp?: string;
  otpExpires?: number;
}

export interface Subscriber {
  email: string;
  date: string;
}

export interface PendingSubscriber {
  email: string;
  token: string;
  date?: string;
  expires?: number;
}

export interface StatsEntry {
  date: string;
  visits: number;
  subscribers: number;
  messages: number;
}

export interface ReceivedMessage {
  id: number;
  date: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read";
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  recruitment?: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  topic: string;
  status: "pending" | "confirmed" | "cancelled";
  meetingLink?: string;
  createdAt: string;
}

export interface SiteData {
  visits: number;
  messages: number;
  skills: Skill[];
  projects: Project[];
  subscribers: Subscriber[];
  pendingSubscribers?: PendingSubscriber[];
  hero?: HeroContent;
  about?: AboutContent;
  bento?: BentoItem[];
  contact?: ContactInfo;
  receivedMessages?: ReceivedMessage[];
  statsHistory?: StatsEntry[];
  admin?: Admin;
  testimonials?: Testimonial[];
  experiences?: Experience[];
  settings?: SiteSettings;
  appointments?: Appointment[];
}
