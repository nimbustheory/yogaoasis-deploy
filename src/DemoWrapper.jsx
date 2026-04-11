import { useState, useCallback } from "react";
import { Calendar, Flame, Heart, Users, CreditCard, CalendarDays, Bell, Shield, Sparkles, MapPin, TrendingUp, Palette } from "lucide-react";
import DEMO_CONFIG from "./demo.config.js";
import App from "./App.jsx";

const iconMap = {
  calendar: Calendar, flame: Flame, heart: Heart, users: Users,
  "credit-card": CreditCard, "calendar-days": CalendarDays, bell: Bell,
  shield: Shield, sparkles: Sparkles, "map-pin": MapPin,
  "trending-up": TrendingUp, palette: Palette,
};

const C = {
  bg: "#f5f0eb",
  card: "#ffffff",
  border: "#e8e0d6",
  text: "#2c2418",
  textMuted: "#7a6850",
  textFaint: "#a89878",
  accent: DEMO_CONFIG.accent,
  accentAlt: DEMO_CONFIG.accentAlt,
};

export default function DemoWrapper() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminChange = useCallback((adminState) => {
    setIsAdmin(adminState);
  }, []);

  if (isAdmin) {
    return (
      <>
        <App onAdminChange={handleAdminChange} />
        <style>{`
          *, *::before, *::after { scrollbar-width: none; -ms-overflow-style: none; }
          *::-webkit-scrollbar { display: none; }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", justifyContent: "center", gap: 0,
        background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>

        {/* LEFT SIDEBAR */}
        <aside className="demo-sidebar-left" style={{
          width: 320, flexShrink: 0,
          overflowY: "auto", padding: "40px 32px 24px",
          display: "flex", flexDirection: "column",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: C.accent, marginBottom: 24 }}>
            Prototype Demo
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: C.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", fontWeight: 700,
            }}>
              {DEMO_CONFIG.logoMark}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, margin: 0, color: C.text, letterSpacing: "0.01em" }}>
                {DEMO_CONFIG.studioName}
              </h1>
              <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>{DEMO_CONFIG.studioSubtitle}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
            {DEMO_CONFIG.features.map((f, i) => {
              const Icon = iconMap[f.icon] || Shield;
              return (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Icon size={18} color={C.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{f.title}</p>
                    <p style={{ fontSize: 13, color: C.textMuted, margin: "2px 0 0", lineHeight: 1.4 }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 12, color: C.textFaint, marginTop: 32, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Built by {DEMO_CONFIG.builderName} — {DEMO_CONFIG.builderUrl}
          </p>
        </aside>

        {/* CENTER PHONE */}
        <div className="demo-phone-wrap" style={{
          width: 390, flexShrink: 0,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            flex: 1,
            background: "#fff",
            boxShadow: "0 0 60px rgba(0,0,0,.12)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transform: "translateZ(0)",
          }}>
            <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
              <App onAdminChange={handleAdminChange} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="demo-sidebar-right" style={{
          width: 340, flexShrink: 0,
          overflowY: "auto", padding: "40px 32px 24px",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          {DEMO_CONFIG.salesCards.map((card, i) => {
            const Icon = iconMap[card.icon] || Shield;
            return (
              <div key={i} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: "24px 22px",
              }}>
                <Icon size={24} color={C.accent} strokeWidth={1.5} style={{ marginBottom: 12 }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.55, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            );
          })}

          <div style={{
            background: C.accent, borderRadius: 14, padding: "24px 22px", color: "#fff",
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>
              Ready to Launch?
            </h3>
            <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.55, margin: "0 0 16px" }}>
              Get your studio's custom loyalty app built and deployed in weeks, not months.
            </p>
            <a href="https://lumiclass.app" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 8, border: "2px solid rgba(255,255,255,.4)",
              background: "transparent", color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
            }}>
              Get Started
            </a>
          </div>
        </aside>
      </div>

      <style>{`
        .demo-sidebar-left, .demo-sidebar-right, .demo-phone-wrap > div > div {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .demo-sidebar-left::-webkit-scrollbar,
        .demo-sidebar-right::-webkit-scrollbar,
        .demo-phone-wrap > div > div::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1100px) {
          .demo-sidebar-left, .demo-sidebar-right { display: none !important; }
        }
      `}</style>
    </>
  );
}
