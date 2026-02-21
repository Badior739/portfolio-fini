import { db, isDbConfigured } from "../db";
import { 
  subscribers, projects, skills, messages, siteConfig, experiences, testimonials, stats, appointments 
} from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { SiteData, Skill, Project, Experience, Testimonial, Subscriber, PendingSubscriber, ReceivedMessage, HeroContent, AboutContent, ContactInfo, BentoItem, SiteSettings, StatsEntry, Appointment, Admin, ExpertiseLevel } from "../../shared/api";

// Fix process.cwd access with any cast
const DATA_FILE = path.join((process as any).cwd(), "data", "site-data.json");

function getJsonData(): SiteData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Failed to load data:", e);
  }
  return {
    visits: 0,
    messages: 0,
    skills: [],
    projects: [],
    subscribers: [],
    pendingSubscribers: [],
    hero: { badge: "", title: "", subtitle: "", description: "", primaryCTA: "", secondaryCTA: "" },
    about: { titleMain: "", titleSub: "", quote: "", description: "", profileImage: "" },
    bento: [],
    contact: { email: "", location: "", linkedin: "", github: "" },
    receivedMessages: [],
    statsHistory: [],
    appointments: [],
    settings: {
        siteTitle: "Architecte Digital",
        siteDescription: "Portfolio d'exception",
        siteKeywords: "",
        enable2FA: true
    }
  };
}

function saveJsonData(data: SiteData) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to save data:", e);
  }
}

export async function loadData(): Promise<SiteData> {
  if (!isDbConfigured() || !db) return getJsonData();

  try {
    const [
      allSkills,
      allProjects,
      allSubscribers,
      allMessages,
      allExperiences,
      allTestimonials,
      allStats,
      configHero,
      configAbout,
      configContact,
      configSettings,
      configBento,
      configAdmin,
      allAppointments
    ] = await Promise.all([
      db.select().from(skills).orderBy(skills.displayOrder),
      db.select().from(projects).orderBy(projects.displayOrder),
      db.select().from(subscribers),
      db.select().from(messages).orderBy(desc(messages.date)),
      db.select().from(experiences),
      db.select().from(testimonials),
      db.select().from(stats),
      db.query.siteConfig.findFirst({ where: eq(siteConfig.key, 'hero') }),
      db.query.siteConfig.findFirst({ where: eq(siteConfig.key, 'about') }),
      db.query.siteConfig.findFirst({ where: eq(siteConfig.key, 'contact') }),
      db.query.siteConfig.findFirst({ where: eq(siteConfig.key, 'settings') }),
      db.query.siteConfig.findFirst({ where: eq(siteConfig.key, 'bento') }),
      db.query.siteConfig.findFirst({ where: eq(siteConfig.key, 'admin') }),
      db.select().from(appointments).orderBy(desc(appointments.createdAt))
    ]);

    const verifiedSubscribers = allSubscribers.filter(s => s.verified);
    const pendingSubscribers = allSubscribers.filter(s => !s.verified);

    return {
      skills: allSkills.map(s => ({
        name: s.name,
        icon: s.icon,
        description: s.description || "",
        expertise: (s.expertise as ExpertiseLevel) || "Expert",
        level: s.level || 0,
        color: (s.color as any) || { from: "#333", to: "#000", accent: "#fff" },
      })),
      projects: allProjects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        tools: (p.tools as string[]) || [],
        image: p.image,
        year: p.year,
        role: p.role,
        link: p.link || undefined,
        github: p.github || undefined
      })),
      subscribers: verifiedSubscribers.map(s => ({
        email: s.email,
        date: s.createdAt ? s.createdAt.toISOString() : new Date().toISOString()
      })),
      pendingSubscribers: pendingSubscribers.map(s => ({
        email: s.email,
        token: s.verificationToken || "",
        expires: s.tokenExpires ? s.tokenExpires.getTime() : 0
      })),
      messages: allStats.reduce((acc, curr) => acc + (curr.messageCount || 0), 0),
      receivedMessages: allMessages.map(m => ({
        id: m.id,
        date: m.date ? m.date.toISOString() : new Date().toISOString(),
        name: m.name,
        email: m.email,
        message: m.message,
        status: (m.status as any) || 'unread',
        company: m.company || undefined,
        projectType: m.projectType || undefined,
        budget: m.budget || undefined,
        timeline: m.timeline || undefined,
        recruitment: m.recruitment || false
      })),
      experiences: allExperiences.map(e => ({
        id: e.id,
        year: e.year,
        role: e.role,
        company: e.company,
        description: e.description || "",
        icon: e.icon || "",
        technologies: (e.technologies as string[]) || [],
      })),
      testimonials: allTestimonials.map(t => ({
        id: t.id,
        name: t.name,
        role: t.role,
        company: t.company || "",
        content: t.content,
        avatar: t.avatar || "",
      })),
      statsHistory: allStats.map(s => ({
        date: s.date,
        visits: s.visits || 0,
        messages: s.messageCount || 0,
        subscribers: s.subscriberCount || 0
      })),
      visits: allStats.reduce((acc, curr) => acc + (curr.visits || 0), 0),
      
      hero: (configHero?.value as any) || {},
      about: (configAbout?.value as any) || {},
      contact: (configContact?.value as any) || {},
      settings: (configSettings?.value as any) || { siteTitle: "", siteDescription: "", siteKeywords: "", enable2FA: true },
      bento: (configBento?.value as any) || [],
      
      appointments: allAppointments.map(a => ({
        id: a.id,
        date: a.date,
        time: a.time,
        name: a.name,
        email: a.email,
        topic: a.topic,
        status: (a.status as any) || 'pending',
        createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString()
      })),
      admin: configAdmin ? (configAdmin.value as unknown as Admin) : undefined,
    };
  } catch (e) {
    console.error("DB Load Error:", e);
    return getJsonData();
  }
}

