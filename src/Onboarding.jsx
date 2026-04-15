import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tfutvrhuhaeremicicwp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdXR2cmh1aGFlcmVtaWNpY3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDM2ODksImV4cCI6MjA5MTY3OTY4OX0._Y-3fAa10LQE7OXkPaWK6lUurSCtH0NMl1WfnuYhHeA"
);

const CAT_COLORS = { Hair:"#c9a84c", Nails:"#e08c5c", Massage:"#5c9be0", Beauty:"#9b8ec4", Other:"#4caf7d" };

const PRESET_SERVICES = {
  Hair: [
    { name:"Cut & Style", price:45, duration:60 },
    { name:"Balayage", price:120, duration:180 },
    { name:"Color Full", price:85, duration:90 },
    { name:"Keratin Treatment", price:150, duration:120 },
  ],
  Nails: [
    { name:"Gel Manicure", price:35, duration:60 },
    { name:"Pedicure", price:40, duration:75 },
    { name:"Nail Art", price:55, duration:90 },
  ],
  Massage: [
    { name:"Swedish 60min", price:65, duration:60 },
    { name:"Deep Tissue 90min", price:90, duration:90 },
  ],
  Beauty: [
    { name:"Classic Facial", price:55, duration:60 },
    { name:"Brows & Lashes", price:30, duration:45 },
  ],
};

