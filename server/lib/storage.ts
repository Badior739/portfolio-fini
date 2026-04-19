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
        color: (JSON.parse(s.color as unknown as string)) as any,
      })),
      projects: allProjects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        tools: (JSON.parse(p.tools as unknown as string)) as string[],
        image: p.image,
        year: p.year,
        role: p.role,
        link: p.link || undefined,
        github: p.github || undefined,
        content_blocks: (JSON.parse(p.content_blocks as unknown as string)) as any
      })),
      subscribers: verifiedSubscribers.map(s => ({
        email: s.email,
        date: s.createdAt || new Date().toISOString()
      })),
      pendingSubscribers: pendingSubscribers.map(s => ({
        email: s.email,
        token: s.verificationToken || "",
        expires: s.tokenExpires ? new Date(s.tokenExpires).getTime() : 0
      })),
      messages: allStats.reduce((acc, curr) => acc + (curr.messageCount || 0), 0),
      receivedMessages: allMessages.map(m => ({
        id: m.id,
        date: m.date || new Date().toISOString(),
        name: m.name,
        email: m.email,
        message: m.message,
        status: (m.status as any) || 'unread',
        company: m.company || undefined,
        projectType: m.projectType || undefined,
        budget: m.budget || undefined,
        timeline: m.timeline || undefined,
        recruitment: m.recruitment === 1
      })),
      experiences: allExperiences.map(e => ({
        id: e.id,
        year: e.year,
        role: e.role,
        company: e.company,
        description: e.description || "",
        icon: e.icon || "",
        technologies: (JSON.parse(e.technologies as unknown as string)) as string[],
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
      
      hero: (configHero ? JSON.parse(configHero.value as string) : {}) as any,
      about: (configAbout ? JSON.parse(configAbout.value as string) : {}) as any,
      contact: (configContact ? JSON.parse(configContact.value as string) : {}) as any,
      settings: (configSettings ? JSON.parse(configSettings.value as string) : {}) as any,
      bento: (configBento ? JSON.parse(configBento.value as string) : []) as any,
      
      appointments: allAppointments.map(a => ({
        id: a.id,
        date: a.date,
        time: a.time,
        name: a.name,
        email: a.email,
        topic: a.topic,
        status: (a.status as any) || 'pending',
        createdAt: a.createdAt || new Date().toISOString()
      })),
      admin: configAdmin ? (JSON.parse(configAdmin.value as string) as Admin) : undefined,
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
    verified: token ? 0 : 1,
    verificationToken: token,
    tokenExpires: expires ? new Date(expires).toISOString() : null,
    createdAt: new Date().toISOString()
  });
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
    .set({ verified: 1, verificationToken: null, tokenExpires: null })
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
    if (data.hero) await db.insert(siteConfig).values({ key: 'hero', value: JSON.stringify(data.hero) }).onConflictDoUpdate({ target: siteConfig.key, set: { value: JSON.stringify(data.hero) } });
    if (data.about) await db.insert(siteConfig).values({ key: 'about', value: JSON.stringify(data.about) }).onConflictDoUpdate({ target: siteConfig.key, set: { value: JSON.stringify(data.about) } });
    if (data.contact) await db.insert(siteConfig).values({ key: 'contact', value: JSON.stringify(data.contact) }).onConflictDoUpdate({ target: siteConfig.key, set: { value: JSON.stringify(data.contact) } });
    if (data.settings) await db.insert(siteConfig).values({ key: 'settings', value: JSON.stringify(data.settings) }).onConflictDoUpdate({ target: siteConfig.key, set: { value: JSON.stringify(data.settings) } });
    if (data.bento) await db.insert(siteConfig).values({ key: 'bento', value: JSON.stringify(data.bento) }).onConflictDoUpdate({ target: siteConfig.key, set: { value: JSON.stringify(data.bento) } });
    
    if (data.admin) {
      await db.insert(siteConfig).values({ key: 'admin', value: JSON.stringify(data.admin) }).onConflictDoUpdate({ target: siteConfig.key, set: { value: JSON.stringify(data.admin) } });
    }

    if (data.projects) {
      await db.delete(projects);
      if (data.projects.length > 0) {
        await db.insert(projects).values(data.projects.map((p, i) => ({
          id: p.id as string,
          title: p.title,
          category: p.category,
          description: p.description,
          tools: p.tools,
          image: p.image,
          year: p.year,
          role: p.role,
          link: p.link || null,
          github: p.github || null,
          content_blocks: p.content_blocks || [],
          displayOrder: i
        })));
      }
    }

    if (data.skills) {
      await db.delete(skills);
      if (data.skills.length > 0) {
        await db.insert(skills).values(data.skills.map((s, i) => ({
          name: s.name,
          icon: s.icon,
          description: s.description || null,
          expertise: s.expertise || null,
          level: s.level || 0,
          color: s.color,
          displayOrder: i
        })));
      }
    }

    if (data.experiences) {
      await db.delete(experiences);
      if (data.experiences.length > 0) {
        await db.insert(experiences).values(data.experiences.map(e => ({
          id: e.id,
          year: e.year,
          role: e.role,
          company: e.company,
          description: e.description || null,
          icon: e.icon || null,
          technologies: e.technologies || [],
        })));
      }
    }

    if (data.testimonials) {
      await db.delete(testimonials);
      if (data.testimonials.length > 0) {
        await db.insert(testimonials).values(data.testimonials.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company || null,
          content: t.content,
          avatar: t.avatar || null,
        })));
      }
    }
  } catch (e) {
    console.error("Failed to update content in DB:", e);
    throw e;
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
    status: apt.status || 'pending',
    createdAt: new Date(apt.createdAt).toISOString()
  });
}

