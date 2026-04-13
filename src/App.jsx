import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  SignIn, SignUp, useUser, useClerk,
  SignedIn, SignedOut
} from "@clerk/clerk-react";

// ─── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://tfutvrhuhaeremicicwp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdXR2cmh1aGFlcmVtaWNpY3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDM2ODksImV4cCI6MjA5MTY3OTY4OX0._Y-3fAa10LQE7OXkPaWK6lUurSCtH0NMl1WfnuYhHeA"
);

// ─── Global styles ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f0e0d; --surface: #1a1816; --surface2: #242220;
      --border: #2e2b28; --gold: #c9a84c; --gold-lt: #e4c97e;
      --cream: #f5ede0; --muted: #7a7167; --text: #e8ddd0;
      --green: #4caf7d; --red: #e05c5c; --blue: #5c9be0;
      --radius: 12px; --radius-lg: 18px;
    }
    html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
    h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; font-weight: 600; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    input, textarea, select {
      background: var(--surface2); border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 8px 12px; font-family: 'DM Sans', sans-serif;
      font-size: 14px; outline: none; transition: border .2s;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--gold); }
    .gold-btn {
      background: linear-gradient(135deg, var(--gold), var(--gold-lt)); color: #1a1410;
      border: none; border-radius: 8px; padding: 9px 18px;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
      cursor: pointer; transition: opacity .2s, transform .1s;
    }
    .gold-btn:hover { opacity: .9; transform: translateY(-1px); }
    .gold-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
    .ghost-btn {
      background: transparent; border: 1px solid var(--border); color: var(--muted);
      border-radius: 8px; padding: 8px 16px; font-family: 'DM Sans', sans-serif;
      font-size: 13px; cursor: pointer; transition: all .2s;
    }
    .ghost-btn:hover { border-color: var(--gold); color: var(--gold); }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-green { background: rgba(76,175,125,.15); color: var(--green); }
    .badge-gold  { background: rgba(201,168,76,.15);  color: var(--gold); }
    .badge-red   { background: rgba(224,92,92,.15);   color: var(--red); }
    .badge-blue  { background: rgba(92,155,224,.15);  color: var(--blue); }
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    .fade-up { animation: fadeUp .35s ease both; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .spin { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:.7} }

    /* Clerk override styles */
    .cl-rootBox { width: 100%; }
    .cl-card { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 18px !important; box-shadow: 0 24px 64px rgba(0,0,0,.5) !important; }
    .cl-headerTitle { color: var(--cream) !important; font-family: 'Cormorant Garamond', serif !important; font-size: 26px !important; }
    .cl-headerSubtitle { color: var(--muted) !important; }
    .cl-formButtonPrimary { background: linear-gradient(135deg, var(--gold), var(--gold-lt)) !important; color: #1a1410 !important; font-weight: 600 !important; border-radius: 8px !important; }
    .cl-formFieldInput { background: var(--surface2) !important; border-color: var(--border) !important; color: var(--text) !important; border-radius: 8px !important; }
    .cl-footerActionLink { color: var(--gold) !important; }
    .cl-socialButtonsBlockButton { background: var(--surface2) !important; border-color: var(--border) !important; color: var(--text) !important; border-radius: 8px !important; }
    .cl-dividerLine { background: var(--border) !important; }
    .cl-dividerText { color: var(--muted) !important; }
    .cl-formFieldLabel { color: var(--muted) !important; }
    .cl-internal-b3fm6y { background: var(--bg) !important; }
  `}</style>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const currency = (n) => `€${Number(n).toFixed(2)}`;
const today = new Date("2026-04-13");
const fmt = (d) => d.toISOString().split("T")[0];
const todayStr = fmt(today);
const timeSlots = Array.from({ length: 22 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2,"0")}:${m}`;
});
function weekDays(base) {
  const mon = new Date(base);
  mon.setDate(base.getDate() - ((base.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate()+i); return d; });
}
const STAFF = ["Lucia", "Rita", "João", "Marta"];
const CAT_COLORS = { Hair:"#c9a84c", Nails:"#e08c5c", Massage:"#5c9be0", Beauty:"#9b8ec4", Other:"#4caf7d" };

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=16, color="currentColor" }) => {
  const paths = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    calendar:  "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z",
    clients:   "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    services:  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    stats:     "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
    settings:  "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    sparkle:   "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zm-6 14l.75 2.25L9 20l-2.25.75L6 23l-.75-2.25L3 20l2.25-.75L6 17zm10 0l.75 2.25L19 20l-2.25.75L16 23l-.75-2.25L13 20l2.25-.75L16 17z",
    star:      "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    send:      "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z",
    bot:       "M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H4a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7 14v2a1 1 0 001 1h8a1 1 0 001-1v-2H7zm3 4v2h4v-2h-4z",
    clock:     "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
    mail:      "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    logout:    "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink:0 }}><path d={paths[name]||paths.star}/></svg>;
};