export async function addSubscriber(email: string, token?: string, expires?: number) {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    if (token) {
      data.pendingSubscribers = data.pendingSubscribers || [];
      data.pendingSubscribers.push({ email, token, expires: expires || 0, date: new Date().toISOString() });
    } else {
      data.subscribers = data.subscribers || [];
      data.subscribers.push({ email, date: new Date().toISOString() });
    }
    saveJsonData(data);
    return;
  }
  
  await db.insert(subscribers).values({
    email,
    verified: !token,
    verificationToken: token,
    tokenExpires: expires ? new Date(expires) : null,
    createdAt: new Date()
  }).onConflictDoNothing();
}

export async function removeSubscriber(email: string) {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.subscribers = (data.subscribers || []).filter(s => s.email !== email);
    saveJsonData(data);
    return;
  }
  await db.delete(subscribers).where(eq(subscribers.email, email));
}

export async function confirmSubscriber(token: string): Promise<string | null> {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    const idx = (data.pendingSubscribers || []).findIndex(s => s.token === token);
    if (idx !== -1) {
      const pending = data.pendingSubscribers![idx];
      const email = pending.email;
      data.pendingSubscribers!.splice(idx, 1);
      data.subscribers = data.subscribers || [];
      data.subscribers.push({ email: pending.email, date: new Date().toISOString() });
      saveJsonData(data);
      return email;
    }
    return null;
  }

  const result = await db.update(subscribers)
    .set({ verified: true, verificationToken: null, tokenExpires: null })
    .where(eq(subscribers.verificationToken, token))
    .returning();
  
  return result.length > 0 ? result[0].email : null;
}

export async function updateContent(data: Partial<SiteData>) {
  if (!isDbConfigured() || !db) {
    const current = getJsonData();
    const newData = { ...current, ...data };
    saveJsonData(newData);
    return;
  }

  try {
    // Handle Configs
    if (data.hero) await db.insert(siteConfig).values({ key: 'hero', value: data.hero }).onConflictDoUpdate({ target: siteConfig.key, set: { value: data.hero } });
    if (data.about) await db.insert(siteConfig).values({ key: 'about', value: data.about }).onConflictDoUpdate({ target: siteConfig.key, set: { value: data.about } });
    if (data.contact) await db.insert(siteConfig).values({ key: 'contact', value: data.contact }).onConflictDoUpdate({ target: siteConfig.key, set: { value: data.contact } });
    if (data.settings) await db.insert(siteConfig).values({ key: 'settings', value: data.settings }).onConflictDoUpdate({ target: siteConfig.key, set: { value: data.settings } });
    if (data.bento) await db.insert(siteConfig).values({ key: 'bento', value: data.bento }).onConflictDoUpdate({ target: siteConfig.key, set: { value: data.bento } });
    
    if (data.admin) {
      await db.insert(siteConfig).values({ key: 'admin', value: data.admin }).onConflictDoUpdate({ target: siteConfig.key, set: { value: data.admin } });
    }

    // Handle Projects
    if (data.projects) {
      await db.delete(projects);
      if (data.projects.length > 0) {
        await db.insert(projects).values(data.projects.map((p, i) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          tools: p.tools,
          image: p.image,
          year: p.year,
          role: p.role,
          link: p.link,
          github: p.github,
          displayOrder: i
        })));
      }
    }

    // Handle Skills
    if (data.skills) {
      await db.delete(skills);
      if (data.skills.length > 0) {
        await db.insert(skills).values(data.skills.map((s, i) => ({
          name: s.name,
          icon: s.icon,
          description: s.description,
          expertise: s.expertise,
          level: s.level,
          color: s.color,
          displayOrder: i
        })));
      }
    }

    // Handle Experiences
    if (data.experiences) {
      await db.delete(experiences);
      if (data.experiences.length > 0) {
        await db.insert(experiences).values(data.experiences.map(e => ({
          id: e.id,
          year: e.year,
          role: e.role,
          company: e.company,
          description: e.description || "",
          icon: e.icon || "",
          technologies: (e.technologies as string[]) || [],
        })));
      }
    }

    // Handle Testimonials
    if (data.testimonials) {
      await db.delete(testimonials);
      if (data.testimonials.length > 0) {
        await db.insert(testimonials).values(data.testimonials.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company || "",
          content: t.content,
          avatar: t.avatar || "",
        })));
      }
    }
  } catch (e) {
    console.error("Failed to update content in DB:", e);
    throw e; // Re-throw to let the caller handle it or global handler catch it
  }
}

