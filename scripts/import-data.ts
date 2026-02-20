
import fs from "fs";
import path from "path";
import { db } from "../server/db";
import { 
  projects, skills, subscribers, messages, 
  siteConfig, experiences, testimonials, stats, appointments 
} from "../server/db/schema";
import { eq } from "drizzle-orm";

async function importData() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("⏳ Reading site-data.json...");
  
  const dataPath = path.join(process.cwd(), "data", "site-data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("❌ data/site-data.json not found");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log("✅ Data loaded. Starting import...");

  try {
    // Import Site Config (About, Hero, etc.)
    if (data.about) await upsertConfig("about", data.about);
    if (data.hero) await upsertConfig("hero", data.hero);
    if (data.contact) await upsertConfig("contact", data.contact);
    if (data.admin) await upsertConfig("admin", data.admin);

    // Import Projects
    if (data.projects && data.projects.length > 0) {
      console.log(`📦 Importing ${data.projects.length} projects...`);
      for (const p of data.projects) {
        await db!.insert(projects).values({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          tools: p.tools || [],
          image: p.image,
          year: p.year,
          role: p.role,
          link: p.link,
          github: p.github,
          displayOrder: p.displayOrder || 0
        }).onConflictDoNothing();
      }
    }

    // Import Skills
    if (data.skills && data.skills.length > 0) {
      console.log(`📦 Importing ${data.skills.length} skills...`);
      for (const s of data.skills) {
        await db!.insert(skills).values({
          name: s.name,
          description: s.description,
          expertise: s.expertise,
          icon: s.icon,
          level: s.level || 0,
          category: s.category || "other",
          color: s.color || { from: "#000", to: "#000", accent: "#000" },
          displayOrder: s.displayOrder || 0
        }).onConflictDoNothing();
      }
    }

    // Import Subscribers
    if (data.subscribers && data.subscribers.length > 0) {
      console.log(`📦 Importing ${data.subscribers.length} subscribers...`);
      for (const s of data.subscribers) {
        await db!.insert(subscribers).values({
          email: s.email,
          createdAt: s.date ? new Date(s.date) : new Date(),
          verified: true
        }).onConflictDoNothing();
      }
    }

    // Import Messages
    if (data.messages && data.messages.length > 0) {
      console.log(`📦 Importing ${data.messages.length} messages...`);
      for (const m of data.messages) {
        await db!.insert(messages).values({
          date: m.date ? new Date(m.date) : new Date(),
          name: m.name,
          email: m.email,
          company: m.company,
          projectType: m.projectType,
          budget: m.budget,
          timeline: m.timeline,
          message: m.message,
          status: m.status || "unread"
        }).onConflictDoNothing();
      }
    }
    
    // Import Appointments
    if (data.appointments && data.appointments.length > 0) {
      console.log(`📦 Importing ${data.appointments.length} appointments...`);
      for (const a of data.appointments) {
        await db!.insert(appointments).values({
          id: a.id,
          date: a.date,
          time: a.time,
          name: a.name,
          email: a.email,
          topic: a.topic,
          status: a.status || "pending",
          createdAt: new Date()
        }).onConflictDoNothing();
      }
    }

    console.log("✅ Import completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

async function upsertConfig(key: string, value: any) {
  await db!.insert(siteConfig).values({ key, value })
    .onConflictDoUpdate({ target: siteConfig.key, set: { value } });
}

importData();