export async function incrementVisits() {
  const today = new Date().toISOString().split('T')[0];
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.visits += 1;
    const historyEntry = data.statsHistory?.find(h => h.date === today);
    if (historyEntry) {
      historyEntry.visits += 1;
    } else {
      if (!data.statsHistory) data.statsHistory = [];
      data.statsHistory.push({ date: today, visits: 1, messages: 0, subscribers: 0 });
      if (data.statsHistory.length > 30) data.statsHistory.shift();
    }
    saveJsonData(data);
    return data.visits;
  }

  await db.insert(stats).values({ 
    date: today, 
    visits: 1, 
    messageCount: 0, 
    subscriberCount: 0 
  }).onConflictDoUpdate({
    target: stats.date,
    set: { visits: sql`visits + 1` }
  });
  
  const allStats = await db.select().from(stats);
  return allStats.reduce((acc, s) => acc + (s.visits || 0), 0);
}

export async function incrementMessages() {
  const today = new Date().toISOString().split('T')[0];
  if (!isDbConfigured() || !db) {
    const data = getJsonData();
    data.messages += 1;
    const historyEntry = data.statsHistory?.find(h => h.date === today);
    if (historyEntry) {
      historyEntry.messages += 1;
    } else {
      if (!data.statsHistory) data.statsHistory = [];
      data.statsHistory.push({ date: today, visits: 0, messages: 1, subscribers: 0 });
      if (data.statsHistory.length > 30) data.statsHistory.shift();
    }
    saveJsonData(data);
    return data.messages;
  }

  await db.insert(stats).values({ 
    date: today, 
    visits: 0, 
    messageCount: 1, 
    subscriberCount: 0 
  }).onConflictDoUpdate({
    target: stats.date,
    set: { messageCount: sql`message_count + 1` }
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
    saveJsonData(data);
    return;
  }

  await db.insert(messages).values({
    name: msg.name,
    email: msg.email,
    message: msg.message,
    company: msg.company || null,
    projectType: msg.projectType || null,
    budget: msg.budget || null,
    timeline: msg.timeline || null,
    recruitment: msg.recruitment ? 1 : 0,
    date: msg.date,
    status: msg.status || 'unread'
  });
  
  await incrementMessages();
}

export async function resetStats() {
  if (db) {
    await db.delete(stats);
  }
}
