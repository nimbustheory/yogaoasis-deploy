import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Copy, Info,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — YogaOasis Tucson
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "YOGAOASIS",
  subtitle: "TUCSON",
  tagline: "Many ways to practice.",
  logoMark: "YO",
  logoImage: null,
  description: "A beloved Tucson yoga community since 2000 — offering in-studio, outdoor, and virtual practice across three locations in the heart of the Sonoran Desert.",
  heroLine1: "FIND",
  heroLine2: "YOUR OASIS",

  address: { street: "2631 N. Campbell Ave", city: "Tucson", state: "AZ", zip: "85719" },
  phone: "(520) 322-6142",
  email: "info@yogaoasis.com",
  neighborhood: "Central Tucson",
  website: "https://yogaoasis.com",
  social: { instagram: "@yogaoasis" },

  theme: {
    accent:     { h: 24,  s: 75, l: 52 },   // Desert terracotta/burnt orange
    accentAlt:  { h: 172, s: 40, l: 42 },    // Saguaro green
    warning:    { h: 45,  s: 85, l: 55 },    // Desert gold
    primary:    { h: 20,  s: 25, l: 10 },    // Warm dark brown
    surface:    { h: 35,  s: 30, l: 97 },    // Warm sand white
    surfaceDim: { h: 30,  s: 20, l: 93 },    // Warm sand
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: false,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
  },

  classCapacity: 35,
  specialtyCapacity: 25,
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#2c2018",
  textMuted: "#7a6850",
  textFaint: "#a89878",
  border: "#e8ddd0",
  borderLight: "#f2ebe0",
};