export default function Onboarding({ user, userData, onComplete }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [salonName, setSalonName] = useState("");
  const [salonPhone, setSalonPhone] = useState("");
  const [salonAddress, setSalonAddress] = useState("");

  // Step 2
  const [selectedCategory, setSelectedCategory] = useState("Hair");
  const [selectedServices, setSelectedServices] = useState([]);
  const [customService, setCustomService] = useState({ name:"", price:"", duration:"60" });

  // Step 3
  const [staffNames, setStaffNames] = useState(["", "", ""]);

  const totalSteps = 3;

  const toggleService = (svc) => {
    const exists = selectedServices.find(s => s.name === svc.name);
    if (exists) {
      setSelectedServices(prev => prev.filter(s => s.name !== svc.name));
    } else {
      setSelectedServices(prev => [...prev, { ...svc, category: selectedCategory }]);
    }
  };

  const addCustomService = () => {
    if (!customService.name || !customService.price) return;
    setSelectedServices(prev => [...prev, {
      name: customService.name,
      price: Number(customService.price),
      duration: Number(customService.duration),
      category: selectedCategory
    }]);
    setCustomService({ name:"", price:"", duration:"60" });
  };

  const handleFinish = async () => {
    setSaving(true);

    // Update user record
    await supabase.from("users").update({
      salon_name: salonName || "My Salon",
      salon_phone: salonPhone,
      salon_address: salonAddress,
      onboarded: true,
    }).eq("id", user.id);

    // Add services
    for (const svc of selectedServices) {
      await supabase.from("services").insert([{
        name: svc.name,
        category: svc.category,
        price: svc.price,
        duration: svc.duration,
        color: CAT_COLORS[svc.category] || "#c9a84c",
        user_id: user.id,
      }]);
    }

    setSaving(false);
    onComplete({
      salon_name: salonName || "My Salon",
      onboarded: true,
    });
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0f0e0d", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        input, select { background: #242220; border: 1px solid #2e2b28; color: #e8ddd0; border-radius: 8px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; width: 100%; transition: border .2s; }
        input:focus, select:focus { border-color: #c9a84c; }
      `}</style>

      <div style={{ width:"100%", maxWidth:580 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#c9a84c,#e4c97e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="#1a1410"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:"#f5ede0" }}>SalonPro</div>
        </div>

        {/* Progress */}
        <div style={{ display:"flex", gap:8, marginBottom:32 }}>
          {Array.from({length:totalSteps},(_,i)=>(
            <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i+1<=step ? "linear-gradient(135deg,#c9a84c,#e4c97e)" : "#2e2b28", transition:"background .3s" }}/>
          ))}
        </div>

        <div style={{ background:"#1a1816", border:"1px solid #2e2b28", borderRadius:20, padding:32 }}>

          {/* STEP 1 — Salon Info */}
          {step===1 && (
            <div>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:12, color:"#c9a84c", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Step 1 of 3</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:"#f5ede0", marginBottom:8 }}>Tell us about your salon</h2>
                <p style={{ color:"#7a7167", fontSize:14 }}>This helps personalise your experience and client communications.</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <label style={{ fontSize:12, color:"#7a7167", marginBottom:6, display:"block" }}>Salon Name *</label>
                  <input placeholder="e.g. Sofia's Hair Studio" value={salonName} onChange={e=>setSalonName(e.target.value)}/>
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#7a7167", marginBottom:6, display:"block" }}>Phone Number</label>
                  <input placeholder="+351 9xx xxx xxx" value={salonPhone} onChange={e=>setSalonPhone(e.target.value)}/>
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#7a7167", marginBottom:6, display:"block" }}>Address</label>
                  <input placeholder="Rua Example, Lisboa" value={salonAddress} onChange={e=>setSalonAddress(e.target.value)}/>
                </div>
              </div>
              <button onClick={()=>setStep(2)} disabled={!salonName} style={{ marginTop:24, width:"100%", background: salonName?"linear-gradient(135deg,#c9a84c,#e4c97e)":"#2e2b28", color: salonName?"#1a1410":"#7a7167", border:"none", borderRadius:10, padding:"13px 20px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, cursor:salonName?"pointer":"not-allowed", transition:"all .2s" }}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 — Services */}
          {step===2 && (
            <div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, color:"#c9a84c", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Step 2 of 3</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:"#f5ede0", marginBottom:8 }}>Add your services</h2>
                <p style={{ color:"#7a7167", fontSize:14 }}>Select from presets or add your own. You can always add more later.</p>
              </div>

              {/* Category tabs */}
              <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
                {Object.keys(PRESET_SERVICES).map(cat=>(
                  <button key={cat} onClick={()=>setSelectedCategory(cat)} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${selectedCategory===cat?CAT_COLORS[cat]:"#2e2b28"}`, background:selectedCategory===cat?`${CAT_COLORS[cat]}22`:"transparent", color:selectedCategory===cat?CAT_COLORS[cat]:"#7a7167", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Preset services */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                {PRESET_SERVICES[selectedCategory].map(svc=>{
                  const selected = selectedServices.find(s=>s.name===svc.name);
                  return (
                    <div key={svc.name} onClick={()=>toggleService(svc)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background: selected?"rgba(201,168,76,.1)":"#242220", border:`1px solid ${selected?"#c9a84c":"#2e2b28"}`, borderRadius:10, cursor:"pointer", transition:"all .2s" }}>
                      <div>
                        <div style={{ fontSize:14, color:"#f5ede0", fontWeight:500 }}>{svc.name}</div>
                        <div style={{ fontSize:12, color:"#7a7167" }}>⏱ {svc.duration} min</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ fontSize:16, fontFamily:"'Cormorant Garamond',serif", color:"#c9a84c", fontWeight:600 }}>€{svc.price}</div>
                        <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${selected?"#c9a84c":"#2e2b28"}`, background:selected?"#c9a84c":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {selected && <svg width={12} height={12} viewBox="0 0 24 24" fill="#1a1410"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom service */}
              <div style={{ background:"#242220", borderRadius:12, padding:14, marginBottom:16 }}>
                <div style={{ fontSize:12, color:"#7a7167", marginBottom:10 }}>+ Add custom service</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px auto", gap:8, alignItems:"end" }}>
                  <input placeholder="Service name" value={customService.name} onChange={e=>setCustomService(p=>({...p,name:e.target.value}))}/>
                  <input placeholder="€" type="number" value={customService.price} onChange={e=>setCustomService(p=>({...p,price:e.target.value}))}/>
                  <input placeholder="min" type="number" value={customService.duration} onChange={e=>setCustomService(p=>({...p,duration:e.target.value}))}/>
                  <button onClick={addCustomService} style={{ background:"linear-gradient(135deg,#c9a84c,#e4c97e)", color:"#1a1410", border:"none", borderRadius:8, padding:"10px 14px", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap" }}>Add</button>
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div style={{ marginBottom:16, padding:"10px 14px", background:"rgba(76,175,125,.1)", border:"1px solid rgba(76,175,125,.3)", borderRadius:10 }}>
                  <div style={{ fontSize:13, color:"#4caf7d" }}>✓ {selectedServices.length} service{selectedServices.length!==1?"s":""} selected</div>
                </div>
              )}

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setStep(1)} style={{ flex:1, background:"transparent", border:"1px solid #2e2b28", color:"#7a7167", borderRadius:10, padding:"12px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>← Back</button>
                <button onClick={()=>setStep(3)} style={{ flex:2, background:"linear-gradient(135deg,#c9a84c,#e4c97e)", color:"#1a1410", border:"none", borderRadius:10, padding:"12px 20px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, cursor:"pointer" }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Staff */}
          {step===3 && (
            <div>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:12, color:"#c9a84c", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Step 3 of 3</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:"#f5ede0", marginBottom:8 }}>Add your team</h2>
                <p style={{ color:"#7a7167", fontSize:14 }}>Add the names of your staff members. You can add more later.</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                {staffNames.map((name,i)=>(
                  <div key={i}>
                    <label style={{ fontSize:12, color:"#7a7167", marginBottom:4, display:"block" }}>Staff member {i+1}</label>
                    <input placeholder={`e.g. ${["Sofia","Ana","Carlos"][i]}`} value={name} onChange={e=>{const n=[...staffNames];n[i]=e.target.value;setStaffNames(n);}}/>
                  </div>
                ))}
                <button onClick={()=>setStaffNames(p=>[...p,""])} style={{ background:"transparent", border:"1px dashed #2e2b28", color:"#7a7167", borderRadius:8, padding:"10px", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                  + Add another staff member
                </button>
              </div>

              {/* Summary */}
              <div style={{ background:"#242220", borderRadius:12, padding:16, marginBottom:20 }}>
                <div style={{ fontSize:13, color:"#7a7167", marginBottom:10 }}>Setup summary:</div>
                <div style={{ fontSize:14, color:"#f5ede0", marginBottom:4 }}>🏪 {salonName}</div>
                <div style={{ fontSize:13, color:"#7a7167", marginBottom:4 }}>💼 {selectedServices.length} services added</div>
                <div style={{ fontSize:13, color:"#7a7167" }}>👥 {staffNames.filter(n=>n.trim()).length} staff members</div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setStep(2)} style={{ flex:1, background:"transparent", border:"1px solid #2e2b28", color:"#7a7167", borderRadius:10, padding:"12px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>← Back</button>
                <button onClick={handleFinish} disabled={saving} style={{ flex:2, background:"linear-gradient(135deg,#c9a84c,#e4c97e)", color:"#1a1410", border:"none", borderRadius:10, padding:"12px 20px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, cursor:saving?"not-allowed":"pointer", opacity:saving?.7:1 }}>
                  {saving ? "Setting up…" : "🚀 Launch my salon!"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign:"center", marginTop:16, fontSize:12, color:"#7a7167" }}>
          You can change all of this later in Settings
        </p>
      </div>
    </div>
  );
}
