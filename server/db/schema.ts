import { pgTable, serial, text, boolean, timestamp, json, integer } from "drizzle-orm/pg-core";

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  verified: boolean("verified").default(false),
  verificationToken: text("verification_token"),
  tokenExpires: timestamp("token_expires"),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(), 
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  tools: json("tools").$type<string[]>().notNull(),
  image: text("image").notNull(),
  year: integer("year").notNull(),
  role: text("role").notNull(),
  link: text("link"),
  github: text("github"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const storedFiles = pgTable("stored_files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  data: text("data").notNull(), // Base64 content
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  expertise: text("expertise"), // 'Expert', etc.
  icon: text("icon").notNull(),
  level: integer("level").default(0),
  category: text("category").default("other"),
  color: json("color").$type<{ from: string; to: string; accent: string }>().notNull(),
  displayOrder: integer("display_order").default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  projectType: text("project_type"),
  budget: text("budget"),
  timeline: text("timeline"),
  message: text("message").notNull(),
  status: text("status").default("unread"),
  recruitment: boolean("recruitment").default(false),
});

export const siteConfig = pgTable("site_config", {
  key: text("key").primaryKey(),
  value: json("value").notNull(),
});

export const experiences = pgTable("experiences", {
  id: text("id").primaryKey(), // using text ID to match JSON usually
  year: text("year").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  description: text("description"),
  icon: text("icon"),
  technologies: json("technologies").$type<string[]>(),
});

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  content: text("content").notNull(),
  avatar: text("avatar"),
});

export const stats = pgTable("stats", {
  date: text("date").primaryKey(),
  visits: integer("visits").default(0),
  messageCount: integer("message_count").default(0),
  subscriberCount: integer("subscriber_count").default(0),
});

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