// ─── Auth Screen ──────────────────────────────────────────────────────────────
const AuthScreen = () => {
  const [mode, setMode] = useState("signin");
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"var(--bg)", padding:20 }}>
      {/* Logo */}
      <div style={{ marginBottom:40, textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
          <Icon name="star" size={28} color="#1a1410" />
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:700, color:"var(--cream)" }}>SalonPro</div>
        <div style={{ fontSize:13, color:"var(--muted)", marginTop:4, letterSpacing:".05em" }}>MANAGEMENT SUITE</div>
      </div>

      {/* Clerk component */}
      <div style={{ width:"100%", maxWidth:420 }}>
        {mode === "signin" ? (
          <SignIn
            appearance={{
              elements: {
                rootBox: { width:"100%" },
                card: { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:18, boxShadow:"0 24px 64px rgba(0,0,0,.5)" },
                headerTitle: { color:"var(--cream)", fontFamily:"'Cormorant Garamond',serif", fontSize:26 },
                headerSubtitle: { color:"var(--muted)" },
                formButtonPrimary: { background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", color:"#1a1410", fontWeight:600 },
                formFieldInput: { background:"var(--surface2)", borderColor:"var(--border)", color:"var(--text)" },
                footerActionLink: { color:"var(--gold)" },
                socialButtonsBlockButton: { background:"var(--surface2)", borderColor:"var(--border)", color:"var(--text)" },
                dividerLine: { background:"var(--border)" },
                dividerText: { color:"var(--muted)" },
                formFieldLabel: { color:"var(--muted)" },
                identityPreviewText: { color:"var(--text)" },
                identityPreviewEditButton: { color:"var(--gold)" },
              }
            }}
          />
        ) : (
          <SignUp
            appearance={{
              elements: {
                rootBox: { width:"100%" },
                card: { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:18, boxShadow:"0 24px 64px rgba(0,0,0,.5)" },
                headerTitle: { color:"var(--cream)", fontFamily:"'Cormorant Garamond',serif", fontSize:26 },
                headerSubtitle: { color:"var(--muted)" },
                formButtonPrimary: { background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", color:"#1a1410", fontWeight:600 },
                formFieldInput: { background:"var(--surface2)", borderColor:"var(--border)", color:"var(--text)" },
                footerActionLink: { color:"var(--gold)" },
                socialButtonsBlockButton: { background:"var(--surface2)", borderColor:"var(--border)", color:"var(--text)" },
                dividerLine: { background:"var(--border)" },
                dividerText: { color:"var(--muted)" },
                formFieldLabel: { color:"var(--muted)" },
              }
            }}
          />
        )}
        <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"var(--muted)" }}>
          {mode==="signin" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode==="signin"?"signup":"signin")} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            {mode==="signin" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color="var(--gold)" }) => (
  <div className="card fade-up" style={{ display:"flex", flexDirection:"column", gap:12 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div style={{ fontSize:13, color:"var(--muted)", fontWeight:500 }}>{label}</div>
      <div style={{ background:`${color}22`, borderRadius:8, padding:8, display:"flex" }}>
        <Icon name={icon} size={18} color={color} />
      </div>
    </div>
    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:600, color:"var(--cream)", lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:12, color:"var(--muted)" }}>{sub}</div>}
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ bookings, clients, services, salonName }) => {
  const todayBookings = bookings.filter(b => b.date===todayStr);
  const monthRevenue = bookings.filter(b => b.date?.startsWith("2026-04")).reduce((s,b) => {
    const svc = services.find(sv=>sv.id===b.service_id);
    return s+(svc?.price||0);
  }, 0);
  const upcoming = [...bookings].filter(b=>b.date>=todayStr).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,5);
  const svcPopularity = services.map(s=>({...s,count:bookings.filter(b=>b.service_id===s.id).length})).sort((a,b)=>b.count-a.count).slice(0,5);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <h2 style={{ fontSize:28, color:"var(--cream)" }}>Good morning ✨</h2>
          <p style={{ color:"var(--muted)", marginTop:4 }}>Here's what's happening at <strong style={{ color:"var(--gold)" }}>{salonName}</strong> today</p>
        </div>
        <div style={{ fontSize:13, color:"var(--muted)" }}>Monday, 13 April 2026</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        <StatCard label="Today's Appointments" value={todayBookings.length} sub={`${todayBookings.filter(b=>b.status==="confirmed").length} confirmed`} icon="calendar" />
        <StatCard label="April Revenue" value={currency(monthRevenue)} sub="Live from database" icon="stats" color="var(--green)" />
        <StatCard label="Total Clients" value={clients.length} sub="Saved in Supabase" icon="clients" color="var(--blue)" />
        <StatCard label="Total Services" value={services.length} sub="Across all categories" icon="services" color="#9b8ec4" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="card fade-up">
          <h3 style={{ fontSize:18, marginBottom:16, color:"var(--cream)" }}>Today's Schedule</h3>
          {todayBookings.length===0 && <p style={{ color:"var(--muted)", fontSize:14 }}>No bookings today.</p>}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {todayBookings.sort((a,b)=>a.time.localeCompare(b.time)).map(b => {
              const client=clients.find(c=>c.id===b.client_id);
              const svc=services.find(s=>s.id===b.service_id);
              return (
                <div key={b.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"var(--surface2)", borderRadius:10, borderLeft:`3px solid ${svc?.color||"var(--gold)"}` }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--gold)", minWidth:44 }}>{b.time}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:"var(--cream)" }}>{client?.name}</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>{svc?.name} · {b.staff}</div>
                  </div>
                  <span className={`badge ${b.status==="confirmed"?"badge-green":"badge-gold"}`}>{b.status}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card fade-up">
          <h3 style={{ fontSize:18, marginBottom:16, color:"var(--cream)" }}>Top Services</h3>
          {svcPopularity.length===0 && <p style={{ color:"var(--muted)", fontSize:14 }}>Add services to see stats.</p>}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {svcPopularity.map((s,i) => (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontFamily:"monospace", fontSize:12, color:"var(--muted)", minWidth:16 }}>#{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:"var(--cream)" }}>{s.name}</div>
                  <div style={{ height:4, background:"var(--surface2)", borderRadius:4, marginTop:4 }}>
                    <div style={{ height:"100%", width:`${Math.max((s.count/(svcPopularity[0]?.count||1))*100,8)}%`, background:s.color, borderRadius:4 }} />
                  </div>
                </div>
                <div style={{ fontSize:13, color:"var(--gold)", fontWeight:600 }}>{currency(s.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card fade-up">
        <h3 style={{ fontSize:18, marginBottom:16, color:"var(--cream)" }}>Upcoming Appointments</h3>
        {upcoming.length===0 && <p style={{ color:"var(--muted)", fontSize:14 }}>No upcoming bookings yet.</p>}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)", color:"var(--muted)", fontSize:12 }}>
                {["Date","Time","Client","Service","Staff","Price","Status"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontWeight:500 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {upcoming.map(b => {
                const client=clients.find(c=>c.id===b.client_id);
                const svc=services.find(s=>s.id===b.service_id);
                return (
                  <tr key={b.id} style={{ borderBottom:"1px solid var(--border)" }}>
                    <td style={{ padding:"10px 12px", color:"var(--muted)" }}>{b.date}</td>
                    <td style={{ padding:"10px 12px", color:"var(--gold)", fontWeight:600 }}>{b.time}</td>
                    <td style={{ padding:"10px 12px", color:"var(--cream)", fontWeight:500 }}>{client?.name}</td>
                    <td style={{ padding:"10px 12px" }}>{svc?.name}</td>
                    <td style={{ padding:"10px 12px", color:"var(--muted)" }}>{b.staff}</td>
                    <td style={{ padding:"10px 12px", color:"var(--gold)" }}>{currency(svc?.price||0)}</td>
                    <td style={{ padding:"10px 12px" }}><span className={`badge ${b.status==="confirmed"?"badge-green":"badge-gold"}`}>{b.status}</span></td>
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
  const [form, setForm] = useState({ clientId:"", serviceId:"", staff:STAFF[0], notes:"" });
  const [saving, setSaving] = useState(false);
  const days = weekDays(weekBase);
  const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const saveBooking = async () => {
    if (!form.clientId || !form.serviceId) return;
    setSaving(true);
    const { data, error } = await supabase.from("bookings").insert([{
      client_id:Number(form.clientId), service_id:Number(form.serviceId),
      date:selectedSlot.date, time:selectedSlot.time, staff:form.staff,
      status:"confirmed", notes:form.notes
    }]).select();
    if (!error && data) setBookings(p=>[...p,data[0]]);
    setSaving(false); setShowModal(false);
  };

  const deleteBooking = async (id) => {
    await supabase.from("bookings").delete().eq("id",id);
    setBookings(p=>p.filter(b=>b.id!==id));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontSize:24, color:"var(--cream)" }}>Calendar</h2>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button className="ghost-btn" onClick={()=>{const d=new Date(weekBase);d.setDate(d.getDate()-7);setWeekBase(d);}}>← Prev</button>
          <span style={{ fontSize:14, color:"var(--muted)", minWidth:150, textAlign:"center" }}>{days[0].toLocaleDateString("en",{month:"short",day:"numeric"})} – {days[6].toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric"})}</span>
          <button className="ghost-btn" onClick={()=>{const d=new Date(weekBase);d.setDate(d.getDate()+7);setWeekBase(d);}}>Next →</button>
          <button className="ghost-btn" onClick={()=>setWeekBase(new Date(today))}>Today</button>
        </div>
      </div>
      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"64px repeat(7,1fr)", borderBottom:"1px solid var(--border)" }}>
          <div style={{ padding:"12px 8px", borderRight:"1px solid var(--border)" }}/>
          {days.map((d,i) => {
            const isToday=fmt(d)===todayStr;
            return <div key={i} style={{ padding:"12px 8px", textAlign:"center", borderRight:i<6?"1px solid var(--border)":"none", background:isToday?"rgba(201,168,76,.07)":"transparent" }}>
              <div style={{ fontSize:11, color:"var(--muted)", marginBottom:2 }}>{DAY_NAMES[i]}</div>
              <div style={{ fontSize:16, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:isToday?"var(--gold)":"var(--cream)" }}>{d.getDate()}</div>
            </div>;
          })}
        </div>
        <div style={{ maxHeight:520, overflowY:"auto" }}>
          {timeSlots.map(slot => (
            <div key={slot} style={{ display:"grid", gridTemplateColumns:"64px repeat(7,1fr)", borderBottom:"1px solid var(--border)", minHeight:52 }}>
              <div style={{ padding:"4px 8px", fontSize:11, color:"var(--muted)", borderRight:"1px solid var(--border)", paddingTop:6, textAlign:"right" }}>{slot}</div>
              {days.map((d,di) => {
                const dayBks=bookings.filter(b=>b.date===fmt(d)&&b.time===slot);
                const isToday=fmt(d)===todayStr;
                return <div key={di} onClick={()=>{setSelectedSlot({date:fmt(d),time:slot});setForm({clientId:"",serviceId:"",staff:STAFF[0],notes:""});setShowModal(true);}}
                  style={{ borderRight:di<6?"1px solid var(--border)":"none", padding:"3px 4px", cursor:"pointer", background:isToday?"rgba(201,168,76,.03)":"transparent" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background=isToday?"rgba(201,168,76,.03)":"transparent"}>
                  {dayBks.map(b=>{
                    const client=clients.find(c=>c.id===b.client_id);
                    const svc=services.find(s=>s.id===b.service_id);
                    return <div key={b.id} onClick={e=>e.stopPropagation()} style={{ background:svc?.color?`${svc.color}33`:"rgba(201,168,76,.2)", border:`1px solid ${svc?.color||"var(--gold)"}66`, borderRadius:6, padding:"3px 6px", marginBottom:2, fontSize:11 }}>
                      <div style={{ fontWeight:600, color:svc?.color||"var(--gold)" }}>{client?.name}</div>
                      <div style={{ color:"var(--muted)" }}>{svc?.name}</div>
                      <button onClick={()=>deleteBooking(b.id)} style={{ background:"none", border:"none", color:"var(--red)", cursor:"pointer", fontSize:10, padding:0 }}>✕</button>
                    </div>;
                  })}
                </div>;
              })}
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }} onClick={()=>setShowModal(false)}>
          <div className="card fade-up" style={{ width:420, padding:28 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontSize:20, color:"var(--cream)" }}>New Booking</h3>
              <button className="ghost-btn" style={{ padding:"4px 10px" }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div style={{ fontSize:13, color:"var(--gold)", marginBottom:16 }}>📅 {selectedSlot?.date} at {selectedSlot?.time}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Client</label>
                <select style={{ width:"100%" }} value={form.clientId} onChange={e=>setForm(p=>({...p,clientId:e.target.value}))}>
                  <option value="">Select client…</option>
                  {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
              <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Service</label>
                <select style={{ width:"100%" }} value={form.serviceId} onChange={e=>setForm(p=>({...p,serviceId:e.target.value}))}>
                  <option value="">Select service…</option>
                  {services.map(s=><option key={s.id} value={s.id}>{s.category} · {s.name} – {currency(s.price)}</option>)}
                </select></div>
              <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Staff</label>
                <select style={{ width:"100%" }} value={form.staff} onChange={e=>setForm(p=>({...p,staff:e.target.value}))}>
                  {STAFF.map(s=><option key={s}>{s}</option>)}
                </select></div>
              <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Notes</label>
                <textarea style={{ width:"100%", minHeight:70 }} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Special requests…"/></div>
              <button className="gold-btn" onClick={saveBooking} disabled={saving}>{saving?"Saving…":"Confirm Booking"}</button>
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
  const [newClient, setNewClient] = useState({ name:"", phone:"", email:"", notes:"" });
  const [saving, setSaving] = useState(false);

  const filtered = clients.filter(c=>c.name?.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase())||c.phone?.includes(search));
  const clientBookings = (cid) => bookings.filter(b=>b.client_id===cid).map(b=>({...b,svc:services.find(s=>s.id===b.service_id)})).sort((a,b)=>b.date?.localeCompare(a.date));

  const addClient = async () => {
    if (!newClient.name) return;
    setSaving(true);
    const { data, error } = await supabase.from("clients").insert([{ name:newClient.name, phone:newClient.phone, email:newClient.email, notes:newClient.notes, tags:[], total_spent:0, visits:0, last_visit:"—" }]).select();
    if (!error && data) setClients(p=>[...p,data[0]]);
    setNewClient({ name:"", phone:"", email:"", notes:"" });
    setSaving(false); setShowAdd(false);
  };

  const deleteClient = async (id) => {
    await supabase.from("clients").delete().eq("id",id);
    setClients(p=>p.filter(c=>c.id!==id)); setSelected(null);
  };

  return (
    <div style={{ display:"flex", gap:20, height:"calc(100vh - 120px)" }}>
      <div style={{ width:320, display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"flex", gap:8 }}>
          <input style={{ flex:1 }} placeholder="Search clients…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <button className="gold-btn" onClick={()=>setShowAdd(true)}>+ Add</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.length===0 && <p style={{ color:"var(--muted)", fontSize:14, padding:8 }}>No clients yet.</p>}
          {filtered.map(c=>(
            <div key={c.id} className="card" onClick={()=>setSelected(c)} style={{ cursor:"pointer", padding:"14px 16px", border:selected?.id===c.id?"1px solid var(--gold)":"1px solid var(--border)" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontWeight:600, color:"var(--cream)", fontSize:15 }}>{c.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{c.phone}</div>
                </div>
                <div style={{ display:"flex", gap:4 }}>{(c.tags||[]).map(t=><span key={t} className={`badge ${t==="VIP"?"badge-gold":"badge-blue"}`}>{t}</span>)}</div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:"var(--muted)" }}>
                <span>{c.visits||0} visits</span>
                <span style={{ color:"var(--gold)" }}>{currency(c.total_spent||0)} total</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16, overflowY:"auto" }}>
          <div className="card" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <h2 style={{ fontSize:26, color:"var(--cream)" }}>{selected.name}</h2>
              <div style={{ display:"flex", gap:16, marginTop:8, fontSize:14, color:"var(--muted)" }}>
                <span>📧 {selected.email||"—"}</span><span>📞 {selected.phone||"—"}</span>
              </div>
              {selected.notes && <p style={{ marginTop:10, fontSize:13, color:"var(--muted)", fontStyle:"italic" }}>"{selected.notes}"</p>}
            </div>
            <button className="ghost-btn" style={{ color:"var(--red)", borderColor:"var(--red)" }} onClick={()=>deleteClient(selected.id)}>Delete</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            <StatCard label="Total Visits" value={selected.visits||0} icon="calendar"/>
            <StatCard label="Total Spent" value={currency(selected.total_spent||0)} icon="stats" color="var(--green)"/>
            <StatCard label="Last Visit" value={selected.last_visit||"—"} icon="clock" color="var(--blue)"/>
          </div>
          <div className="card">
            <h3 style={{ fontSize:18, marginBottom:14, color:"var(--cream)" }}>Booking History</h3>
            {clientBookings(selected.id).length===0 && <p style={{ color:"var(--muted)", fontSize:14 }}>No bookings yet.</p>}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {clientBookings(selected.id).map(b=>(
                <div key={b.id} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 14px", background:"var(--surface2)", borderRadius:10 }}>
                  <div style={{ fontSize:13, color:"var(--muted)", minWidth:90 }}>{b.date}</div>
                  <div style={{ flex:1 }}><div style={{ fontSize:14, color:"var(--cream)" }}>{b.svc?.name}</div><div style={{ fontSize:12, color:"var(--muted)" }}>{b.staff}</div></div>
                  <span className={`badge ${b.status==="confirmed"?"badge-green":"badge-gold"}`}>{b.status}</span>
                  <div style={{ fontSize:13, color:"var(--gold)", fontWeight:600 }}>{currency(b.svc?.price||0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)" }}>Select a client to view details</div>}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }} onClick={()=>setShowAdd(false)}>
          <div className="card fade-up" style={{ width:400, padding:28 }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontSize:20, color:"var(--cream)", marginBottom:20 }}>New Client</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[["Name","name","Full name"],["Phone","phone","+351 9xx xxx xxx"],["Email","email","email@example.com"]].map(([label,key,ph])=>(
                <div key={key}><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>{label}</label>
                  <input style={{ width:"100%" }} placeholder={ph} value={newClient[key]} onChange={e=>setNewClient(p=>({...p,[key]:e.target.value}))}/></div>
              ))}
              <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Notes</label>
                <textarea style={{ width:"100%", minHeight:70 }} value={newClient.notes} onChange={e=>setNewClient(p=>({...p,notes:e.target.value}))} placeholder="Preferences…"/></div>
              <button className="gold-btn" onClick={addClient} disabled={saving}>{saving?"Saving…":"Add Client"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Services ─────────────────────────────────────────────────────────────────
const ServicesView = ({ services, setServices }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category:"Hair", name:"", price:"", duration:"60" });
  const [saving, setSaving] = useState(false);
  const CATS = ["Hair","Nails","Massage","Beauty","Other"];

  const addService = async () => {
    if (!form.name||!form.price) return;
    setSaving(true);
    const { data, error } = await supabase.from("services").insert([{ name:form.name, category:form.category, price:Number(form.price), duration:Number(form.duration), color:CAT_COLORS[form.category]||"#c9a84c" }]).select();
    if (!error&&data) setServices(p=>[...p,data[0]]);
    setForm({ category:"Hair", name:"", price:"", duration:"60" });
    setSaving(false); setShowAdd(false);
  };

  const deleteService = async (id) => {
    await supabase.from("services").delete().eq("id",id);
    setServices(p=>p.filter(s=>s.id!==id));
  };

  const grouped = CATS.reduce((acc,cat)=>{ acc[cat]=services.filter(s=>s.category===cat); return acc; },{});

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontSize:24, color:"var(--cream)" }}>Services & Pricing</h2>
        <button className="gold-btn" onClick={()=>setShowAdd(true)}>+ Add Service</button>
      </div>
      {services.length===0 && <div className="card" style={{ textAlign:"center", padding:40 }}><p style={{ color:"var(--muted)" }}>No services yet. Add your first service!</p></div>}
      {CATS.map(cat=>grouped[cat].length>0&&(
        <div key={cat} className="card fade-up">
          <h3 style={{ fontSize:18, marginBottom:14, color:CAT_COLORS[cat]||"var(--gold)" }}>{cat}</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
            {grouped[cat].map(s=>(
              <div key={s.id} style={{ background:"var(--surface2)", borderRadius:12, padding:16, borderTop:`3px solid ${s.color}`, position:"relative" }}>
                <button onClick={()=>deleteService(s.id)} style={{ position:"absolute", top:8, right:8, background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:14 }}>✕</button>
                <div style={{ fontSize:15, fontWeight:600, color:"var(--cream)", marginBottom:4 }}>{s.name}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>⏱ {s.duration} min</div>
                <div style={{ fontSize:22, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:s.color }}>{currency(s.price)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }} onClick={()=>setShowAdd(false)}>
          <div className="card fade-up" style={{ width:400, padding:28 }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontSize:20, color:"var(--cream)", marginBottom:20 }}>Add Service</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Category</label>
                <select style={{ width:"100%" }} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select></div>
              <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Service Name</label>
                <input style={{ width:"100%" }} placeholder="e.g. Highlights" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Price (€)</label>
                  <input style={{ width:"100%" }} type="number" min="0" placeholder="75" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/></div>
                <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Duration (min)</label>
                  <input style={{ width:"100%" }} type="number" min="15" placeholder="60" value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))}/></div>
              </div>
              <button className="gold-btn" onClick={addService} disabled={saving}>{saving?"Saving…":"Save Service"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AI Hub ───────────────────────────────────────────────────────────────────
const AIHub = ({ clients, bookings, services, salonName }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [msgType, setMsgType] = useState("email");
  const [aiGoal, setAiGoal] = useState("follow-up");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role:"assistant", content:`Hi! I'm your SalonPro AI for **${salonName}**. I can write follow-up messages, upsell campaigns, and more!` }]);
  const [chatLoading, setChatLoading] = useState(false);
  const [tab, setTab] = useState("msg");
  const chatEndRef = useRef(null);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[chatHistory]);

  const generateMessage = async () => {
    if (!selectedClient) return;
    setLoading(true); setResult("");
    const client = clients.find(c=>c.id===Number(selectedClient));
    const lastBk = bookings.filter(b=>b.client_id===client.id).sort((a,b)=>b.date?.localeCompare(a.date))[0];
    const lastSvc = lastBk ? services.find(s=>s.id===lastBk.service_id) : null;
    const prompt = `You are a professional salon assistant for "${salonName}". Write a ${msgType==="email"?"personalized email":msgType==="sms"?"short SMS (max 160 chars)":"WhatsApp message"} for goal: "${aiGoal}". Client: ${client.name}, last visit: ${client.last_visit} (${lastSvc?.name||"unknown"}), ${client.visits||0} visits, notes: ${client.notes||"none"}. Services available: ${services.map(s=>`${s.name} (€${s.price})`).join(", ")}. ${msgType==="email"?"Include subject line first starting with 'Subject:'.":""} Write only the message, be warm and personal.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data = await res.json();
      setResult(data.content?.[0]?.text||"Error.");
    } catch { setResult("Connection error."); }
    setLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg=chatInput.trim(); setChatInput("");
    const newHistory=[...chatHistory,{role:"user",content:userMsg}];
    setChatHistory(newHistory); setChatLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are SalonPro AI for "${salonName}". Clients: ${clients.map(c=>c.name).join(", ")}. Services: ${services.map(s=>s.name).join(", ")}.`,messages:newHistory.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      setChatHistory(p=>[...p,{role:"assistant",content:data.content?.[0]?.text||"Error."}]);
    } catch { setChatHistory(p=>[...p,{role:"assistant",content:"Connection error."}]); }
    setChatLoading(false);
  };

  const GOALS=[{value:"follow-up",label:"Follow-up after visit"},{value:"rebooking reminder",label:"Rebooking reminder"},{value:"upsell",label:"Upsell / upgrade"},{value:"win-back",label:"Win-back (inactive)"},{value:"birthday offer",label:"Birthday special"},{value:"new service announcement",label:"New service launch"}];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><h2 style={{ fontSize:24, color:"var(--cream)" }}>AI Hub</h2><p style={{ color:"var(--muted)", fontSize:13, marginTop:2 }}>Powered by Claude</p></div>
        <div style={{ display:"flex", padding:4, background:"var(--surface2)", borderRadius:10, gap:2 }}>
          {[["msg","Message Generator","mail"],["chat","AI Assistant","bot"]].map(([id,label,icon])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"none", background:tab===id?"var(--surface)":"transparent", color:tab===id?"var(--gold)":"var(--muted)", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>
              <Icon name={icon} size={14}/> {label}
            </button>
          ))}
        </div>
      </div>
      {tab==="msg" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div className="card" style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <h3 style={{ fontSize:18, color:"var(--cream)" }}>Generate Message</h3>
            <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Client</label>
              <select style={{ width:"100%" }} value={selectedClient||""} onChange={e=>setSelectedClient(e.target.value)}>
                <option value="">Choose client…</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:4, display:"block" }}>Goal</label>
              <select style={{ width:"100%" }} value={aiGoal} onChange={e=>setAiGoal(e.target.value)}>
                {GOALS.map(g=><option key={g.value} value={g.value}>{g.label}</option>)}
              </select></div>
            <div><label style={{ fontSize:12, color:"var(--muted)", marginBottom:6, display:"block" }}>Channel</label>
              <div style={{ display:"flex", gap:8 }}>
                {[["email","📧 Email"],["sms","📱 SMS"],["whatsapp","💬 WhatsApp"]].map(([val,label])=>(
                  <button key={val} onClick={()=>setMsgType(val)} style={{ flex:1, padding:"8px", border:`1px solid ${msgType===val?"var(--gold)":"var(--border)"}`, borderRadius:8, background:msgType===val?"rgba(201,168,76,.12)":"transparent", color:msgType===val?"var(--gold)":"var(--muted)", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>{label}</button>
                ))}
              </div></div>
            <button className="gold-btn" onClick={generateMessage} disabled={!selectedClient||loading}>{loading?<><span className="spin" style={{ marginRight:6 }}>◌</span>Generating…</>:"✨ Generate with AI"}</button>
          </div>
          <div className="card" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ fontSize:18, color:"var(--cream)" }}>Generated Message</h3>
              {result&&<button className="ghost-btn" style={{ fontSize:11 }} onClick={()=>navigator.clipboard?.writeText(result)}>Copy</button>}
            </div>
            <div style={{ flex:1, background:"var(--surface2)", borderRadius:12, padding:16, minHeight:300, overflowY:"auto", fontSize:14, lineHeight:1.7, color:result?"var(--text)":"var(--muted)", fontStyle:result?"normal":"italic", whiteSpace:"pre-wrap" }}>
              {loading?<div style={{ display:"flex", flexDirection:"column", gap:8 }}>{[100,80,90,60].map((w,i)=><div key={i} style={{ height:14, borderRadius:4, background:"var(--border)", width:`${w}%`, animation:`pulse 1.2s ${i*.15}s infinite` }}/>)}</div>:result||"Your AI-generated message will appear here…"}
            </div>
            {result&&<button className="gold-btn">Send {msgType==="email"?"📧 Email":msgType==="sms"?"📱 SMS":"💬 WhatsApp"}</button>}
          </div>
        </div>
      )}
      {tab==="chat" && (
        <div className="card" style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 220px)" }}>
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:16, marginBottom:12 }}>
            {chatHistory.map((msg,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
                {msg.role==="assistant"&&<div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:10, marginTop:2 }}><Icon name="sparkle" size={14} color="#1a1410"/></div>}
                <div style={{ maxWidth:"72%", padding:"12px 16px", borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:msg.role==="user"?"linear-gradient(135deg,var(--gold),var(--gold-lt))":"var(--surface2)", color:msg.role==="user"?"#1a1410":"var(--text)", fontSize:14, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{msg.content}</div>
              </div>
            ))}
            {chatLoading&&<div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="sparkle" size={14} color="#1a1410"/></div><div style={{ padding:"12px 16px", background:"var(--surface2)", borderRadius:"16px 16px 16px 4px", fontSize:20, color:"var(--gold)" }}><span className="spin">◌</span></div></div>}
            <div ref={chatEndRef}/>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <input style={{ flex:1 }} placeholder="Ask anything…" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()}/>
            <button className="gold-btn" onClick={sendChat} disabled={chatLoading}><Icon name="send" size={14}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const SalonApp = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [salonName, setSalonName] = useState("Salon Élite");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [{ data:c },{ data:s },{ data:b }] = await Promise.all([
        supabase.from("clients").select("*").order("created_at",{ascending:false}),
        supabase.from("services").select("*").order("created_at",{ascending:true}),
        supabase.from("bookings").select("*").order("date",{ascending:true}),
      ]);
      if (c) setClients(c);
      if (s) setServices(s);
      if (b) setBookings(b);
      setLoading(false);
    };
    loadData();
  }, []);

  const NAV = [
    { id:"dashboard", label:"Dashboard", icon:"dashboard" },
    { id:"calendar",  label:"Calendar",  icon:"calendar" },
    { id:"clients",   label:"Clients",   icon:"clients" },
    { id:"services",  label:"Services",  icon:"services" },
    { id:"ai",        label:"AI Hub",    icon:"sparkle" },
  ];

  if (loading) return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name="star" size={24} color="#1a1410"/>
      </div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:"var(--cream)" }}>Loading your salon…</div>
    </div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <aside style={{ width:220, background:"var(--surface)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="star" size={18} color="#1a1410"/>
            </div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700, color:"var(--cream)" }}>SalonPro</div>
              <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".05em", textTransform:"uppercase" }}>Management Suite</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontSize:11, color:"var(--muted)", marginBottom:2 }}>Logged in as</div>
          <div style={{ fontWeight:600, color:"var(--gold)", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.emailAddresses?.[0]?.emailAddress}</div>
          <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{salonName}</div>
        </div>

        <nav style={{ flex:1, padding:"12px 10px", display:"flex", flexDirection:"column", gap:4 }}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setPage(item.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:"none", background:page===item.id?"rgba(201,168,76,.12)":"transparent", color:page===item.id?"var(--gold)":"var(--muted)", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:page===item.id?600:400, textAlign:"left", width:"100%", transition:"all .2s" }}>
              <Icon name={item.icon} size={16} color={page===item.id?"var(--gold)":"var(--muted)"}/>
              {item.label}
              {item.id==="ai"&&<span style={{ marginLeft:"auto", fontSize:9, background:"var(--gold)", color:"#1a1410", borderRadius:10, padding:"1px 6px", fontWeight:700 }}>AI</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding:"14px 16px", borderTop:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
            <span style={{ color:"var(--muted)" }}>Clients</span>
            <span style={{ color:"var(--gold)", fontWeight:600 }}>{clients.length}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
            <span style={{ color:"var(--muted)" }}>Services</span>
            <span style={{ color:"var(--cream)", fontWeight:600 }}>{services.length}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)" }}/>
            <div style={{ fontSize:11, color:"var(--muted)" }}>Supabase connected</div>
          </div>
          <button onClick={()=>signOut()} style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:"1px solid var(--border)", borderRadius:8, padding:"7px 10px", color:"var(--muted)", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", marginTop:4, width:"100%", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--red)";e.currentTarget.style.color="var(--red)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
            <Icon name="logout" size={14}/> Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex:1, overflowY:"auto", padding:"28px 28px" }}>
        {page==="dashboard" && <Dashboard bookings={bookings} clients={clients} services={services} salonName={salonName}/>}
        {page==="calendar"  && <CalendarView bookings={bookings} setBookings={setBookings} clients={clients} services={services}/>}
        {page==="clients"   && <Clients clients={clients} setClients={setClients} bookings={bookings} services={services}/>}
        {page==="services"  && <ServicesView services={services} setServices={setServices}/>}
        {page==="ai"        && <AIHub clients={clients} bookings={bookings} services={services} salonName={salonName}/>}
      </main>
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyle />
      <SignedOut>
        <AuthScreen />
      </SignedOut>
      <SignedIn>
        <SalonApp />
      </SignedIn>
    </>
  );
}