export async function addAppointment(apt: Appointment) {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.appointments = data.appointments || [];
    data.appointments.push(apt);
    saveJsonData(data);
    return;
  }
  await db.insert(appointments).values({
    id: apt.id,
    date: apt.date,
    time: apt.time,
    name: apt.name,
    email: apt.email,
    topic: apt.topic,
    status: apt.status,
    createdAt: new Date(apt.createdAt)
  });
}

export async function incrementVisits() {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.visits += 1;
    
    const today = new Date().toISOString().split('T')[0];
    const historyEntry = data.statsHistory?.find(h => h.date === today);
    
    if (historyEntry) {
      historyEntry.visits += 1;
    } else {
      if (!data.statsHistory) data.statsHistory = [];
      data.statsHistory.push({
        date: today,
        visits: 1,
        messages: 0,
        subscribers: 0
      });
      if (data.statsHistory.length > 30) data.statsHistory.shift();
    }
    
    saveJsonData(data);
    return data.visits;
  }

  const today = new Date().toISOString().split('T')[0];
  await db.insert(stats).values({ 
    date: today, 
    visits: 1, 
    messageCount: 0, 
    subscriberCount: 0 
  }).onConflictDoUpdate({
    target: stats.date,
    set: { visits: sql`${stats.visits} + 1` }
  });
  
  const allStats = await db.select().from(stats);
  return allStats.reduce((acc, s) => acc + (s.visits || 0), 0);
}

export async function incrementMessages() {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.messages += 1;
    
    const today = new Date().toISOString().split('T')[0];
    const historyEntry = data.statsHistory?.find(h => h.date === today);
    
    if (historyEntry) {
      historyEntry.messages += 1;
    } else {
      if (!data.statsHistory) data.statsHistory = [];
      data.statsHistory.push({
        date: today,
        visits: 0,
        messages: 1,
        subscribers: 0
      });
      if (data.statsHistory.length > 30) data.statsHistory.shift();
    }
    
    saveJsonData(data);
    return data.messages;
  }

  const today = new Date().toISOString().split('T')[0];
  await db.insert(stats).values({ 
    date: today, 
    visits: 0, 
    messageCount: 1, 
    subscriberCount: 0 
  }).onConflictDoUpdate({
    target: stats.date,
    set: { messageCount: sql`${stats.messageCount} + 1` }
  });

  const allStats = await db.select().from(stats);
  return allStats.reduce((acc, s) => acc + (s.messageCount || 0), 0);
}

export async function addMessage(msg: ReceivedMessage) {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.receivedMessages = data.receivedMessages || [];
    data.receivedMessages.push(msg);
    data.messages += 1;
    const today = new Date().toISOString().split('T')[0];
    const historyEntry = data.statsHistory?.find(h => h.date === today);
    if (historyEntry) {
      historyEntry.messages += 1;
    } else {
      if (!data.statsHistory) data.statsHistory = [];
      data.statsHistory.push({ date: today, visits: 0, messages: 1, subscribers: 0 });
    }
    saveJsonData(data);
    return;
  }

  await db.insert(messages).values({
    name: msg.name,
    email: msg.email,
    message: msg.message,
    company: msg.company,
    projectType: msg.projectType,
    budget: msg.budget,
    timeline: msg.timeline,
    recruitment: msg.recruitment,
    date: new Date(msg.date),
    status: msg.status
  });
  
  await incrementMessages();
}

export async function resetStats() {
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.visits = 0;
    data.messages = 0;
    data.statsHistory = [];
    saveJsonData(data);
    return;
  }
  
  await db.delete(stats);
}
