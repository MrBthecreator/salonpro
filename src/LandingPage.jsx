import { useState, useEffect } from "react";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0908; --surface: #141210; --surface2: #1e1b18;
      --border: #2a2723; --gold: #c9a84c; --gold-lt: #e4c97e;
      --cream: #f5ede0; --muted: #7a7167; --text: #e8ddd0;
      --green: #4caf7d; --red: #e05c5c; --blue: #5c9be0;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
    h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; font-weight: 600; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    .gold-btn {
      background: linear-gradient(135deg, var(--gold), var(--gold-lt));
      color: #1a1410; border: none; border-radius: 10px;
      padding: 14px 28px; font-family: 'DM Sans', sans-serif;
      font-weight: 700; font-size: 15px; cursor: pointer;
      transition: all .2s; display: inline-flex; align-items: center; gap: 8px;
    }
    .gold-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201,168,76,.4); }

    .ghost-btn {
      background: transparent; border: 1px solid var(--border);
      color: var(--text); border-radius: 10px; padding: 13px 28px;
      font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 15px;
      cursor: pointer; transition: all .2s;
    }
    .ghost-btn:hover { border-color: var(--gold); color: var(--gold); }

    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    @keyframes spin { to{transform:rotate(360deg)} }

    .fade-up { animation: fadeUp .6s ease both; }
    .delay-1 { animation-delay: .1s; }
    .delay-2 { animation-delay: .2s; }
    .delay-3 { animation-delay: .3s; }
    .delay-4 { animation-delay: .4s; }

    .gradient-text {
      background: linear-gradient(135deg, var(--gold), var(--gold-lt), #fff8e7, var(--gold));
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
    }

    .feature-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      transition: all .3s;
    }
    .feature-card:hover {
      border-color: var(--gold);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(201,168,76,.1);
    }

    section { padding: 100px 0; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 16px 0;
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(42,39,35,.5);
      background: rgba(10,9,8,.8);
    }

    .nav-inner {
      max-width: 1100px; margin: 0 auto; padding: 0 24px;
      display: flex; justify-content: space-between; align-items: center;
    }

    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 20px;
      background: rgba(201,168,76,.1); border: 1px solid rgba(201,168,76,.3);
      color: var(--gold); font-size: 12px; font-weight: 600;
    }

    .check-item {
      display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px;
    }
    .check-icon {
      width: 20px; height: 20px; border-radius: 50%;
      background: rgba(76,175,125,.15);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 1px;
    }

    .testimonial {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
    }

    .pricing-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      transition: all .3s;
    }
    .pricing-card.popular {
      border-color: var(--gold);
      box-shadow: 0 0 60px rgba(201,168,76,.15);
    }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .mobile-stack { flex-direction: column !important; }
      .mobile-full { width: 100% !important; }
      h1 { font-size: 42px !important; }
    }
  `}</style>
);

const Icon = ({ name, size=20, color="currentColor" }) => {
  const paths = {
    calendar: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z",
    ai:       "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zm-6 14l.75 2.25L9 20l-2.25.75L6 23l-.75-2.25L3 20l2.25-.75L6 17zm10 0l.75 2.25L19 20l-2.25.75L16 23l-.75-2.25L13 20l2.25-.75L16 17z",
    clients:  "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    sms:      "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
    stats:    "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
    check:    "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    star:     "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    arrow:    "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
    phone:    "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
    pain1:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
    pain2:    "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    pain3:    "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
    menu:     "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    close:    "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink:0 }}><path d={paths[name]||paths.star}/></svg>;
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToApp = () => window.location.href = "/app";

  return (
    <>
      <GlobalStyle />

      {/* NAV */}
      <nav style={{ borderBottomColor: scrolled ? "rgba(42,39,35,.8)" : "transparent" }}>
        <div className="nav-inner">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="star" size={16} color="#1a1410"/>
            </div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"var(--cream)" }}>SalonPro</span>
          </div>
          <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:32 }}>
            {["Features","Pricing","Testimonials"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color:"var(--muted)", fontSize:14, textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={e=>e.target.style.color="var(--cream)"}
                onMouseLeave={e=>e.target.style.color="var(--muted)"}>{item}</a>
            ))}
          </div>
          <div className="hide-mobile" style={{ display:"flex", gap:10 }}>
            <button className="ghost-btn" style={{ padding:"9px 20px", fontSize:14 }} onClick={goToApp}>Sign in</button>
            <button className="gold-btn" style={{ padding:"9px 20px", fontSize:14 }} onClick={goToApp}>Start Free Trial</button>
          </div>
          <button className="hide-desktop" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", color:"var(--text)", cursor:"pointer", display:"none" }}>
            <Icon name={menuOpen?"close":"menu"} size={24}/>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop:160, paddingBottom:80, position:"relative", overflow:"hidden" }}>
        {/* Background glow */}
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(201,168,76,.08) 0%, transparent 70%)", pointerEvents:"none" }}/>

        <div className="container" style={{ textAlign:"center" }}>
          <div className="fade-up" style={{ marginBottom:24 }}>
            <span className="badge">✦ Now with AI-powered automation</span>
          </div>

          <h1 className="fade-up delay-1" style={{ fontSize:72, lineHeight:1.05, marginBottom:24, color:"var(--cream)" }}>
            Your salon,<br/>
            <span className="gradient-text">perfectly organised</span>
          </h1>

          <p className="fade-up delay-2" style={{ fontSize:20, color:"var(--muted)", maxWidth:560, margin:"0 auto 40px", lineHeight:1.6 }}>
            SalonPro replaces your pen & paper, WhatsApp chaos, and missed calls with one beautiful system — powered by AI.
          </p>

          <div className="fade-up delay-3" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="gold-btn" style={{ fontSize:16, padding:"16px 32px" }} onClick={goToApp}>
              Start Free Trial <Icon name="arrow" size={18} color="#1a1410"/>
            </button>
            <button className="ghost-btn" style={{ fontSize:16, padding:"16px 32px" }}>
              Watch demo ▶
            </button>
          </div>

          <p className="fade-up delay-4" style={{ marginTop:16, fontSize:13, color:"var(--muted)" }}>
            14-day free trial · No credit card required · Cancel anytime
          </p>

          {/* Hero image / mockup */}
          <div className="fade-up delay-4" style={{ marginTop:64, position:"relative" }}>
            <div style={{ background:"linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)", border:"1px solid var(--border)", borderRadius:20, padding:24, maxWidth:800, margin:"0 auto", boxShadow:"0 40px 80px rgba(0,0,0,.6)", animation:"float 6s ease-in-out infinite" }}>
              {/* Fake dashboard preview */}
              <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:0, height:380, borderRadius:12, overflow:"hidden", border:"1px solid var(--border)" }}>
                {/* Sidebar */}
                <div style={{ background:"#1a1816", borderRight:"1px solid var(--border)", padding:16, display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,var(--gold),var(--gold-lt))" }}/>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:"var(--cream)", fontFamily:"'Cormorant Garamond',serif" }}>SalonPro</div>
                      <div style={{ fontSize:9, color:"var(--muted)" }}>MANAGEMENT</div>
                    </div>
                  </div>
                  {[["Dashboard","#c9a84c",true],["Calendar","#7a7167",false],["Clients","#7a7167",false],["AI Hub","#7a7167",false],["Analytics","#7a7167",false]].map(([label,color,active])=>(
                    <div key={label} style={{ padding:"8px 10px", borderRadius:8, background:active?"rgba(201,168,76,.12)":"transparent", fontSize:12, color, display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:active?"var(--gold)":"transparent", border:active?"none":"1px solid var(--border)" }}/>
                      {label}
                    </div>
                  ))}
                </div>
                {/* Main content */}
                <div style={{ background:"#0f0e0d", padding:16 }}>
                  <div style={{ fontSize:14, color:"var(--cream)", marginBottom:12, fontFamily:"'Cormorant Garamond',serif" }}>Good morning ✨</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
                    {[["Today","5","appts"],["Revenue","€890","this month"],["Clients","47","total"],["AI msgs","12","sent"]].map(([label,val,sub])=>(
                      <div key={label} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:10 }}>
                        <div style={{ fontSize:9, color:"var(--muted)", marginBottom:4 }}>{label}</div>
                        <div style={{ fontSize:18, fontWeight:700, color:"var(--cream)", fontFamily:"'Cormorant Garamond',serif" }}>{val}</div>
                        <div style={{ fontSize:9, color:"var(--muted)" }}>{sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:11, color:"var(--cream)", marginBottom:8 }}>Today's Schedule</div>
                    {[["09:00","Sofia M.","Balayage","#c9a84c"],["10:30","Ana R.","Gel Nails","#e08c5c"],["14:00","Mariana C.","Massage","#5c9be0"],["15:30","Pedro A.","Cut & Style","#c9a84c"]].map(([time,name,svc,color])=>(
                      <div key={time} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid var(--border)" }}>
                        <div style={{ fontSize:10, color:"var(--gold)", minWidth:36 }}>{time}</div>
                        <div style={{ width:3, height:24, background:color, borderRadius:2 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:10, color:"var(--cream)" }}>{name}</div>
                          <div style={{ fontSize:9, color:"var(--muted)" }}>{svc}</div>
                        </div>
                        <div style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(76,175,125,.15)", color:"var(--green)" }}>confirmed</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section style={{ padding:"80px 0", background:"var(--surface)" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontSize:42, color:"var(--cream)", marginBottom:12 }}>Sound familiar?</h2>
            <p style={{ color:"var(--muted)", fontSize:16 }}>Most salons are still running on chaos. SalonPro fixes all of it.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { icon:"pain1", problem:"Writing bookings on paper and losing them", fix:"Digital calendar with all bookings, synced instantly" },
              { icon:"pain2", problem:"Clients forget appointments, causing no-shows", fix:"Automatic WhatsApp reminders sent 24h before" },
              { icon:"pain3", problem:"Forgetting to follow up with clients after visits", fix:"AI writes and sends personalised follow-ups automatically" },
              { icon:"phone", problem:"Missing calls while working on a client", fix:"AI answers calls and books appointments automatically" },
              { icon:"stats", problem:"No idea which services make the most money", fix:"Real-time analytics show revenue by service and staff" },
              { icon:"clients", problem:"Client notes scattered across notebooks and phones", fix:"Full client profiles with history, preferences, and spending" },
            ].map(({ icon, problem, fix }) => (
              <div key={problem} className="feature-card">
                <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(224,92,92,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={icon} size={18} color="var(--red)"/>
                  </div>
                  <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.5, paddingTop:4 }}>"{problem}"</p>
                </div>
                <div style={{ borderTop:"1px solid var(--border)", paddingTop:12, display:"flex", gap:8 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(76,175,125,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    <Icon name="check" size={11} color="var(--green)"/>
                  </div>
                  <p style={{ fontSize:13, color:"var(--green)", lineHeight:1.5 }}>{fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span className="badge" style={{ marginBottom:16 }}>Everything you need</span>
            <h2 style={{ fontSize:48, color:"var(--cream)", marginBottom:16 }}>One app.<br/>Every thing your salon needs.</h2>
            <p style={{ color:"var(--muted)", fontSize:16, maxWidth:480, margin:"0 auto" }}>Built specifically for hair salons, nail studios, massage centres, and beauty clinics.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { icon:"calendar", color:"var(--gold)", title:"Smart Calendar", desc:"Weekly view with time slots, staff assignment, and instant booking. Click any slot to add an appointment in seconds." },
              { icon:"ai", color:"#9b8ec4", title:"AI Hub", desc:"Powered by Claude AI. Generates personalised follow-up messages, upsell campaigns, and win-back messages for each client." },
              { icon:"clients", color:"var(--blue)", title:"Client Profiles", desc:"Complete history of every visit, service, spending, and preferences. Know your clients better than they know themselves." },
              { icon:"sms", color:"var(--green)", title:"Automated Messages", desc:"Set up automatic WhatsApp, SMS, and email messages. Post-visit thanks, reminders, birthday offers — all automated." },
              { icon:"stats", color:"var(--red)", title:"Analytics", desc:"See which services are most profitable, which staff perform best, and which clients are at risk of leaving." },
              { icon:"phone", color:"var(--gold)", title:"Services & Pricing", desc:"Manage your full service menu with prices and durations. Update pricing across your entire catalogue in one click." },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className="feature-card">
                <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                  <Icon name={icon} size={22} color={color}/>
                </div>
                <h3 style={{ fontSize:18, color:"var(--cream)", marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ background:"var(--surface)" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontSize:42, color:"var(--cream)", marginBottom:12 }}>Salons love SalonPro</h2>
            <p style={{ color:"var(--muted)", fontSize:16 }}>Join hundreds of salons already saving hours every week</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { name:"Sofia Martins", role:"Owner, Studio Sofia — Lisboa", stars:5, text:"I used to spend 2 hours a day managing WhatsApp bookings. Now I spend 10 minutes. The AI follow-ups brought back 3 clients I hadn't seen in months." },
              { name:"Ana Rodrigues", role:"Nail Artist — Porto", stars:5, text:"My clients love getting the personalised messages. I thought it would feel robotic but they always reply saying how lovely it is. My rebooking rate went up 40%." },
              { name:"Carlos Silva", role:"Barbershop Owner — Coimbra", stars:5, text:"The calendar alone is worth it. No more double bookings, no more paper notebooks. My staff actually know their schedule without calling me every morning." },
            ].map(({ name, role, stars, text }) => (
              <div key={name} className="testimonial">
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>
                  {Array(stars).fill(0).map((_,i) => <Icon key={i} name="star" size={16} color="var(--gold)"/>)}
                </div>
                <p style={{ fontSize:14, color:"var(--text)", lineHeight:1.7, marginBottom:16, fontStyle:"italic" }}>"{text}"</p>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--cream)" }}>{name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontSize:42, color:"var(--cream)", marginBottom:12 }}>Simple pricing</h2>
            <p style={{ color:"var(--muted)", fontSize:16 }}>14-day free trial on all plans. No credit card required.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, maxWidth:900, margin:"0 auto" }}>
            {[
              { name:"Basic", price:29, color:"var(--blue)", features:["Unlimited clients & bookings","Smart calendar","Services & pricing","Basic analytics","Email support"] },
              { name:"Pro", price:59, color:"var(--gold)", popular:true, features:["Everything in Basic","AI message generator","AI assistant chat","Automated follow-ups","WhatsApp & SMS templates","Priority support"] },
              { name:"Premium", price:99, color:"#9b8ec4", features:["Everything in Pro","Real SMS & WhatsApp","Booking reminders","Website AI chat widget","Custom domain","Dedicated support"] },
            ].map(plan => (
              <div key={plan.name} className={`pricing-card ${plan.popular?"popular":""}`} style={{ position:"relative" }}>
                {plan.popular && <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", color:"#1a1410", padding:"4px 16px", borderRadius:20, fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>✦ Most Popular</div>}
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:plan.color, textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>{plan.name}</div>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:4 }}>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52, fontWeight:700, color:"var(--cream)", lineHeight:1 }}>€{plan.price}</span>
                    <span style={{ fontSize:14, color:"var(--muted)", marginBottom:8 }}>/month</span>
                  </div>
                </div>
                <div style={{ flex:1, marginBottom:24 }}>
                  {plan.features.map(f => (
                    <div key={f} className="check-item">
                      <div className="check-icon"><Icon name="check" size={12} color="var(--green)"/></div>
                      <span style={{ fontSize:13, color:"var(--text)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={goToApp} style={{ background:plan.popular?"linear-gradient(135deg,var(--gold),var(--gold-lt))":"transparent", border:plan.popular?"none":`1px solid ${plan.color}`, color:plan.popular?"#1a1410":plan.color, borderRadius:10, padding:"12px 20px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, cursor:"pointer", width:"100%", transition:"all .2s" }}
                  onMouseEnter={e=>{ if(!plan.popular){e.currentTarget.style.background=`${plan.color}15`;}else{e.currentTarget.style.opacity=".9";} }}
                  onMouseLeave={e=>{ if(!plan.popular){e.currentTarget.style.background="transparent";}else{e.currentTarget.style.opacity="1";} }}>
                  Start Free Trial →
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:32, display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
            {["🔒 Secure payments via Stripe","💳 No credit card to start","🔄 Cancel anytime","🇪🇺 GDPR compliant"].map(b=>(
              <span key={b} style={{ fontSize:13, color:"var(--muted)" }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:"var(--surface)", padding:"80px 0" }}>
        <div className="container" style={{ textAlign:"center" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <h2 style={{ fontSize:48, color:"var(--cream)", marginBottom:16, lineHeight:1.1 }}>
              Ready to transform<br/>your salon?
            </h2>
            <p style={{ fontSize:16, color:"var(--muted)", marginBottom:40, lineHeight:1.6 }}>
              Join salons across Europe that use SalonPro to save time, reduce no-shows, and grow their revenue with AI.
            </p>
            <button className="gold-btn" style={{ fontSize:17, padding:"18px 40px" }} onClick={goToApp}>
              Start Your Free Trial <Icon name="arrow" size={20} color="#1a1410"/>
            </button>
            <p style={{ marginTop:14, fontSize:13, color:"var(--muted)" }}>14 days free · No credit card · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid var(--border)", padding:"40px 0" }}>
        <div className="container" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,var(--gold),var(--gold-lt))", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="star" size={14} color="#1a1410"/>
            </div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:"var(--cream)" }}>SalonPro</span>
          </div>
          <div style={{ fontSize:13, color:"var(--muted)" }}>© 2026 SalonPro. All rights reserved.</div>
          <div style={{ display:"flex", gap:20 }}>
            {["Privacy","Terms","Contact"].map(l=>(
              <a key={l} href="#" style={{ fontSize:13, color:"var(--muted)", textDecoration:"none" }}
                onMouseEnter={e=>e.target.style.color="var(--gold)"}
                onMouseLeave={e=>e.target.style.color="var(--muted)"}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
