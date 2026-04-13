import { useState, useEffect, useRef } from "react";

// ─── Fonts & global styles injected once ────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0f0e0d;
      --surface:  #1a1816;
      --surface2: #242220;
      --border:   #2e2b28;
      --gold:     #c9a84c;
      --gold-lt:  #e4c97e;
      --cream:    #f5ede0;
      --muted:    #7a7167;
      --text:     #e8ddd0;
      --green:    #4caf7d;
      --red:      #e05c5c;
      --blue:     #5c9be0;
      --radius:   12px;
      --radius-lg:18px;
      --shadow:   0 4px 24px rgba(0,0,0,0.4);
    }

    html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

    h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; font-weight: 600; letter-spacing: .02em; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    input, textarea, select {
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 8px;
      padding: 8px 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border .2s;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--gold); }

    .gold-btn {
      background: linear-gradient(135deg, var(--gold), var(--gold-lt));
      color: #1a1410;
      border: none;
      border-radius: 8px;
      padding: 9px 18px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: opacity .2s, transform .1s;
    }
    .gold-btn:hover { opacity: .9; transform: translateY(-1px); }
    .gold-btn:active { transform: translateY(0); }

    .ghost-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      border-radius: 8px;
      padding: 8px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      cursor: pointer;
      transition: all .2s;
    }
    .ghost-btn:hover { border-color: var(--gold); color: var(--gold); }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-green { background: rgba(76,175,125,.15); color: var(--green); }
    .badge-gold  { background: rgba(201,168,76,.15); color: var(--gold); }
    .badge-red   { background: rgba(224,92,92,.15);  color: var(--red); }
    .badge-blue  { background: rgba(92,155,224,.15); color: var(--blue); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp .35s ease both; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; display: inline-block; }

    .ai-typing::after {
      content: '▋';
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }
  `}</style>
);

// ─── Sample data ─────────────────────────────────────────────────────────────
const INITIAL_CLIENTS = [
  { id: 1, name: "Sofia Martins",   phone: "+351 912 345 678", email: "sofia@email.com",  lastVisit: "2026-03-28", totalSpent: 420, visits: 8,  tags: ["VIP","Hair"],    notes: "Prefers balayage, sensitive scalp" },
  { id: 2, name: "Ana Rodrigues",   phone: "+351 963 211 100", email: "ana.r@email.com",  lastVisit: "2026-04-01", totalSpent: 210, visits: 4,  tags: ["Nails"],         notes: "Gel nails, nude tones" },
  { id: 3, name: "Mariana Costa",   phone: "+351 934 567 890", email: "mcosta@email.com", lastVisit: "2026-03-10", totalSpent: 780, visits: 14, tags: ["VIP","Massage"],  notes: "Monthly deep tissue, 60min" },
  { id: 4, name: "Pedro Alves",     phone: "+351 925 111 222", email: "palves@email.com", lastVisit: "2026-02-14", totalSpent: 95,  visits: 2,  tags: ["Hair"],          notes: "Classic cut & beard" },
  { id: 5, name: "Inês Ferreira",   phone: "+351 916 888 777", email: "ines.f@email.com", lastVisit: "2026-04-05", totalSpent: 340, visits: 6,  tags: ["Hair","Nails"],  notes: "Keratin treatment fan" },
  { id: 6, name: "Carlos Silva",    phone: "+351 928 444 333", email: "csilva@email.com", lastVisit: "2026-01-20", totalSpent: 60,  visits: 1,  tags: [],                notes: "" },
];

const INITIAL_SERVICES = [
  { id: 1, category: "Hair",    name: "Cut & Style",        price: 45,  duration: 60,  color: "#c9a84c" },
  { id: 2, category: "Hair",    name: "Balayage",           price: 120, duration: 180, color: "#c9a84c" },
  { id: 3, category: "Hair",    name: "Keratin Treatment",  price: 150, duration: 120, color: "#c9a84c" },
  { id: 4, category: "Hair",    name: "Color Full",         price: 85,  duration: 90,  color: "#c9a84c" },
  { id: 5, category: "Nails",   name: "Gel Manicure",       price: 35,  duration: 60,  color: "#e08c5c" },
  { id: 6, category: "Nails",   name: "Pedicure",           price: 40,  duration: 75,  color: "#e08c5c" },
  { id: 7, category: "Nails",   name: "Nail Art (full)",    price: 55,  duration: 90,  color: "#e08c5c" },
  { id: 8, category: "Massage", name: "Swedish 60min",      price: 65,  duration: 60,  color: "#5c9be0" },
  { id: 9, category: "Massage", name: "Deep Tissue 90min",  price: 90,  duration: 90,  color: "#5c9be0" },
  { id: 10,category: "Beauty",  name: "Classic Facial",     price: 55,  duration: 60,  color: "#9b8ec4" },
  { id: 11,category: "Beauty",  name: "Brows & Lashes",     price: 30,  duration: 45,  color: "#9b8ec4" },
];

const today = new Date("2026-04-12");
const fmt = (d) => d.toISOString().split("T")[0];

const INITIAL_BOOKINGS = [
  { id: 1, clientId: 1, serviceId: 2, date: fmt(today), time: "09:00", staff: "Lucia", status: "confirmed", notes: "" },
  { id: 2, clientId: 2, serviceId: 5, date: fmt(today), time: "10:00", staff: "Rita",  status: "confirmed", notes: "" },
  { id: 3, clientId: 5, serviceId: 3, date: fmt(today), time: "11:00", staff: "Lucia", status: "pending",   notes: "First keratin" },
  { id: 4, clientId: 3, serviceId: 9, date: fmt(today), time: "14:00", staff: "João",  status: "confirmed", notes: "" },
  { id: 5, clientId: 4, serviceId: 1, date: fmt(today), time: "15:30", staff: "Lucia", status: "confirmed", notes: "" },
  { id: 6, clientId: 1, serviceId: 1, date: fmt(new Date("2026-04-14")), time: "10:00", staff: "Lucia", status: "confirmed", notes: "" },
  { id: 7, clientId: 6, serviceId: 8, date: fmt(new Date("2026-04-15")), time: "16:00", staff: "João",  status: "pending",   notes: "" },
];

const STAFF = ["Lucia", "Rita", "João", "Marta"];

// ─── Utility helpers ──────────────────────────────────────────────────────────
const currency = (n) => `€${Number(n).toFixed(2)}`;
const timeSlots = Array.from({ length: 22 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2,"0")}:${m}`;
});

