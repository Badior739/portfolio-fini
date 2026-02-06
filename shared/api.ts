/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Contact form response
 */
export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface Skill {
  name: string;
  category: string;
  level: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  tags: string[];
}

export interface Admin {
  salt: string;
  hash: string;
}

export interface SiteData {
  visits: number;
  messages: number;
  skills: Skill[];
  projects: Project[];
  subscribers: string[];
  admin?: Admin;
  hero?: HeroData;
  about?: AboutData;
  bento?: BentoItem[];
  contact?: ContactData;
  receivedMessages?: ReceivedMessage[];
  statsHistory?: StatsEntry[];
}

export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export interface AboutData {
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
  className: string;
  bg: string;
}

export interface ContactData {
  email: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ReceivedMessage {
  id: number;
  date: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read';
}

export interface StatsEntry {
  date: string;
  visits: number;
  subscribers: number;
  messages: number;
}

export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export interface AboutData {
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
  className: string;
  bg: string;
}

export interface ContactData {
  email: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ReceivedMessage {
  id: number;
  date: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read';
}