// ═══════════════════════════════════════════════════════════════
//  STUDIO IMAGES — Real YogaOasis CDN URLs
// ═══════════════════════════════════════════════════════════════
const STUDIO_IMAGES = {
  hero: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/editor/welcome-yogaoasis_3.jpg?1595022313",
  logo: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/1456817654.png",
  rooftopSunset: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/rooftop-sunset_orig.jpg",
  outdoorClass: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/published/open-air.jpg?1595019110",
  studioInterior: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/yo-in-studio-thumbnail-2023_orig.jpg",
  eastExterior: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/screen-shot-2023-04-25-at-12-58-42-pm_orig.png",
  teacherTraining: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/3517037.jpg?127",
  joshuaTree: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/joshua-tree-national-park.jpg",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — YogaOasis content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Darren", lastName: "Rhodes", role: "Studio Director & Instructor", certs: ["E-RYT 500", "Lead Trainer"], specialties: ["Yogahour", "Alignment", "Asana"], yearsTeaching: 25, photo: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/published/darren-rhodes-headshot-2013.jpeg?1617649767", bio: "Darren's mother began practicing yoga while pregnant with him. Throughout his childhood, she practiced and taught in their living room. His father, an avid meditator and scholar, consistently shared spiritual insights. Their guidance continues to inspire his yogic journey." },
  { id: "t2", firstName: "Rachel", lastName: "King", role: "Admin & Instructor", certs: ["RYT-200", "Yogahour Certified"], specialties: ["Yogahour", "Community Building"], yearsTeaching: 18, bio: "Rachel has managed YogaOasis since 2000 and has been teaching since 2007. She deeply appreciates the power of practice and aims to share its potency in a playful, steady, and safe environment." },
  { id: "t3", firstName: "Sam", lastName: "Rice", role: "Instructor", certs: ["E-RYT 500"], specialties: ["Alignment", "Sequencing", "Hatha"], yearsTeaching: 16, bio: "Sam started practicing yoga due to a back injury. She is passionate about teaching and considers yoga class a true class — full of detailed instruction and strategic sequencing for insight and refinement." },
  { id: "t4", firstName: "Hanna", lastName: "Naegle", role: "Instructor", certs: ["E-RYT 500"], specialties: ["Creative Sequencing", "Alignment", "Anatomy"], yearsTeaching: 15, photo: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/published/img-9855-rev-4web_5.jpg", bio: "Hanna started practicing yoga as a teenager with her mom. She is interested in participation over perfection and offers plenty of options for any skill level. Expect creative sequencing and some bad jokes." },
  { id: "t5", firstName: "Jenn", lastName: "Bemis", nickname: "Choi", role: "Instructor", certs: ["E-RYT 500", "Functional Movement"], specialties: ["Strength & Mobility", "Biomechanics", "Fascia"], yearsTeaching: 14, photo: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/published/img-2050jennchoi_3.jpg", bio: "Jenn dove deep into yoga scriptures, stories, and philosophy. Her classes are infused with precise alignment cues, intentional sequencing, and new explorative approaches to achieve mobility and body awareness." },
  { id: "t6", firstName: "Joe", lastName: "Barnett", role: "Instructor", certs: ["RYT-200", "Yin Yoga Certified"], specialties: ["Yin Yoga", "Meditation", "Dream Work"], yearsTeaching: 20, photo: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/published/joe-headshot-2025.jpeg?1758229140", bio: "Joe found yoga just after university and just before Y2K. His teacher Paul Grilley showed him a deeper way into the body with Yin Yoga, leading to healthier joints and a quieter, introspective mind." },
  { id: "t7", firstName: "Mackie", lastName: "Osborne", role: "Instructor", certs: ["E-RYT 500"], specialties: ["Hatha", "Anatomy", "Somatics"], yearsTeaching: 12, photo: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/published/mackie-batiara-head.jpeg?1755829159", bio: "Mackie says yoga makes all the things she loves even better. YO is one of her favorite places in the world — an incredibly special community she's overjoyed to be part of." },
  { id: "t8", firstName: "Alexandra", lastName: "Roush", role: "Admin & Instructor", certs: ["RYT-200", "End of Life Doula (in progress)"], specialties: ["Hatha", "Meditation", "Accessible Movement"], yearsTeaching: 8, photo: "https://www.yogaoasis.com/uploads/5/3/0/2/53020043/published/3699417_5.jpg", bio: "Alexandra is in a long-term relationship with yoga asana and meditation. Building awareness of what her body is doing in space and where her mind goes have been gifts that keep on giving." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Desert Flow", type: "YOGAHOUR",
  style: "Yogahour", temp: "75–80°F", duration: 60,
  description: "A confluence of fun, flow, and form. Experience the signature YogaOasis yogahour — alignment-focused practice with creative sequencing in a welcoming, temperature-controlled room.",
  intention: "Practice is not about perfection. It's about showing up, again and again.",
  teacherTip: "Use the props. They're tools for exploration, not crutches. Let them reveal new possibilities in familiar poses.",
  playlist: "Desert Sunrise — Darren's Selection",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Yin & Stillness", type: "YIN", style: "Yin", temp: "Room Temp", duration: 75, description: "Long-held poses releasing deep connective tissue, fascia, and stored tension. Postures held 3–7 minutes with or without props.", intention: "Surrender is not giving up — it's opening up.", teacherTip: "Let gravity do the work. If you're muscling through, you're doing too much." },
  { id: "p-y2", date: offsetDate(-2), name: "Expanding Flow", type: "EXPANDING", style: "Expanding", temp: "75–80°F", duration: 60, description: "Building on basics and yogahour knowledge, exploring a wider variety of postures with detailed instruction and strategic sequencing.", intention: "Growth happens at the edge of comfort." },
  { id: "p-y3", date: offsetDate(-3), name: "Strength & Mobility", type: "FUNCTIONAL", style: "Functional Flow", temp: "Room Temp", duration: 60, description: "Creative exercises and movements integrating functional movement with yoga poses. Isolating muscles and building toward one apex pose.", intention: "The body is the instrument. Move with curiosity." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Yin Flow + Fascia", type: "SPECIAL", style: "Yin Flow", temp: "Room Temp", duration: 75, description: "Explore and combine self-massage techniques with lacrosse balls and Yin yoga to re-hydrate and release fascia and bound-up muscles.", intention: "Fascia holds our stories. Give it space to speak.", teacherTip: "The lacrosse balls are provided — don't be afraid to explore areas of holding." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:30", type: "Yogahour", coach: "Darren Rhodes", capacity: 35, registered: 30, waitlist: 0 },
  { id: "cl2", time: "08:00", type: "Basics", coach: "Barb Pautler", capacity: 35, registered: 28, waitlist: 0 },
  { id: "cl3", time: "09:30", type: "Yogahour", coach: "Sam Rice", capacity: 35, registered: 35, waitlist: 4 },
  { id: "cl4", time: "11:00", type: "Strength & Mobility", coach: "Jenn Bemis", capacity: 30, registered: 18, waitlist: 0 },
  { id: "cl5", time: "12:30", type: "Yo Slow", coach: "Alexandra Roush", capacity: 30, registered: 22, waitlist: 0 },
  { id: "cl6", time: "16:30", type: "Expanding", coach: "Hanna Naegle", capacity: 35, registered: 32, waitlist: 0 },
  { id: "cl7", time: "17:45", type: "Yogahour", coach: "Mackie Osborne", capacity: 35, registered: 35, waitlist: 6 },
  { id: "cl8", time: "19:00", type: "Yin Yoga", coach: "Joe Barnett", capacity: 25, registered: 20, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:30", type: "Yogahour", coach: "Darren" }, { time: "08:00", type: "Yin Flow + Fascia", coach: "Jenn" }, { time: "09:30", type: "Yogahour", coach: "Allison" }, { time: "11:00", type: "Basics", coach: "Grace" }, { time: "16:30", type: "Yogahour", coach: "Kanoe" }, { time: "17:00", type: "Prenatal Yoga", coach: "Christine" }, { time: "17:45", type: "Expanding", coach: "Hanna" }, { time: "19:15", type: "Yin (Experienced)", coach: "Joe" }, { time: "19:15", type: "Yoga for Recovery", coach: "Teya" }] },
  { day: "Tuesday", classes: [{ time: "06:30", type: "Yogahour", coach: "Sam" }, { time: "08:00", type: "Basics", coach: "Barb" }, { time: "09:30", type: "Yogahour", coach: "Darren" }, { time: "11:00", type: "Functional Flow", coach: "Jenn" }, { time: "16:30", type: "Expanding", coach: "Grace" }, { time: "17:45", type: "YoFlow", coach: "Hanna" }] },
  { day: "Wednesday", classes: [{ time: "06:30", type: "Yogahour", coach: "Mackie" }, { time: "08:00", type: "Strength & Mobility", coach: "Jenn" }, { time: "09:30", type: "Yogahour", coach: "Sam" }, { time: "11:00", type: "Yo Slow", coach: "Alexandra" }, { time: "16:30", type: "Yogahour", coach: "Darren" }, { time: "17:45", type: "Yin Flow + Fascia", coach: "Gaby" }, { time: "19:15", type: "Mindful Vinyasa", coach: "Gaby" }] },
  { day: "Thursday", classes: [{ time: "06:30", type: "Yogahour", coach: "Darren" }, { time: "08:00", type: "Nervous System Reset", coach: "Gaby" }, { time: "09:30", type: "Fascia + Basics", coach: "Jenn" }, { time: "11:00", type: "Basics", coach: "Barb" }, { time: "16:30", type: "Expanding", coach: "Sam" }, { time: "17:45", type: "Yogahour", coach: "Hanna" }, { time: "19:15", type: "12 Step Yoga", coach: "Enrique" }, { time: "19:15", type: "Spirited Yoga", coach: "Stefanie" }] },
  { day: "Friday", classes: [{ time: "06:30", type: "Yogahour", coach: "Sam" }, { time: "08:00", type: "Basics", coach: "Grace" }, { time: "09:30", type: "Yogahour", coach: "Mackie" }, { time: "11:00", type: "Expanding", coach: "Allison" }, { time: "16:30", type: "Yogahour", coach: "Darren" }, { time: "19:00", type: "Yin Sessions", coach: "Joe" }] },
  { day: "Saturday", classes: [{ time: "07:00", type: "Yogahour", coach: "Darren" }, { time: "09:00", type: "Yogahour", coach: "Sam" }, { time: "10:30", type: "Basics", coach: "Mackie" }, { time: "12:00", type: "Prenatal Yoga", coach: "Christine" }] },
  { day: "Sunday", classes: [{ time: "08:00", type: "Dynamic Flow", coach: "Hanna" }, { time: "09:30", type: "Yogahour", coach: "Darren" }, { time: "11:00", type: "Fascia + Basics", coach: "Jenn" }, { time: "12:30", type: "Functional Flow", coach: "Jenn" }, { time: "16:00", type: "Prenatal Yoga", coach: "Stacey" }, { time: "17:30", type: "Restorative", coach: "Hanna" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Laura M.", milestone: "500 Classes", message: "Half a thousand classes at YO. This community is family. Thank you Darren, Sam, and every teacher who shows up for us.", date: today, celebrations: 56 },
  { id: "cf2", user: "Carlos R.", milestone: "30-Day Streak", message: "30 days straight on the mat. Yogahour has completely changed how I carry myself through the day.", date: today, celebrations: 22 },
  { id: "cf3", user: "Nina J.", milestone: "First Handstand!", message: "It happened! Five breaths in handstand during Hanna's expanding class. I'm shaking and crying and so happy!", date: offsetDate(-1), celebrations: 41 },
  { id: "cf4", user: "Tom B.", milestone: "1 Year Member", message: "One year at YogaOasis. I came for a back injury. I stayed for everything else.", date: offsetDate(-1), celebrations: 38 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "250 Classes": { icon: Star, color: T.warning },
  "500 Classes": { icon: Award, color: T.warning },
  "7-Day Streak": { icon: Flame, color: T.accent },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Inversion": { icon: ArrowUpRight, color: "#8b5cf6" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "The Pilgrimage 2026 with Darren Rhodes & Sam Rice", date: "2026-04-26", startTime: "09:00", type: "Weekend Intensive", description: "Join Darren Rhodes and Sam Rice for their annual weekend intensive of asana, mantra, and pranayama. A transformative two-day deep dive for devoted practitioners.", fee: 175, maxParticipants: 30, registered: 25, status: "Only 5 Spots Left" },
  { id: "ev2", name: "Friday Night Yin Sessions with Joe Barnett", date: "2026-04-18", startTime: "19:00", type: "Monthly Yin", description: "Join Joe Barnett for a Friday night yin yoga practice with extra-long holds, meditative silence, and deep fascial release.", fee: 15, maxParticipants: 25, registered: 18, status: "Registration Open" },
  { id: "ev3", name: "Unwind with the Full Moon", date: "2026-04-25", startTime: "19:00", type: "Special Event", description: "Join Hanna Naegle and Julie Vernon for a special edition slow and nourishing evening practice to celebrate the full moon.", fee: 20, maxParticipants: 30, registered: 22, status: "Registration Open" },
  { id: "ev4", name: "The Oasis Within — Joshua Tree Retreat", date: "2026-05-14", startTime: "14:00", type: "Retreat", description: "Join Darren Rhodes and Jenn Choi Bemis for a luxurious retreat that serves as a homecoming to yourself. Four nights in Joshua Tree.", fee: 1850, maxParticipants: 16, registered: 15, status: "1 Spot Left!" },
  { id: "ev5", name: "Summer 200hr Teacher Training", date: "2026-06-15", startTime: "08:00", type: "Teacher Training", description: "Join Darren Rhodes, Alexandra Roush, and Mackie Osborne for the condensed summer format RYT-200 teacher training at YogaOasis Central.", fee: 3200, maxParticipants: 20, registered: 8, status: "Registration Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "Drop-In Class", type: "drop-in", price: 11, period: "per class", features: ["1 in-studio class", "All class types", "Any location"], popular: false },
  { id: "m2", name: "Livestream Class", type: "drop-in", price: 6, period: "per class", features: ["1 live Zoom class", "Yogahour $6 / Basics $8", "Practice from anywhere"], popular: false },
  { id: "m3", name: "On Demand Pass", type: "pack", price: 48, period: "/month", features: ["Unlimited video library", "All livestream classes", "Practice anytime, anywhere", "Auto-renew, cancel anytime"], popular: false },
  { id: "m4", name: "Unlimited Membership", type: "unlimited", price: 95, period: "/month", features: ["Unlimited in-studio classes", "All 3 locations + outdoor", "On Demand video library", "All livestream classes", "Cancel anytime"], popular: true },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Summer 200hr Teacher Training — Condensed Format!", message: "June 2026 with Darren Rhodes, Alexandra Roush, and Mackie Osborne. Earn your RYT-200 this summer at YogaOasis Central.", type: "celebration", pinned: true },
  { id: "a2", title: "New Class: Dynamic Flow", message: "Ready-steady-flow. Warm-up, alignment, breath emphasis. Definitely doable. Wednesdays, Thursdays & Sundays.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Laura Montoya", email: "laura@email.com", membership: "Unlimited", status: "active", joined: "2020-03-15", checkIns: 512, lastVisit: today },
  { id: "mem2", name: "Carlos Reyes", email: "carlos@email.com", membership: "Unlimited", status: "active", joined: "2023-06-01", checkIns: 287, lastVisit: offsetDate(-1) },
  { id: "mem3", name: "Nina Johansson", email: "nina@email.com", membership: "Unlimited", status: "active", joined: "2024-11-01", checkIns: 94, lastVisit: offsetDate(-1) },
  { id: "mem4", name: "Tom Blackwell", email: "tom@email.com", membership: "Unlimited", status: "active", joined: "2025-03-24", checkIns: 156, lastVisit: today },
  { id: "mem5", name: "Sage Whitfield", email: "sage@email.com", membership: "On Demand", status: "active", joined: "2025-09-01", checkIns: 42, lastVisit: offsetDate(-3) },
  { id: "mem6", name: "Priya Desai", email: "priya@email.com", membership: "Unlimited", status: "frozen", joined: "2024-01-10", checkIns: 198, lastVisit: offsetDate(-45) },
  { id: "mem7", name: "Marcus Chen", email: "marcus@email.com", membership: "Unlimited", status: "active", joined: "2022-08-01", checkIns: 378, lastVisit: today },
  { id: "mem8", name: "Elena Ruiz", email: "elena@email.com", membership: "Unlimited", status: "active", joined: "2021-01-10", checkIns: 602, lastVisit: offsetDate(-1) },
];

const ADMIN_METRICS = {
  activeMembers: 342, memberChange: 18,
  todayCheckIns: 112, weekCheckIns: 687,
  monthlyRevenue: 38450, revenueChange: 11.2,
  renewalRate: 93.5, workshopRevenue: 6800,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 118, avg: 13 }, { day: "Tue", total: 96, avg: 16 },
    { day: "Wed", total: 104, avg: 15 }, { day: "Thu", total: 112, avg: 14 },
    { day: "Fri", total: 88, avg: 15 }, { day: "Sat", total: 72, avg: 18 },
    { day: "Sun", total: 68, avg: 11 },
  ],
  revenue: [
    { month: "Sep", revenue: 30200 }, { month: "Oct", revenue: 32100 },
    { month: "Nov", revenue: 33800 }, { month: "Dec", revenue: 31500 },
    { month: "Jan", revenue: 35200 }, { month: "Feb", revenue: 37100 },
    { month: "Mar", revenue: 38450 },
  ],
  classPopularity: [
    { name: "6:30 AM", pct: 86 }, { name: "8:00 AM", pct: 80 },
    { name: "9:30 AM", pct: 98 }, { name: "11:00 AM", pct: 62 },
    { name: "12:30 PM", pct: 74 }, { name: "4:30 PM", pct: 92 },
    { name: "5:45 PM", pct: 100 }, { name: "7:00 PM", pct: 80 },
  ],
  membershipBreakdown: [
    { name: "Unlimited Monthly", value: 198, color: T.accent },
    { name: "On Demand", value: 62, color: T.success },
    { name: "Livestream", value: 44, color: T.warning },
    { name: "Drop-In", value: 38, color: T.textMuted },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div className="pb-6">
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: 280 }}>
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.hero})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} />
        {/* Gradient overlay — ~30% darkening */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45) 100%)" }} />
        <div style={{ position: "relative", padding: "32px 22px", color: "#fff" }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
            {formatDateLong(today)}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 48, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }}>
            {STUDIO_CONFIG.heroLine1}<br/>
            <span style={{ color: T.accent, fontStyle: "italic" }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.85)", fontSize: 13, maxWidth: 280, marginTop: 10, lineHeight: 1.5 }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.textMuted },
          ].map(a => (
            <QuickAction key={a.label} {...a} />
          ))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.accent : totalReg >= c.capacity * 0.8 ? T.warning : T.success }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.success }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#6b5840", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b5840", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99, whiteSpace: "nowrap" }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Classes" subtitle="Past, present, and upcoming practice" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (
          <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
        ))}
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, registerForClass, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Schedule" subtitle="Reserve your spot — classes fill up fast" />
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Recovery") || cls.type.includes("Prenatal") || cls.type.includes("Restorative") || cls.type.includes("12 Step");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
              </div>
              <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 18, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                Reserve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);

  const handleSave = () => { setSaved("log"); setTimeout(() => setSaved(null), 2000); setReflection({ energy: 4, focus: 4, notes: "" }); };
  const streakDays = 18;
  const totalClasses = 156;

  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="My Practice" subtitle="Track your journey and celebrate growth" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Mountain size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>7</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Leaf size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Heart size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge], i) => {
            const earned = i < 7;
            return (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : T.borderLight}`, borderRadius: 12, opacity: earned ? 1 : 0.5 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: earned ? `${badge.color}15` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <badge.icon size={22} color={earned ? badge.color : T.textFaint} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: T.text }}>{name}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{earned ? "Earned" : "Keep practicing!"}</p>
                </div>
                {earned && <CircleCheck size={18} color={T.accent} />}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 12px" }}>Recent Practice</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { date: today, type: "Yogahour", name: "Desert Flow", result: "60 min · 75–80°F", badge: "warm" },
            { date: offsetDate(-1), type: "Yin", name: "Yin & Stillness", result: "75 min · Room", badge: "yin" },
            { date: offsetDate(-2), type: "Expanding", name: "Expanding Flow", result: "60 min · 75–80°F", badge: "warm" },
          ].map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: h.badge === "warm" ? T.accentGhost : T.successGhost, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {h.badge === "warm" ? <Sun size={16} color={T.accent} /> : <Moon size={16} color={T.success} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: T.text }}>{h.name}</p>
                <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{formatDateShort(h.date)}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.textMuted }}>{h.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Community" subtitle="Celebrate each other's practice" />
      {STUDIO_CONFIG.features.guestPasses && (
        <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(20,30%,14%))`, borderRadius: 14, padding: "18px 18px", marginBottom: 20, color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Gift size={20} color={T.accent} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: 0 }}>Guest Passes</h3>
          </div>
          <p style={{ fontSize: 13, color: "#c8a888", margin: "0 0 14px", lineHeight: 1.5 }}>You have <span style={{ color: T.accent, fontWeight: 700 }}>2 guest passes</span> this month. Share the gift of practice.</p>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Share2 size={16} /> Share a Guest Pass
          </button>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {item.user[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#4a3820", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Teachers" subtitle="Meet the YogaOasis teaching team" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                {teacher.photo ? (
                  <img src={teacher.photo} alt={`${teacher.firstName} ${teacher.lastName}`} loading="lazy" style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>
                    {teacher.firstName} {teacher.nickname ? `"${teacher.nickname}" ` : ""}{teacher.lastName}
                  </h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#5a4830", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (
                      <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Membership" subtitle="Many ways to practice" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Best Value
              </div>
            )}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 4px", color: T.text }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#5a4830" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageTitle title="Events" subtitle="Workshops, retreats, and special offerings" />
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(20,30%,14%))`, padding: "20px 18px", color: "#fff", position: "relative", overflow: "hidden" }}>
            {ev.type === "Retreat" && <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.joshuaTree})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25 }} />}
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, position: "relative" }}>{ev.type}</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "6px 0 4px", fontWeight: 600, position: "relative" }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#c8a888", position: "relative" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#5a4830", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={`$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: ev.status.includes("Left") ? T.accent : T.success }}>{ev.status}</span>
              <button style={{ padding: "10px 24px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", background: T.accent, color: "#fff" }}>
                Register
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+22 registrations", positive: true, icon: Award, color: "#8b5cf6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name}.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#fff", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#4ade80" : "#f87171" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3d3528" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1f1c18", border: "1px solid #3d3528", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3d3528" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1f1c18", border: "1px solid #3d3528", borderRadius: 8, color: "#fff" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <AdminCard title="Membership Breakdown">
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f1c18", border: "1px solid #3d3528", borderRadius: 8, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => {
    if (filter !== "all" && m.status !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Members</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "frozen"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#1f1c18", color: filter === f ? "#fff" : "#9ca3af" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3d3528" }}>
              {["Member", "Membership", "Status", "Classes", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #3d3528" }}>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ color: "#fff", fontWeight: 600, margin: 0 }}>{m.name}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Schedule Management</h1>
      <div style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3d3528" }}>
              {["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #3d3528" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{c.capacity}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.accent : T.success }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.accent}20` : `${T.success}20`, color: c.registered >= c.capacity ? T.accent : T.success }}>
                    {c.registered >= c.capacity ? "Full" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {teacher.photo ? (
                <img src={teacher.photo} alt={`${teacher.firstName} ${teacher.lastName}`} loading="lazy" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
              )}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (
                <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#3d3528", color: "#9ca3af" }}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3d3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3d3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Events & Workshops</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> New Event
        </button>
      </div>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>{ev.status}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "8px 0 4px" }}>{ev.name}</h3>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>{formatDateShort(ev.date)} · {ev.type} · ${ev.fee}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: T.accent, fontWeight: 700 }}>{ev.registered}</div>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>of {ev.maxParticipants} spots</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Pricing & Memberships</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: "#1f1c18", border: `1px solid ${tier.popular ? T.accent : "#3d3528"}`, borderRadius: 12, padding: 18 }}>
            {tier.popular && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginBottom: 8, display: "inline-block" }}>BEST VALUE</span>}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", margin: "0 0 4px" }}>{tier.name}</h3>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: T.accent, fontWeight: 700 }}>${tier.price}<span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 400 }}> {tier.period}</span></div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "8px 0" }}>{tier.features.length} features</p>
            <button style={{ width: "100%", padding: "8px 0", borderRadius: 6, border: "1px solid #3d3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit Tier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Broadcast & Notifications</h1>
      <div style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: "#151210", border: "1px solid #3d3528", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: "#151210", border: "1px solid #3d3528", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "unlimited", "on demand", "teachers"].map(a => (
              <button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : "#3d3528", color: audience === a ? "#fff" : "#9ca3af" }}>{a}</button>
            ))}
          </div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>
      <div>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Sent Broadcasts</h3>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 10, padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ color: "#fff", margin: 0, fontSize: 14, fontWeight: 600 }}>{a.title}</h4>
              {a.pinned && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>PINNED</span>}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, margin: 0 }}>{title}</h2>
      {linkText && (
        <button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>
          {linkText} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span>
    </button>
  );
}

function PracticeCardFull({ practice, variant, expanded, onToggle }) {
  const isFeatured = variant === "featured";
  const isExpanded = expanded !== undefined ? expanded : isFeatured;
  const typeColors = { YOGAHOUR: T.accent, EXPANDING: T.success, YIN: "#8b5cf6", FUNCTIONAL: T.warning, SPECIAL: T.success };

  return (
    <div onClick={onToggle} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderLeft: `4px solid ${typeColors[practice.type] || T.accent}`, borderRadius: 12, padding: isFeatured ? "18px 18px" : "14px 16px", cursor: onToggle ? "pointer" : "default", transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanded ? 10 : 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {practice.date === today ? (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>TODAY</span>
            ) : (
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{formatDateShort(practice.date)}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${typeColors[practice.type] || T.accent}12`, color: typeColors[practice.type] || T.accent }}>{practice.style}</span>
            {practice.duration && <span style={{ fontSize: 11, color: T.textFaint }}>{practice.duration} min</span>}
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: isFeatured ? 26 : 20, margin: 0, color: T.text }}>{practice.name}</h3>
        </div>
        {onToggle && <ChevronDown size={18} color={T.textFaint} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
      </div>
      {isExpanded && (
        <div>
          {practice.temp && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Sun size={14} color={T.success} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{practice.temp}</span>
            </div>
          )}
          <p style={{ fontSize: 14, color: "#5a4830", lineHeight: 1.6, margin: "0 0 12px" }}>{practice.description}</p>
          {practice.intention && (
            <div style={{ padding: "10px 12px", background: T.accentGhost, borderRadius: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intention</span>
              <p style={{ fontSize: 13, color: "#5a4830", margin: "4px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>{practice.intention}</p>
            </div>
          )}
          {practice.teacherTip && (
            <div style={{ padding: "10px 12px", background: T.successGhost, borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em" }}>Teacher's Note</span>
              <p style={{ fontSize: 13, color: "#5a4830", margin: "4px 0 0", lineHeight: 1.5 }}>{practice.teacherTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 12px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: "vertical" }} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />}
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
      <Icon size={36} color={T.textFaint} style={{ margin: "0 auto 8px" }} />
      <p style={{ color: T.textMuted, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 13, color: T.accent, margin: "6px 0 0" }}>{sub}</p>}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text, margin: 0, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function CTACard() {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ background: `linear-gradient(165deg, ${T.bg}, hsl(20,30%,14%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, background: "radial-gradient(circle at 80% 30%, rgba(255,200,120,.4) 0%, transparent 50%)" }} />
      <div style={{ position: "relative" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 6px", fontWeight: 600 }}>New to YogaOasis?</h3>
        <p style={{ fontSize: 13, color: "#c8a888", margin: "0 0 16px", lineHeight: 1.5 }}>Tucson's beloved yoga community since 2000. Three locations, 30+ teachers, and classes from dawn to dusk. Your first class is just $11.</p>
        <button onClick={() => setPage("membership")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 15, cursor: "pointer" }}>
          View Memberships <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#1f1c18", border: "1px solid #3d3528", borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const [notifClass, setNotifClass] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);

  const ToggleButton = ({ active, onClick }) => (
    <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative", transition: "background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>LM</div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>Laura Montoya</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Unlimited Member · Since Mar 2020</p>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[
            { label: "Class Reminders", active: notifClass, toggle: () => setNotifClass(!notifClass) },
            { label: "Community Milestones", active: notifCommunity, toggle: () => setNotifCommunity(!notifCommunity) },
            { label: "Events & Workshops", active: notifEvents, toggle: () => setNotifEvents(!notifEvents) },
            { label: "Practice Streak Reminders", active: notifReminders, toggle: () => setNotifReminders(!notifReminders) },
          ].map(n => (
            <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 14, color: T.text }}>{n.label}</span>
              <ToggleButton active={n.active} onClick={n.toggle} />
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Locations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={14} color={T.accent} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: T.text }}>Central — 2631 N. Campbell Ave</p>
                <p style={{ fontSize: 11, color: T.textMuted, margin: "1px 0 0" }}>Tucson, AZ 85719</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={14} color={T.success} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: T.text }}>East — 7000 E. Tanque Verde Rd #9</p>
                <p style={{ fontSize: 11, color: T.textMuted, margin: "1px 0 0" }}>Tucson, AZ 85715</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={14} color={T.warning} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: T.text }}>North — Westward Look Rooftop</p>
                <p style={{ fontSize: 11, color: T.textMuted, margin: "1px 0 0" }}>Outdoor · Seasonal</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>About</h3>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>YogaOasis App v1.0</p>
          <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>Powered by Nimbus Labs</p>
        </div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS MODAL
// ═══════════════════════════════════════════════════════════════
function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", type: "class", title: "Yogahour starts in 1 hour", message: "9:30 AM with Sam Rice at Central. 4 spots left.", time: "8:30 AM", read: false },
    { id: "n2", type: "community", title: "Nina J. earned First Handstand!", message: "Celebrate their achievement", time: "Yesterday", read: false },
    { id: "n3", type: "event", title: "The Pilgrimage — Only 5 Spots Left", message: "March 28-29 with Darren & Sam. Register now.", time: "2 days ago", read: true },
    { id: "n4", type: "class", title: "Class confirmed", message: "Desert Flow · Yogahour with Darren at 6:30 AM", time: "Today", read: true },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "80vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 14px", background: n.read ? "transparent" : T.accentGhost, border: `1px solid ${n.read ? T.borderLight : T.accentBorder}`, borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: n.type === "class" ? T.accentGhost : n.type === "community" ? T.successGhost : T.warningGhost, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {n.type === "class" ? <Calendar size={16} color={T.accent} /> : n.type === "community" ? <Heart size={16} color={T.success} /> : <CalendarDays size={16} color={T.warning} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: T.text, margin: 0 }}>{n.title}</p>
                <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{n.message}</p>
                <p style={{ fontSize: 11, color: T.textFaint, margin: "4px 0 0" }}>{n.time}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, marginTop: 4, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RESERVATION CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════
function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const totalReg = classData.registered + (classData.waitlist || 0);
  const isFull = totalReg >= classData.capacity;
  const spotsLeft = classData.capacity - classData.registered;
  const dateLabel = classData.date ? formatDateShort(classData.date) : classData.dayLabel || "This week";

  const handleConfirm = () => { setConfirmed(true); onConfirm(classData.id); };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, padding: "24px 20px 36px" }}>
        {!confirmed ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0, color: T.text }}>Confirm Reservation</h2>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} color={T.textMuted} /></button>
            </div>
            <div style={{ background: T.bgDim, borderRadius: 14, padding: "18px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 3px" }}>{classData.type}</h3>
                  <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{classData.coach}</p>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{fmtTime(classData.time)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CalendarDays size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{dateLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: isFull ? T.accent : spotsLeft <= 5 ? T.warning : T.text }}>
                    {isFull ? `Full — you'll be added to the waitlist` : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>2631 N. Campbell Ave, Tucson</span>
                </div>
              </div>
            </div>
            <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Info size={16} color={T.accent} />
                <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Reminders</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <p style={{ fontSize: 12, color: "#5a4830", margin: 0, lineHeight: 1.4 }}>Arrive 10–15 minutes early. Doors lock when class begins.</p>
                <p style={{ fontSize: 12, color: "#5a4830", margin: 0, lineHeight: 1.4 }}>$11 per class for drop-in. Free with Unlimited membership.</p>
                <p style={{ fontSize: 12, color: "#5a4830", margin: 0, lineHeight: 1.4 }}>Bring water and a towel. Mats available for $2 rental.</p>
              </div>
            </div>
            <button onClick={handleConfirm} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: isFull ? T.success : T.accent, color: "#fff", marginBottom: 8 }}>
              {isFull ? "Join Waitlist" : "Confirm Reservation"}
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>
              Cancel
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={32} color={T.accent} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 4px", color: T.text }}>
              {isFull ? "Added to Waitlist" : "You're In!"}
            </h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 20px" }}>
              {isFull
                ? `We'll notify you if a spot opens for ${classData.type} at ${fmtTime(classData.time)}.`
                : `${classData.type} with ${classData.coach.split(" ")[0]} at ${fmtTime(classData.time)}. See you on the mat!`
              }
            </p>
            <div style={{ background: T.bgDim, borderRadius: 12, padding: "14px 16px", marginBottom: 16, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Class</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{classData.type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Teacher</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{classData.coach}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Time</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{fmtTime(classData.time)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Date</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{dateLabel}</span>
              </div>
            </div>
            <button onClick={() => setAddedToCalendar(true)} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: `1px solid ${addedToCalendar ? T.accentBorder : T.border}`, background: addedToCalendar ? T.accentGhost : "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: addedToCalendar ? T.accent : T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              {addedToCalendar ? <Check size={16} /> : <CalendarDays size={16} />}
              {addedToCalendar ? "Added to Calendar" : "Add to Calendar"}
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: T.accent, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#fff", fontFamily: "'Playfair Display', serif" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminToggle, setShowAdminToggle] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);

  const registerForClass = useCallback((classId) => { setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 })); setReservationClass(null); }, []);
  const openReservation = useCallback((classData) => { setReservationClass(classData); }, []);
  const celebrateFeed = useCallback((feedId) => { setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 })); }, []);

  const contentRef = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
  }, [page]);

  const handleLogoClick = useCallback(() => {
    const n = logoClicks + 1;
    setLogoClicks(n);
    if (n >= 5 && !showAdminToggle) setShowAdminToggle(true);
    setTimeout(() => setLogoClicks(0), 2000);
  }, [logoClicks, showAdminToggle]);

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Classes", icon: Wind },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "community", label: "Community", icon: Heart },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "events", label: "Events", icon: CalendarDays },
  ];

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-events", label: "Events", icon: CalendarDays },
    { id: "admin-pricing", label: "Pricing", icon: DollarSign },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />;
      default: return <HomePage />;
    }
  };

  const isMoreActive = moreItems.some(item => item.id === page);
  const unreadCount = 2;

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#151210" }}>
          <aside style={{ width: 240, background: T.bg, color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40 }}>
            <div style={{ padding: "20px 18px", borderBottom: "1px solid #3d3528" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, letterSpacing: "0.02em", display: "block", lineHeight: 1 }}>{STUDIO_CONFIG.name}</span>
                  <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin Portal</span>
                </div>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#a1a1aa", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #3d3528", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#a1a1aa", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  // ——— CONSUMER LAYOUT ———
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>
        
        {/* Header */}
        <header style={{ position: "sticky", top: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, lineHeight: 1, letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</span>
              <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {showAdminToggle && (
              <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}>
                <Shield size={20} />
              </button>
            )}
            <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main ref={contentRef} style={{ paddingBottom: 80 }}>
          {renderPage()}
        </main>

        {/* More Menu */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>More</span>
                <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}`, maxWidth: 390, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
            {mainTabs.map(tab => {
              const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
              if (tab.id === "more") {
                return (
                  <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                    <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