function weekDays(base) {
  const mon = new Date(base);
  mon.setDate(base.getDate() - ((base.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const paths = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    calendar:  "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z",
    clients:   "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    services:  "M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.54 15.96.5 13.5.5c-1.55 0-2.8.79-3.5 1.85C9.3 1.29 8.05.5 6.5.5 4.04.5 2 2.54 2 4.65c0 .47.1.9.18 1.35H0l2 8.5h20l2-8.5h-4zm-5-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6.5 2.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM4 14v8h16v-8H4z",
    ai:        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    stats:     "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
    settings:  "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    send:      "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z",
    phone:     "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
    mail:      "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    whatsapp:  "M12 0C5.374 0 0 5.373 0 12c0 2.12.553 4.106 1.518 5.83L.057 24l6.304-1.655A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.494 16.574c-.232.647-1.344 1.24-1.848 1.32-.475.078-1.073.11-1.73-.108-.4-.13-.912-.307-1.566-.594-2.76-1.193-4.56-3.993-4.696-4.18-.134-.187-1.101-1.464-1.101-2.794 0-1.33.697-1.987 .944-2.258.247-.27.54-.337.72-.337l.519.009c.166.007.39-.064.61.465l.887 2.154c.075.18.125.39.025.624l-.33.481-.503.557c-.096.097-.196.202-.085.396.112.194.496.818 1.065 1.326.73.65 1.345.851 1.538.945.194.094.307.079.42-.047l.577-.662c.136-.155.27-.12.455-.053l2.077.977c.193.09.32.133.367.207.047.074.047.426-.184 1.073z",
    plus:      "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    close:     "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    edit:      "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    trash:     "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    check:     "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    star:      "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    bot:       "M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H4a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7 14v2a1 1 0 001 1h8a1 1 0 001-1v-2H7zm3 4v2h4v-2h-4z",
    arrow:     "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
    clock:     "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
    sparkle:   "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zm-6 14l.75 2.25L9 20l-2.25.75L6 23l-.75-2.25L3 20l2.25-.75L6 17zm10 0l.75 2.25L19 20l-2.25.75L16 23l-.75-2.25L13 20l2.25-.75L16 17z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d={paths[name] || paths.check} />
    </svg>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color = "var(--gold)" }) => (
  <div className="card fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
      <div style={{ background: `${color}22`, borderRadius: 8, padding: 8, display: "flex" }}>
        <Icon name={icon} size={18} color={color} />
      </div>
    </div>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "var(--cream)", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>}
  </div>
);

// ─── Dashboard ───────────────────────────────────────────────────────────────
const Dashboard = ({ bookings, clients, services, salonName }) => {
  const todayStr = fmt(today);
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const monthRevenue = bookings.filter(b => b.date.startsWith("2026-04")).reduce((s, b) => {
    const svc = services.find(sv => sv.id === b.serviceId);
    return s + (svc?.price || 0);
  }, 0);
  const upcoming = [...bookings].filter(b => b.date >= todayStr).sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).slice(0,5);

  const svcPopularity = services.map(s => ({
    ...s,
    count: bookings.filter(b => b.serviceId === s.id).length
  })).sort((a,b) => b.count - a.count).slice(0,5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: 28, color: "var(--cream)" }}>Good morning ✨</h2>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>Here's what's happening at <strong style={{ color: "var(--gold)" }}>{salonName}</strong> today</p>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Sunday, 12 April 2026</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Today's Appointments" value={todayBookings.length} sub={`${todayBookings.filter(b=>b.status==="confirmed").length} confirmed`} icon="calendar" />
        <StatCard label="April Revenue" value={currency(monthRevenue)} sub="Projected: €3,200" icon="stats" color="var(--green)" />
        <StatCard label="Total Clients" value={clients.length} sub={`${clients.filter(c=>c.tags.includes("VIP")).length} VIP`} icon="clients" color="var(--blue)" />
        <StatCard label="Avg. Ticket" value={currency(monthRevenue / Math.max(bookings.filter(b=>b.date.startsWith("2026-04")).length,1))} sub="vs €62 last month" icon="star" color="#9b8ec4" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Today's schedule */}
        <div className="card fade-up">
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--cream)" }}>Today's Schedule</h3>
          {todayBookings.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>No bookings today.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todayBookings.sort((a,b)=>a.time.localeCompare(b.time)).map(b => {
              const client = clients.find(c => c.id === b.clientId);
              const svc = services.find(s => s.id === b.serviceId);
              return (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface2)", borderRadius: 10, borderLeft: `3px solid ${svc?.color || "var(--gold)"}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", minWidth: 44 }}>{b.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--cream)" }}>{client?.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{svc?.name} · {b.staff}</div>
                  </div>
                  <span className={`badge ${b.status === "confirmed" ? "badge-green" : "badge-gold"}`}>{b.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top services */}
        <div className="card fade-up">
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--cream)" }}>Top Services</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {svcPopularity.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", minWidth: 16 }}>#{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--cream)" }}>{s.name}</div>
                  <div style={{ height: 4, background: "var(--surface2)", borderRadius: 4, marginTop: 4 }}>
                    <div style={{ height: "100%", width: `${Math.max((s.count / svcPopularity[0].count) * 100, 8)}%`, background: s.color, borderRadius: 4, transition: "width .5s" }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.count} bookings</div>
                <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, minWidth: 44, textAlign: "right" }}>{currency(s.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="card fade-up">
        <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--cream)" }}>Upcoming Appointments</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)", fontSize: 12 }}>
                {["Date","Time","Client","Service","Staff","Price","Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcoming.map(b => {
                const client = clients.find(c => c.id === b.clientId);
                const svc = services.find(s => s.id === b.serviceId);
                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{b.date}</td>
                    <td style={{ padding: "10px 12px", color: "var(--gold)", fontWeight: 600 }}>{b.time}</td>
                    <td style={{ padding: "10px 12px", color: "var(--cream)", fontWeight: 500 }}>{client?.name}</td>
                    <td style={{ padding: "10px 12px" }}>{svc?.name}</td>
                    <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{b.staff}</td>
                    <td style={{ padding: "10px 12px", color: "var(--gold)" }}>{currency(svc?.price || 0)}</td>
                    <td style={{ padding: "10px 12px" }}><span className={`badge ${b.status==="confirmed"?"badge-green":"badge-gold"}`}>{b.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Calendar ─────────────────────────────────────────────────────────────────
const CalendarView = ({ bookings, setBookings, clients, services }) => {
  const [weekBase, setWeekBase] = useState(new Date(today));
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ clientId: "", serviceId: "", staff: STAFF[0], notes: "" });
  const [view, setView] = useState("week"); // week | day

  const days = weekDays(weekBase);

  const bookingsForDay = (d) => bookings.filter(b => b.date === fmt(d));

  const openModal = (date, time) => {
    setSelectedSlot({ date: fmt(date), time });
    setForm({ clientId: "", serviceId: "", staff: STAFF[0], notes: "" });
    setShowModal(true);
  };

  const saveBooking = () => {
    if (!form.clientId || !form.serviceId) return;
    const nb = { id: Date.now(), clientId: Number(form.clientId), serviceId: Number(form.serviceId), date: selectedSlot.date, time: selectedSlot.time, staff: form.staff, status: "confirmed", notes: form.notes };
    setBookings(p => [...p, nb]);
    setShowModal(false);
  };

  const deleteBooking = (id) => setBookings(p => p.filter(b => b.id !== id));

  const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const todayStr = fmt(today);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, color: "var(--cream)" }}>Calendar</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="ghost-btn" onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate()-7); setWeekBase(d); }}>← Prev</button>
          <span style={{ fontSize: 14, color: "var(--muted)", minWidth: 150, textAlign: "center" }}>
            {days[0].toLocaleDateString("en",{month:"short",day:"numeric"})} – {days[6].toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric"})}
          </span>
          <button className="ghost-btn" onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate()+7); setWeekBase(d); }}>Next →</button>
          <button className="ghost-btn" onClick={() => setWeekBase(new Date(today))}>Today</button>
        </div>
      </div>

      {/* Week grid */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ padding: "12px 8px", borderRight: "1px solid var(--border)" }} />
          {days.map((d, i) => {
            const isToday = fmt(d) === todayStr;
            return (
              <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderRight: i<6 ? "1px solid var(--border)" : "none", background: isToday ? "rgba(201,168,76,.07)" : "transparent" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>{DAY_NAMES[i]}</div>
                <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: isToday ? "var(--gold)" : "var(--cream)" }}>{d.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {timeSlots.map(slot => (
            <div key={slot} style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", borderBottom: "1px solid var(--border)", minHeight: 52 }}>
              <div style={{ padding: "4px 8px", fontSize: 11, color: "var(--muted)", borderRight: "1px solid var(--border)", paddingTop: 6, textAlign: "right" }}>{slot}</div>
              {days.map((d, di) => {
                const dayBks = bookingsForDay(d).filter(b => b.time === slot);
                const isToday = fmt(d) === todayStr;
                return (
                  <div
                    key={di}
                    onClick={() => openModal(d, slot)}
                    style={{ borderRight: di<6 ? "1px solid var(--border)" : "none", padding: "3px 4px", cursor: "pointer", background: isToday ? "rgba(201,168,76,.03)" : "transparent", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = isToday ? "rgba(201,168,76,.03)" : "transparent"}
                  >
                    {dayBks.map(b => {
                      const client = clients.find(c => c.id === b.clientId);
                      const svc = services.find(s => s.id === b.serviceId);
                      return (
                        <div key={b.id} onClick={e => { e.stopPropagation(); }} style={{ background: svc?.color ? `${svc.color}33` : "rgba(201,168,76,.2)", border: `1px solid ${svc?.color || "var(--gold)"}66`, borderRadius: 6, padding: "3px 6px", marginBottom: 2, fontSize: 11 }}>
                          <div style={{ fontWeight: 600, color: svc?.color || "var(--gold)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{client?.name}</div>
                          <div style={{ color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{svc?.name}</div>
                          <button onClick={() => deleteBooking(b.id)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 10, padding: 0 }}>✕ remove</button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowModal(false)}>
          <div className="card fade-up" style={{ width: 420, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, color: "var(--cream)" }}>New Booking</h3>
              <button className="ghost-btn" style={{ padding: "4px 10px" }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: "var(--gold)", marginBottom: 16 }}>📅 {selectedSlot?.date} at {selectedSlot?.time}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Client</label>
                <select style={{ width: "100%" }} value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}>
                  <option value="">Select client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Service</label>
                <select style={{ width: "100%" }} value={form.serviceId} onChange={e => setForm(p => ({ ...p, serviceId: e.target.value }))}>
                  <option value="">Select service…</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.category} · {s.name} – {currency(s.price)}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Staff</label>
                <select style={{ width: "100%" }} value={form.staff} onChange={e => setForm(p => ({ ...p, staff: e.target.value }))}>
                  {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Notes</label>
                <textarea style={{ width: "100%", resize: "vertical", minHeight: 70 }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Special requests…" />
              </div>
              <button className="gold-btn" style={{ marginTop: 4 }} onClick={saveBooking}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Clients ──────────────────────────────────────────────────────────────────
const Clients = ({ clients, setClients, bookings, services }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "", notes: "" });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const clientBookings = (cid) => bookings.filter(b => b.clientId === cid).map(b => ({
    ...b, svc: services.find(s => s.id === b.serviceId)
  })).sort((a,b) => b.date.localeCompare(a.date));

  const addClient = () => {
    if (!newClient.name) return;
    setClients(p => [...p, { ...newClient, id: Date.now(), totalSpent: 0, visits: 0, tags: [], lastVisit: "—" }]);
    setNewClient({ name: "", phone: "", email: "", notes: "" });
    setShowAdd(false);
  };

  const deleteClient = (id) => { setClients(p => p.filter(c => c.id !== id)); setSelected(null); };

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 120px)" }}>
      {/* List */}
      <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ flex: 1 }} placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="gold-btn" onClick={() => setShowAdd(true)}>+ Add</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(c => (
            <div key={c.id} className="card" onClick={() => setSelected(c)} style={{ cursor: "pointer", padding: "14px 16px", border: selected?.id === c.id ? "1px solid var(--gold)" : "1px solid var(--border)", transition: "border .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--cream)", fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{c.phone}</div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {c.tags.map(t => <span key={t} className={`badge ${t==="VIP"?"badge-gold":"badge-blue"}`}>{t}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
                <span>{c.visits} visits</span>
                <span style={{ color: "var(--gold)" }}>{currency(c.totalSpent)} total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontSize: 26, color: "var(--cream)" }}>{selected.name}</h2>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                <span>📧 {selected.email}</span>
                <span>📞 {selected.phone}</span>
              </div>
              {selected.notes && <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>"{selected.notes}"</p>}
            </div>
            <button className="ghost-btn" style={{ color: "var(--red)", borderColor: "var(--red)" }} onClick={() => deleteClient(selected.id)}>Delete</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <StatCard label="Total Visits" value={selected.visits} icon="calendar" />
            <StatCard label="Total Spent" value={currency(selected.totalSpent)} icon="stats" color="var(--green)" />
            <StatCard label="Last Visit" value={selected.lastVisit} icon="clock" color="var(--blue)" />
          </div>

          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 14, color: "var(--cream)" }}>Booking History</h3>
            {clientBookings(selected.id).length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>No bookings yet.</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {clientBookings(selected.id).map(b => (
                <div key={b.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", background: "var(--surface2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 13, color: "var(--muted)", minWidth: 90 }}>{b.date}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: "var(--cream)" }}>{b.svc?.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{b.staff}</div>
                  </div>
                  <span className={`badge ${b.status==="confirmed"?"badge-green":"badge-gold"}`}>{b.status}</span>
                  <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>{currency(b.svc?.price || 0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
          Select a client to view details
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowAdd(false)}>
          <div className="card fade-up" style={{ width: 400, padding: 28 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, color: "var(--cream)", marginBottom: 20 }}>New Client</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Name","name","Full name"],["Phone","phone","+351 9xx xxx xxx"],["Email","email","email@example.com"]].map(([label,key,ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>{label}</label>
                  <input style={{ width: "100%" }} placeholder={ph} value={newClient[key]} onChange={e => setNewClient(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Notes</label>
                <textarea style={{ width: "100%", minHeight: 70 }} value={newClient.notes} onChange={e => setNewClient(p => ({ ...p, notes: e.target.value }))} placeholder="Preferences, allergies…" />
              </div>
              <button className="gold-btn" onClick={addClient}>Add Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Services & Pricing ───────────────────────────────────────────────────────
const ServicesView = ({ services, setServices }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: "Hair", name: "", price: "", duration: "60", color: "#c9a84c" });
  const CATS = ["Hair","Nails","Massage","Beauty","Other"];
  const CAT_COLORS = { Hair: "#c9a84c", Nails: "#e08c5c", Massage: "#5c9be0", Beauty: "#9b8ec4", Other: "#4caf7d" };

  const addService = () => {
    if (!form.name || !form.price) return;
    setServices(p => [...p, { ...form, id: Date.now(), price: Number(form.price), duration: Number(form.duration), color: CAT_COLORS[form.category] || "#c9a84c" }]);
    setForm({ category: "Hair", name: "", price: "", duration: "60", color: "#c9a84c" });
    setShowAdd(false);
  };

  const grouped = CATS.reduce((acc, cat) => {
    acc[cat] = services.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, color: "var(--cream)" }}>Services & Pricing</h2>
        <button className="gold-btn" onClick={() => setShowAdd(true)}>+ Add Service</button>
      </div>

      {CATS.map(cat => grouped[cat].length > 0 && (
        <div key={cat} className="card fade-up">
          <h3 style={{ fontSize: 18, marginBottom: 14, color: CAT_COLORS[cat] || "var(--gold)" }}>{cat}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 12 }}>
            {grouped[cat].map(s => (
              <div key={s.id} style={{ background: "var(--surface2)", borderRadius: 12, padding: 16, borderTop: `3px solid ${s.color}`, position: "relative" }}>
                <button onClick={() => setServices(p => p.filter(sv => sv.id !== s.id))} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--cream)", marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>⏱ {s.duration} min</div>
                <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: s.color }}>{currency(s.price)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowAdd(false)}>
          <div className="card fade-up" style={{ width: 400, padding: 28 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, color: "var(--cream)", marginBottom: 20 }}>Add Service</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Category</label>
                <select style={{ width: "100%" }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Service Name</label>
                <input style={{ width: "100%" }} placeholder="e.g. Highlights" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Price (€)</label>
                  <input style={{ width: "100%" }} type="number" min="0" placeholder="75" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Duration (min)</label>
                  <input style={{ width: "100%" }} type="number" min="15" placeholder="60" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
                </div>
              </div>
              <button className="gold-btn" style={{ marginTop: 8 }} onClick={addService}>Save Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AI Hub ───────────────────────────────────────────────────────────────────
const AIHub = ({ clients, bookings, services, salonName }) => {
  const [activeTab, setActiveTab] = useState("followup");
  const [selectedClient, setSelectedClient] = useState(null);
  const [msgType, setMsgType] = useState("email");
  const [aiGoal, setAiGoal] = useState("follow-up");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: `Hi! I'm your SalonPro AI assistant for **${salonName}**. I can help you write follow-up messages, upsell campaigns, and handle client communications. What would you like to do today?` }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const generateMessage = async () => {
    if (!selectedClient) return;
    setLoading(true);
    setResult("");
    const client = clients.find(c => c.id === Number(selectedClient));
    const lastVisitBookings = bookings.filter(b => b.clientId === client.id).sort((a,b) => b.date.localeCompare(a.date));
    const lastSvc = lastVisitBookings[0] ? services.find(s => s.id === lastVisitBookings[0].serviceId) : null;
    const allSvcs = services.map(s => `${s.name} (${currency(s.price)})`).join(", ");

    const prompt = `You are a professional salon communication assistant for "${salonName}".
Write a ${msgType === "email" ? "personalized email" : msgType === "sms" ? "short SMS (max 160 chars)" : "WhatsApp message"} for the goal: "${aiGoal}".

Client info:
- Name: ${client.name}
- Last visit: ${client.lastVisit} (${lastSvc ? lastSvc.name : "unknown service"})
- Total visits: ${client.visits}
- Notes: ${client.notes || "none"}
- Tags: ${client.tags.join(", ") || "none"}

Available services: ${allSvcs}

Write only the message content, no explanations. Be warm, personal, professional. If upsell, suggest a complementary service naturally. ${msgType === "email" ? "Include a subject line as the first line starting with 'Subject:'." : ""}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "Error generating message.");
    } catch (e) {
      setResult("Connection error. Please try again.");
    }
    setLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newHistory = [...chatHistory, { role: "user", content: userMsg }];
    setChatHistory(newHistory);
    setChatLoading(true);

    const clientList = clients.map(c => `${c.name} (last visit: ${c.lastVisit}, spent: €${c.totalSpent})`).join("\n");
    const systemPrompt = `You are SalonPro AI, the intelligent assistant for the salon "${salonName}". 
You help with client follow-ups, upselling, marketing messages, scheduling advice, and business insights.
Current clients:\n${clientList}
Available services: ${services.map(s => s.name).join(", ")}
Always be helpful, concise, and professional. You can draft messages, suggest campaigns, analyze client data.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that.";
      setChatHistory(p => [...p, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatHistory(p => [...p, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setChatLoading(false);
  };

  const GOALS = [
    { value: "follow-up", label: "Follow-up after visit" },
    { value: "rebooking reminder", label: "Rebooking reminder" },
    { value: "upsell", label: "Upsell / upgrade" },
    { value: "win-back", label: "Win-back (inactive client)" },
    { value: "birthday offer", label: "Birthday special offer" },
    { value: "new service announcement", label: "New service announcement" },
  ];

  const tabs = [
    { id: "followup", label: "Message Generator", icon: "mail" },
    { id: "chat", label: "AI Assistant", icon: "bot" },
    { id: "automation", label: "Automation Rules", icon: "sparkle" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 24, color: "var(--cream)" }}>AI Hub</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Powered by Claude · Automate your client communications</p>
        </div>
        <div style={{ display: "flex", padding: 4, background: "var(--surface2)", borderRadius: 10, gap: 2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "none", background: activeTab === t.id ? "var(--surface)" : "transparent", color: activeTab === t.id ? "var(--gold)" : "var(--muted)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all .2s" }}>
              <Icon name={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "followup" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Config */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontSize: 18, color: "var(--cream)" }}>Generate Message</h3>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Client</label>
              <select style={{ width: "100%" }} value={selectedClient || ""} onChange={e => setSelectedClient(e.target.value)}>
                <option value="">Choose client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>Goal</label>
              <select style={{ width: "100%" }} value={aiGoal} onChange={e => setAiGoal(e.target.value)}>
                {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block" }}>Channel</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["email","📧 Email"],["sms","📱 SMS"],["whatsapp","💬 WhatsApp"]].map(([val,label]) => (
                  <button key={val} onClick={() => setMsgType(val)} style={{ flex: 1, padding: "8px", border: `1px solid ${msgType===val?"var(--gold)":"var(--border)"}`, borderRadius: 8, background: msgType===val?"rgba(201,168,76,.12)":"transparent", color: msgType===val?"var(--gold)":"var(--muted)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {selectedClient && (
              <div style={{ background: "var(--surface2)", borderRadius: 10, padding: 12, fontSize: 12 }}>
                {(() => {
                  const c = clients.find(cl => cl.id === Number(selectedClient));
                  return c ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, color: "var(--muted)" }}>
                      <span style={{ color: "var(--cream)", fontWeight: 600 }}>{c.name}</span>
                      <span>Last visit: {c.lastVisit} · {c.visits} visits · {currency(c.totalSpent)} spent</span>
                      {c.notes && <span style={{ fontStyle: "italic" }}>"{c.notes}"</span>}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
            <button className="gold-btn" onClick={generateMessage} disabled={!selectedClient || loading} style={{ opacity: (!selectedClient || loading) ? .5 : 1 }}>
              {loading ? <><span className="spin" style={{ marginRight: 6 }}>◌</span>Generating…</> : "✨ Generate with AI"}
            </button>
          </div>

          {/* Result */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 18, color: "var(--cream)" }}>Generated Message</h3>
              {result && <button className="ghost-btn" style={{ fontSize: 11 }} onClick={() => navigator.clipboard?.writeText(result)}>Copy</button>}
            </div>
            <div style={{ flex: 1, background: "var(--surface2)", borderRadius: 12, padding: 16, minHeight: 300, overflowY: "auto", fontSize: 14, lineHeight: 1.7, color: result ? "var(--text)" : "var(--muted)", fontStyle: result ? "normal" : "italic", whiteSpace: "pre-wrap" }}>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 20 }}>
                  {[100,80,90,60].map((w,i) => (
                    <div key={i} style={{ height: 14, borderRadius: 4, background: "var(--border)", width: `${w}%`, animation: `blink 1.2s ${i*0.15}s infinite` }} />
                  ))}
                  <style>{`@keyframes blink { 0%,100%{opacity:.3} 50%{opacity:.7} }`}</style>
                </div>
              ) : result || "Your AI-generated message will appear here…"}
            </div>
            {result && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="gold-btn" style={{ flex: 1 }}>
                  {msgType === "email" ? "📧 Send Email" : msgType === "sms" ? "📱 Send SMS" : "💬 Send WhatsApp"}
                </button>
                <button className="ghost-btn" onClick={generateMessage}>Regenerate</button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)" }}>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: "4px 0", marginBottom: 12 }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold-lt))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 10, marginTop: 2 }}>
                    <Icon name="sparkle" size={14} color="#1a1410" />
                  </div>
                )}
                <div style={{
                  maxWidth: "72%",
                  padding: "12px 16px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? "linear-gradient(135deg,var(--gold),var(--gold-lt))" : "var(--surface2)",
                  color: msg.role === "user" ? "#1a1410" : "var(--text)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  fontWeight: msg.role === "user" ? 500 : 400,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold-lt))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="sparkle" size={14} color="#1a1410" />
                </div>
                <div style={{ padding: "12px 16px", background: "var(--surface2)", borderRadius: "16px 16px 16px 4px", fontSize: 20, color: "var(--gold)" }}>
                  <span className="spin" style={{ display: "inline-block" }}>◌</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              style={{ flex: 1 }}
              placeholder="Ask your AI assistant anything… e.g. 'Write a win-back campaign for clients not seen in 60 days'"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
            />
            <button className="gold-btn" onClick={sendChat} disabled={chatLoading}>
              <Icon name="send" size={14} />
            </button>
          </div>
        </div>
      )}

      {activeTab === "automation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Set up automatic messages triggered by client actions or time-based rules.</p>
          {[
            { title: "Post-Visit Thank You", trigger: "24h after appointment", channel: "WhatsApp", status: true, goal: "Follow-up + review request" },
            { title: "Rebooking Reminder", trigger: "4 weeks after last visit", channel: "SMS", status: true, goal: "Drive repeat bookings" },
            { title: "Birthday Offer", trigger: "3 days before birthday", channel: "Email", status: false, goal: "VIP birthday discount" },
            { title: "Win-Back Campaign", trigger: "60 days no visit", channel: "Email + SMS", status: true, goal: "Re-engage lapsed clients" },
            { title: "Appointment Reminder", trigger: "24h before booking", channel: "SMS", status: true, goal: "Reduce no-shows" },
            { title: "Upsell After Service", trigger: "48h after hair service", channel: "WhatsApp", status: false, goal: "Suggest treatments" },
          ].map((rule, i) => (
            <div key={i} className="card fade-up" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 24, borderRadius: 12, background: rule.status ? "var(--green)" : "var(--border)", cursor: "pointer", position: "relative", transition: "background .3s" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: rule.status ? 18 : 2, transition: "left .3s" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "var(--cream)", fontSize: 15 }}>{rule.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>⏱ {rule.trigger} · {rule.goal}</div>
              </div>
              <span className={`badge ${rule.channel.includes("Email") ? "badge-blue" : rule.channel.includes("SMS") ? "badge-green" : "badge-gold"}`}>{rule.channel}</span>
              <button className="ghost-btn" style={{ fontSize: 12 }}>Edit</button>
            </div>
          ))}
          <button className="gold-btn" style={{ alignSelf: "flex-start" }}>+ Create New Rule</button>
        </div>
      )}
    </div>
  );
};

// ─── Analytics ────────────────────────────────────────────────────────────────
const Analytics = ({ bookings, clients, services }) => {
  const monthlyData = [
    { month: "Nov", revenue: 2100, bookings: 38 },
    { month: "Dec", revenue: 2800, bookings: 51 },
    { month: "Jan", revenue: 1900, bookings: 34 },
    { month: "Feb", revenue: 2350, bookings: 43 },
    { month: "Mar", revenue: 2750, bookings: 49 },
    { month: "Apr", revenue: 1420, bookings: 21, partial: true },
  ];
  const maxRev = Math.max(...monthlyData.map(m => m.revenue));

  const catRevenue = ["Hair","Nails","Massage","Beauty"].map(cat => {
    const catSvcs = services.filter(s => s.category === cat);
    const rev = bookings.reduce((s,b) => {
      const svc = catSvcs.find(sv => sv.id === b.serviceId);
      return s + (svc?.price || 0);
    }, 0);
    return { cat, rev };
  });
  const maxCat = Math.max(...catRevenue.map(c => c.rev));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 24, color: "var(--cream)" }}>Analytics</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <StatCard label="Total Revenue (all time)" value="€14,320" sub="Since opening" icon="stats" />
        <StatCard label="No-show Rate" value="4.2%" sub="Industry avg: 8%" icon="clock" color="var(--green)" />
        <StatCard label="Client Retention" value="78%" sub="+5% vs last quarter" icon="clients" color="var(--blue)" />
        <StatCard label="Avg. Satisfaction" value="4.8★" sub="Based on 92 reviews" icon="star" color="#9b8ec4" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Revenue chart */}
        <div className="card fade-up">
          <h3 style={{ fontSize: 18, marginBottom: 20, color: "var(--cream)" }}>Monthly Revenue</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {monthlyData.map(m => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{currency(m.revenue).replace(".00","")}</div>
                <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: m.partial ? "rgba(201,168,76,.4)" : "linear-gradient(180deg,var(--gold-lt),var(--gold))", height: `${(m.revenue / maxRev) * 120}px`, transition: "height .5s", position: "relative" }}>
                  {m.partial && <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>in progress</div>}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card fade-up">
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--cream)" }}>By Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {catRevenue.map(({ cat, rev }) => {
              const colors = { Hair: "#c9a84c", Nails: "#e08c5c", Massage: "#5c9be0", Beauty: "#9b8ec4" };
              return (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: "var(--cream)" }}>{cat}</span>
                    <span style={{ color: colors[cat] }}>{currency(rev)}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--surface2)", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${maxCat > 0 ? (rev/maxCat)*100 : 0}%`, background: colors[cat], borderRadius: 4, transition: "width .5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Client segments */}
      <div className="card fade-up">
        <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--cream)" }}>Client Segments</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "Champions", desc: "High value, recent", count: 2, color: "var(--gold)" },
            { label: "Loyal", desc: "Regular visitors", count: 2, color: "var(--green)" },
            { label: "At Risk", desc: "Haven't visited 30d+", count: 1, color: "var(--red)" },
            { label: "New", desc: "First visit in 30d", count: 1, color: "var(--blue)" },
          ].map(seg => (
            <div key={seg.label} style={{ background: "var(--surface2)", borderRadius: 12, padding: 16, textAlign: "center", borderTop: `3px solid ${seg.color}` }}>
              <div style={{ fontSize: 32, fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: seg.color }}>{seg.count}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--cream)", marginTop: 4 }}>{seg.label}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{seg.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Settings ─────────────────────────────────────────────────────────────────
const Settings = ({ salonName, setSalonName }) => {
  const [name, setName] = useState(salonName);
  const [saved, setSaved] = useState(false);

  const save = () => { setSalonName(name); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
      <h2 style={{ fontSize: 24, color: "var(--cream)" }}>Settings</h2>

      {[{
        title: "Salon Information",
        fields: [
          { label: "Salon Name", val: name, set: setName, ph: "My Beautiful Salon" },
        ]
      }].map(section => (
        <div key={section.title} className="card fade-up">
          <h3 style={{ fontSize: 17, color: "var(--cream)", marginBottom: 16 }}>{section.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {section.fields.map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>{f.label}</label>
                <input style={{ width: "100%" }} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Phone","+351 2xx xxx xxx"],["Email","salon@email.com"],["Address","Rua example, Lisboa"],["Opening Hours","Tue-Sat 9:00–19:00"]].map(([l,ph]) => (
                <div key={l}>
                  <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" }}>{l}</label>
                  <input style={{ width: "100%" }} placeholder={ph} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="card fade-up">
        <h3 style={{ fontSize: 17, color: "var(--cream)", marginBottom: 16 }}>AI & Integrations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "WhatsApp Business API", badge: "Configure", color: "var(--green)" },
            { label: "Twilio SMS", badge: "Configure", color: "var(--blue)" },
            { label: "Mailgun / SendGrid", badge: "Configure", color: "var(--gold)" },
            { label: "Website AI Chat Widget", badge: "Configure", color: "#9b8ec4" },
            { label: "Google Calendar Sync", badge: "Connect", color: "var(--red)" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--surface2)", borderRadius: 10 }}>
              <span style={{ fontSize: 14, color: "var(--cream)" }}>{item.label}</span>
              <button className="ghost-btn" style={{ fontSize: 12 }}>{item.badge}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-up">
        <h3 style={{ fontSize: 17, color: "var(--cream)", marginBottom: 16 }}>Website Booking Widget</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Embed this snippet into your website to allow online bookings and an AI assistant chat.</p>
        <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, fontFamily: "monospace", fontSize: 12, color: "var(--gold-lt)", overflowX: "auto" }}>
          {`<script src="https://salonpro.app/widget.js"\n  data-salon="${name.replace(/\s+/g,"-").toLowerCase()}"\n  data-theme="gold"\n  data-features="booking,ai-chat"\n></script>`}
        </div>
        <button className="ghost-btn" style={{ marginTop: 10, fontSize: 12 }} onClick={() => navigator.clipboard?.writeText("")}>Copy Code</button>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="gold-btn" onClick={save}>{saved ? "✓ Saved!" : "Save Settings"}</button>
        <button className="ghost-btn">Cancel</button>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [salonName, setSalonName] = useState("Salon Élite");

  const NAV = [
    { id: "dashboard", label: "Dashboard",  icon: "dashboard" },
    { id: "calendar",  label: "Calendar",   icon: "calendar" },
    { id: "clients",   label: "Clients",    icon: "clients" },
    { id: "services",  label: "Services",   icon: "services" },
    { id: "ai",        label: "AI Hub",     icon: "sparkle" },
    { id: "analytics", label: "Analytics",  icon: "stats" },
    { id: "settings",  label: "Settings",   icon: "settings" },
  ];

  const todayBookings = bookings.filter(b => b.date === fmt(today)).length;

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--gold),var(--gold-lt))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="star" size={18} color="#1a1410" />
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: "var(--cream)", letterSpacing: ".02em" }}>SalonPro</div>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".05em", textTransform: "uppercase" }}>Management Suite</div>
              </div>
            </div>
          </div>

          {/* Salon badge */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Active Salon</div>
            <div style={{ fontWeight: 600, color: "var(--gold)", fontSize: 14 }}>{salonName}</div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: page === item.id ? "rgba(201,168,76,.12)" : "transparent", color: page === item.id ? "var(--gold)" : "var(--muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: page === item.id ? 600 : 400, textAlign: "left", width: "100%", transition: "all .2s" }}>
                <Icon name={item.icon} size={16} color={page === item.id ? "var(--gold)" : "var(--muted)"} />
                {item.label}
                {item.id === "ai" && <span style={{ marginLeft: "auto", fontSize: 9, background: "var(--gold)", color: "#1a1410", borderRadius: 10, padding: "1px 6px", fontWeight: 700 }}>AI</span>}
              </button>
            ))}
          </nav>

          {/* Bottom quick stats */}
          <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--muted)" }}>Today's appts</span>
              <span style={{ color: "var(--gold)", fontWeight: 600 }}>{todayBookings}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--muted)" }}>Total clients</span>
              <span style={{ color: "var(--cream)", fontWeight: 600 }}>{clients.length}</span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
            <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>Powered by Claude AI ✦</div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
          {page === "dashboard"  && <Dashboard  bookings={bookings} clients={clients} services={services} salonName={salonName} />}
          {page === "calendar"   && <CalendarView bookings={bookings} setBookings={setBookings} clients={clients} services={services} />}
          {page === "clients"    && <Clients     clients={clients} setClients={setClients} bookings={bookings} services={services} />}
          {page === "services"   && <ServicesView services={services} setServices={setServices} />}
          {page === "ai"         && <AIHub       clients={clients} bookings={bookings} services={services} salonName={salonName} />}
          {page === "analytics"  && <Analytics   bookings={bookings} clients={clients} services={services} />}
          {page === "settings"   && <Settings    salonName={salonName} setSalonName={setSalonName} />}
        </main>
      </div>
    </>
  );
}
