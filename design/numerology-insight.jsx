import { useState, useEffect, useRef, useCallback } from "react";

const PYTHAGOREAN_MAP = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

function reduceToSingle(n) {
  const steps = [n];
  let current = n;
  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    current = String(current).split("").reduce((a, b) => a + parseInt(b), 0);
    steps.push(current);
  }
  return { final: current, steps };
}

const LIFE_PATH_DATA = {
  1: { title: "THE PIONEER", keywords: "Leadership, Independence, Ambition, Innovation.", destiny: "Forge your own path with courage, originality, and unwavering self-belief." },
  2: { title: "THE HARMONIZER", keywords: "Intuition, Cooperation, Diplomacy, Balance.", destiny: "Work to achieve balance, partnerships, and emotional sensitivity." },
  3: { title: "THE CREATOR", keywords: "Expression, Joy, Creativity, Communication.", destiny: "Channel your vibrant energy into artistic expression and inspired communication." },
  4: { title: "THE BUILDER", keywords: "Stability, Discipline, Order, Dedication.", destiny: "Build lasting foundations through patience, hard work, and practical wisdom." },
  5: { title: "THE EXPLORER", keywords: "Freedom, Adventure, Change, Versatility.", destiny: "Embrace transformation and seek the wisdom found only through experience." },
  6: { title: "THE NURTURER", keywords: "Responsibility, Love, Harmony, Service.", destiny: "Create beauty and healing through devotion to home, family, and community." },
  7: { title: "THE SEEKER", keywords: "Analysis, Wisdom, Spirituality, Introspection.", destiny: "Pursue inner truth and higher knowledge through contemplation and study." },
  8: { title: "THE POWERHOUSE", keywords: "Authority, Abundance, Mastery, Achievement.", destiny: "Manifest material and spiritual abundance through discipline and vision." },
  9: { title: "THE HUMANITARIAN", keywords: "Compassion, Wisdom, Completion, Universal Love.", destiny: "Serve humanity with selfless love and the wisdom of all preceding numbers." },
  11: { title: "THE ILLUMINATOR", keywords: "Inspiration, Vision, Channeling, Mastery.", destiny: "A Master Number — illuminate the path for others through spiritual insight." },
  22: { title: "THE MASTER BUILDER", keywords: "Vision, Power, Practicality, Legacy.", destiny: "A Master Number — turn the grandest visions into tangible, world-changing reality." },
  33: { title: "THE MASTER TEACHER", keywords: "Guidance, Healing, Blessing, Selflessness.", destiny: "A Master Number — uplift humanity through compassionate wisdom and joyful service." },
};

/* ─── Color System ─── */
const C = {
  cyan: "#00e5ff",
  cyanDim: "rgba(0,229,255,",
  green: "#00ffa3",
  greenDim: "rgba(0,255,163,",
  gold: "#f5e6be",
  goldDim: "rgba(245,230,190,",
  textBright: "rgba(210,210,240,0.9)",
  textDim: "rgba(180,180,220,0.6)",
  cardBg: "rgba(18,10,35,0.6)",
  cardBorder: "rgba(0,229,255,0.15)",
};

const glassCard = {
  background: C.cardBg,
  backdropFilter: "blur(14px)",
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 14,
  padding: "16px 18px",
  marginBottom: 12,
};
const sectionLabel = {
  fontSize: 10, letterSpacing: 2.5, color: C.green,
  fontWeight: 700, marginBottom: 12, fontFamily: "'Montserrat', sans-serif", opacity: 0.7,
};
const dimText = { fontSize: 12.5, color: C.textDim, fontFamily: "'Montserrat', sans-serif", lineHeight: 1.5 };
const brightText = { fontSize: 13, color: C.textBright, fontFamily: "'Montserrat', sans-serif", fontWeight: 600 };
const goldText = { color: C.gold, fontFamily: "'Playfair Display', serif", fontWeight: 700 };

/* ─── Particle Canvas ─── */
function ParticleBackground() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = canvas.parentElement.offsetWidth;
    let h = canvas.height = canvas.parentElement.offsetHeight;

    particles.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.15,
      hue: Math.random() > 0.6 ? 160 : 180, // mix cyan and green particles
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles.current) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${p.alpha})`; ctx.fill();
      }
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i], b = particles.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 90) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,229,255,${0.06 * (1 - dist / 90)})`; ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { w = canvas.width = canvas.parentElement.offsetWidth; h = canvas.height = canvas.parentElement.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── Sacred Geometry: Metatron's Cube + Seed of Life ─── */
function SacredGeometry() {
  // Metatron's cube: 13 circles of Fruit of Life + connecting lines
  const cx = 200, cy = 200, R = 60;
  // Center + 6 around + 6 outer
  const innerPts = [0,1,2,3,4,5].map(i => {
    const a = (i * 60 - 90) * Math.PI / 180;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
  const outerPts = [0,1,2,3,4,5].map(i => {
    const a = (i * 60 - 90) * Math.PI / 180;
    return [cx + R * 2 * Math.cos(a), cy + R * 2 * Math.sin(a)];
  });
  const allPts = [[cx, cy], ...innerPts, ...outerPts];

  return (
    <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18, pointerEvents: "none", zIndex: 0 }}>
      <defs>
        <radialGradient id="geoFade">
          <stop offset="0%" stopColor="#c0b0ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#c0b0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Metatron connecting lines */}
      {allPts.map((a, i) =>
        allPts.slice(i + 1).map((b, j) => (
          <line key={`l${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke="#c0b0ff" strokeWidth="0.5" opacity="0.7" />
        ))
      )}
      {/* Seed of Life / Fruit of Life circles */}
      {allPts.map(([x, y], i) => (
        <circle key={`c${i}`} cx={x} cy={y} r={R * 0.95} fill="none" stroke="#c0b0ff" strokeWidth="0.6" opacity="0.8" />
      ))}
      {/* Outer bounding circle */}
      <circle cx={cx} cy={cy} r={R * 3} fill="none" stroke="#c0b0ff" strokeWidth="0.5" opacity="0.5" />
      <circle cx={cx} cy={cy} r={R * 3.2} fill="none" stroke="#c0b0ff" strokeWidth="0.35" opacity="0.3" />
      {/* Hexagram */}
      {[0, 1].map(offset => {
        const pts = [0,1,2].map(i => {
          const a = ((i * 120 + offset * 60) - 90) * Math.PI / 180;
          return `${cx + R * 2.2 * Math.cos(a)},${cy + R * 2.2 * Math.sin(a)}`;
        }).join(" ");
        return <polygon key={`hex${offset}`} points={pts} fill="none" stroke="#c0b0ff" strokeWidth="0.55" opacity="0.6" />;
      })}
    </svg>
  );
}

/* ─── Decorative Blurred Curves ─── */
function BlurredCurves({ variant = "home" }) {
  return (
    <svg viewBox="0 0 400 700" preserveAspectRatio="none" style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, opacity: 1,
    }}>
      <defs>
        <filter id="curvBlur1"><feGaussianBlur stdDeviation="12" /></filter>
        <filter id="curvBlur2"><feGaussianBlur stdDeviation="18" /></filter>
        <filter id="curvBlur3"><feGaussianBlur stdDeviation="8" /></filter>
        <linearGradient id="cyanGreenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.cyan} />
          <stop offset="100%" stopColor={C.green} />
        </linearGradient>
      </defs>
      {/* Large flowing S-curve - cyan */}
      <path d="M-20,120 C100,80 80,250 200,280 S380,200 420,350"
        fill="none" stroke={C.cyan} strokeWidth="2.5" opacity="0.2" filter="url(#curvBlur1)" />
      {/* Counter-curve - green */}
      <path d="M420,100 C300,180 350,300 200,320 S50,400 -20,500"
        fill="none" stroke={C.green} strokeWidth="2" opacity="0.18" filter="url(#curvBlur2)" />
      {/* Tighter accent curve near top */}
      <path d="M100,20 C160,60 180,120 260,100"
        fill="none" stroke={C.green} strokeWidth="3" opacity="0.15" filter="url(#curvBlur1)" />
      {/* Low curve */}
      <path d="M-10,550 C80,500 200,580 300,520 S400,560 420,600"
        fill="none" stroke={C.cyan} strokeWidth="2" opacity="0.15" filter="url(#curvBlur2)" />
      {/* Orbiting wisps */}
      <path d="M180,200 Q220,160 260,200 Q300,240 260,280 Q220,320 180,280 Q140,240 180,200"
        fill="none" stroke="url(#cyanGreenGrad)" strokeWidth="1.5" opacity="0.18" filter="url(#curvBlur3)" />
    </svg>
  );
}

/* ─── Flow Lines: Bezier Curves ─── */
function FlowLines({ letters, show }) {
  if (!show || letters.length === 0) return null;
  const spacing = Math.min(56, 280 / Math.max(letters.length, 1));
  const startX = (320 - letters.length * spacing) / 2 + spacing / 2;

  return (
    <svg viewBox="0 0 320 55" style={{ width: "100%", height: 55, overflow: "visible" }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} stopOpacity="0.8" />
          <stop offset="50%" stopColor={C.green} stopOpacity="0.5" />
          <stop offset="100%" stopColor={C.green} stopOpacity="0.1" />
        </linearGradient>
        <filter id="flowBlur"><feGaussianBlur stdDeviation="2" /></filter>
        <filter id="flowGlow"><feGaussianBlur stdDeviation="3.5" /></filter>
      </defs>
      {letters.map((_, i) => {
        const x = startX + i * spacing;
        // Bezier curves that sway outward from center
        const center = 160;
        const drift = (x - center) * 0.15;
        const cp1x = x + drift * 0.6;
        const cp2x = x + drift;
        return (
          <g key={i} style={{ animation: `flowFade 0.5s ${i * 0.08}s both` }}>
            {/* Blurred glow layer */}
            <path d={`M${x},0 C${cp1x},15 ${cp2x},30 ${x + drift * 0.5},48`}
              fill="none" stroke={C.cyan} strokeWidth="4" opacity="0.25" filter="url(#flowGlow)" />
            {/* Crisp bezier */}
            <path d={`M${x},0 C${cp1x},15 ${cp2x},30 ${x + drift * 0.5},48`}
              fill="none" stroke="url(#flowGrad)" strokeWidth="1.8" />
            <circle cx={x + drift * 0.5} cy={48} r="2.5" fill={C.green} opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Energy Vortex Ring ─── */
function VortexRing({ number, size = 120 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Blurred aura */}
      <div style={{
        position: "absolute", inset: -8, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.greenDim}0.18) 0%, ${C.cyanDim}0.05) 50%, transparent 70%)`,
        animation: "pulse 4s ease-in-out infinite",
      }} />
      {/* Outer rotating ring */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `2px solid ${C.cyanDim}0.18)`,
        animation: "spinSlow 8s linear infinite",
      }}>
        <div style={{
          position: "absolute", top: -3, left: "50%", width: 6, height: 6,
          borderRadius: "50%", background: C.green,
          boxShadow: `0 0 10px ${C.green}, 0 0 20px ${C.green}`, transform: "translateX(-50%)",
        }} />
      </div>
      {/* Inner ring */}
      <div style={{
        position: "absolute", inset: 12, borderRadius: "50%",
        border: `1.5px solid ${C.cyanDim}0.3)`,
        boxShadow: `inset 0 0 20px ${C.cyanDim}0.08), 0 0 15px ${C.cyanDim}0.08)`,
        animation: "spinSlow 12s linear infinite reverse",
      }}>
        <div style={{
          position: "absolute", bottom: -2, left: "50%", width: 4, height: 4,
          borderRadius: "50%", background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`, transform: "translateX(-50%)",
        }} />
      </div>
      {/* Center number */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Playfair Display', serif", fontSize: size * 0.38, fontWeight: 700,
        color: C.gold,
        textShadow: `0 0 20px ${C.goldDim}0.5), 0 0 40px ${C.goldDim}0.2)`,
        lineHeight: 1, paddingBottom: size * 0.12,
      }}>
        {number}
      </div>
    </div>
  );
}

/* ─── Result Card ─── */
function ResultCard({ number, show }) {
  const data = LIFE_PATH_DATA[number] || LIFE_PATH_DATA[1];
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center",
      opacity: show ? 1 : 0, transform: show ? "translateX(0)" : "translateX(40px)",
      transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      pointerEvents: show ? "auto" : "none", zIndex: 10,
      padding: "24px 16px", overflow: "auto",
    }}>
      {/* Decorative swirl curves behind the vortex */}
      <svg viewBox="0 0 200 120" style={{ position: "absolute", top: 0, width: 200, height: 120, opacity: 0.5, pointerEvents: "none" }}>
        <defs><filter id="swirlBlur"><feGaussianBlur stdDeviation="6" /></filter></defs>
        <path d="M40,100 C60,20 100,0 100,0 S140,20 160,100" fill="none" stroke={C.green} strokeWidth="3" filter="url(#swirlBlur)" />
        <path d="M30,110 C70,30 100,10 100,10 S130,30 170,110" fill="none" stroke={C.cyan} strokeWidth="2.5" filter="url(#swirlBlur)" />
      </svg>

      <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 16px", zIndex: 2 }}>
        <VortexRing number={number} size={100} />
      </div>

      <div style={{
        width: "100%", maxWidth: 280,
        background: "rgba(18,10,35,0.75)", backdropFilter: "blur(16px)",
        border: `1px solid ${C.greenDim}0.3)`, borderRadius: 16,
        padding: "28px 24px", textAlign: "center", position: "relative", overflow: "hidden",
        boxShadow: `0 0 30px ${C.greenDim}0.06), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}>
        {/* Running green/cyan border light */}
        <div style={{
          position: "absolute", inset: -1, borderRadius: 16,
          background: `conic-gradient(from 0deg, transparent 0%, ${C.green} 8%, ${C.cyan} 15%, transparent 22%)`,
          animation: "spinSlow 4s linear infinite", opacity: 0.35, zIndex: -1,
        }} />
        <div style={{ position: "absolute", inset: 1, borderRadius: 15, background: "rgba(18,10,35,0.95)", zIndex: -1 }} />

        <div style={{ fontSize: 11, letterSpacing: 3, color: `${C.greenDim}0.7)`, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, marginBottom: 8 }}>LIFE PATH NUMBER</div>
        <div style={{
          fontSize: 64, fontWeight: 700, fontFamily: "'Playfair Display', serif",
          color: C.gold,
          textShadow: `0 0 30px ${C.goldDim}0.4), 0 0 60px ${C.goldDim}0.15)`,
          lineHeight: 0.75, margin: "0 0 29px",
        }}>{number}</div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2.5, color: C.cyan, fontFamily: "'Montserrat', sans-serif", marginBottom: 10 }}>{data.title}</div>
        <div style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.5, fontFamily: "'Montserrat', sans-serif", marginBottom: 16 }}>{data.keywords}</div>
        <div style={{ fontSize: 12, color: `${C.greenDim}0.6)`, fontWeight: 600, fontFamily: "'Montserrat', sans-serif", marginBottom: 6 }}>Your Destiny:</div>
        <div style={{ fontSize: 12.5, color: "rgba(210,210,240,0.8)", lineHeight: 1.6, fontFamily: "'Montserrat', sans-serif" }}>{data.destiny}</div>
      </div>
    </div>
  );
}

/* ─── Profile Overlay ─── */
function ProfileOverlay({ show, onClose }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: "rgba(8,4,18,0.9)", backdropFilter: "blur(20px)",
      opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none",
      transition: "opacity 0.4s", display: "flex", flexDirection: "column",
      padding: "24px 20px", overflow: "auto",
    }}>
      <button onClick={onClose} style={{
        alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", padding: 4, marginBottom: 8,
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(210,210,240,0.6)" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.cyanDim}0.25), ${C.greenDim}0.2))`,
          border: `2px solid ${C.greenDim}0.35)`, display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 14, boxShadow: `0 0 24px ${C.greenDim}0.15)`,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(210,210,240,0.8)" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </div>
        <div style={{ ...goldText, fontSize: 20, marginBottom: 4 }}>Aurora Wells</div>
        <div style={{ ...dimText, fontSize: 11, letterSpacing: 1.5 }}>SEEKER · LIFE PATH 2</div>
      </div>

      <div style={sectionLabel}>CORE NUMBERS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Life Path", num: 2 },
          { label: "Expression", num: 7 },
          { label: "Soul Urge", num: 9 },
          { label: "Personality", num: 4 },
        ].map(item => (
          <div key={item.label} style={{
            ...glassCard, marginBottom: 0, display: "flex", alignItems: "center", gap: 12, padding: "14px 14px",
          }}>
            <div style={{ ...goldText, fontSize: 24, width: 32, textAlign: "center" }}>{item.num}</div>
            <div>
              <div style={{ ...brightText, fontSize: 11 }}>{item.label}</div>
              <div style={{ ...dimText, fontSize: 10, marginTop: 2 }}>{LIFE_PATH_DATA[item.num]?.title || "—"}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={sectionLabel}>PROFILE DETAILS</div>
      <div style={glassCard}>
        {[
          { label: "Birth Name", value: "Aurora Elaine Wells" },
          { label: "Date of Birth", value: "March 14, 1992" },
          { label: "Birth Number", value: "7" },
        ].map((row, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0",
            borderBottom: i < 2 ? `1px solid ${C.cyanDim}0.06)` : "none",
          }}>
            <span style={dimText}>{row.label}</span>
            <span style={brightText}>{row.value}</span>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: 8, padding: "13px 0", width: "100%",
        background: "rgba(18,10,35,0.5)", backdropFilter: "blur(8px)",
        border: `1px solid ${C.greenDim}0.25)`, borderRadius: 10,
        color: C.green, fontSize: 12, fontWeight: 700,
        letterSpacing: 2, cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
      }}>EDIT PROFILE</button>
    </div>
  );
}

/* ─── Calculations Tab ─── */
function CalculationsTab() {
  const history = [
    { word: "AURORA", sum: 29, result: 2, date: "Today" },
    { word: "DESTINY", sum: 30, result: 3, date: "Yesterday" },
    { word: "SERAPHIM", sum: 47, result: 2, date: "Feb 27" },
    { word: "ECLIPSE", sum: 29, result: 2, date: "Feb 25" },
    { word: "ZEPHYR", sum: 40, result: 4, date: "Feb 24" },
    { word: "SOLSTICE", sum: 30, result: 3, date: "Feb 22" },
  ];
  return (
    <div style={{ animation: "fadeUp 0.4s both" }}>
      <div style={sectionLabel}>CALCULATION HISTORY</div>
      {history.map((h, i) => (
        <div key={i} style={{
          ...glassCard,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          animation: `fadeUp 0.35s ${i * 0.06}s both`, cursor: "pointer",
          transition: "border-color 0.3s",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = `${C.greenDim}0.35)`}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              border: `1.5px solid ${C.greenDim}0.3)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              ...goldText, fontSize: 18,
            }}>{h.result}</div>
            <div>
              <div style={{ ...brightText, letterSpacing: 2, fontSize: 13 }}>{h.word}</div>
              <div style={{ ...dimText, fontSize: 10, marginTop: 3 }}>{h.sum} → {h.result} · {LIFE_PATH_DATA[h.result]?.title}</div>
            </div>
          </div>
          <div style={{ ...dimText, fontSize: 10 }}>{h.date}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Insights Tab ─── */
function InsightsTab() {
  const insights = [
    { title: "Number 2 Dominance", body: "The number 2 appears three times in your recent calculations. This suggests a period of heightened receptivity, cooperation, and emotional awareness.", glow: `${C.cyanDim}0.1)` },
    { title: "Master Number Alert", body: "Your name AURORA reduces through 29 → 11 → 2. The presence of Master Number 11 amplifies intuition and spiritual sensitivity.", glow: `${C.greenDim}0.1)` },
    { title: "Weekly Pattern", body: "Your calculations this week lean heavily toward even numbers (2, 4), indicating a grounding energy. Consider exploring odd-numbered words for balance.", glow: `${C.goldDim}0.06)` },
  ];
  return (
    <div style={{ animation: "fadeUp 0.4s both" }}>
      <div style={sectionLabel}>YOUR INSIGHTS</div>
      {insights.map((ins, i) => (
        <div key={i} style={{
          ...glassCard, animation: `fadeUp 0.4s ${i * 0.1}s both`,
          background: `linear-gradient(135deg, ${ins.glow}, ${C.cardBg})`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: C.green,
              boxShadow: `0 0 8px ${C.greenDim}0.5)`,
            }} />
            <div style={{ ...brightText, fontSize: 13, letterSpacing: 0.5 }}>{ins.title}</div>
          </div>
          <div style={dimText}>{ins.body}</div>
        </div>
      ))}

      <div style={{ ...sectionLabel, marginTop: 8 }}>NUMBER FREQUENCY</div>
      <div style={glassCard}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 80, gap: 6, padding: "0 4px" }}>
          {[1,2,3,4,5,6,7,8,9].map(n => {
            const freq = n === 2 ? 70 : n === 3 ? 45 : n === 4 ? 30 : n === 7 ? 20 : n === 9 ? 15 : 8;
            const isTop = n === 2;
            return (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
                <div style={{
                  width: "100%", maxWidth: 24, height: freq, borderRadius: 4,
                  background: isTop
                    ? `linear-gradient(to top, ${C.greenDim}0.3), ${C.greenDim}0.7))`
                    : `linear-gradient(to top, ${C.cyanDim}0.08), ${C.cyanDim}0.25))`,
                  border: `1px solid ${isTop ? C.greenDim + "0.5)" : C.cyanDim + "0.12)"}`,
                }} />
                <span style={{ ...dimText, fontSize: 10 }}>{n}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Research Tab ─── */
function ResearchTab() {
  const topics = [
    { title: "Pythagorean Numerology", desc: "The Western system mapping letters A–Z to digits 1–9. Origins in ancient Greek mathematics and mystical philosophy.", icon: "△" },
    { title: "Chaldean Numerology", desc: "An older Babylonian system with different letter-number assignments. Considered more mystically inclined by some practitioners.", icon: "☽" },
    { title: "Master Numbers", desc: "11, 22, and 33 carry amplified energy and are not reduced further. They represent heightened spiritual potential and responsibility.", icon: "✦" },
    { title: "Sacred Geometry", desc: "The mathematical patterns underlying creation — Flower of Life, Metatron's Cube, the Golden Ratio — and their relationship to numerological harmony.", icon: "⬡" },
    { title: "Name Vibrations", desc: "Each name carries a vibrational frequency determined by its letter values. Changes in name shift your numerological energy signature.", icon: "∿" },
  ];
  return (
    <div style={{ animation: "fadeUp 0.4s both" }}>
      <div style={sectionLabel}>NUMEROLOGY LIBRARY</div>
      {topics.map((t, i) => (
        <div key={i} style={{
          ...glassCard, cursor: "pointer",
          animation: `fadeUp 0.35s ${i * 0.07}s both`,
          display: "flex", gap: 14, alignItems: "flex-start",
          transition: "border-color 0.3s",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = `${C.greenDim}0.35)`}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `${C.greenDim}0.05)`, border: `1px solid ${C.greenDim}0.15)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: C.green,
          }}>{t.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...brightText, fontSize: 13, marginBottom: 4 }}>{t.title}</div>
            <div style={dimText}>{t.desc}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(210,210,240,0.2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── Settings Tab ─── */
function SettingsTab() {
  const [toggles, setToggles] = useState({ notifications: true, haptics: true, darkMode: true, masterNumbers: true });
  const Toggle = ({ id, label }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "13px 0", borderBottom: `1px solid ${C.cyanDim}0.05)`,
    }}>
      <span style={brightText}>{label}</span>
      <div
        onClick={() => setToggles(prev => ({ ...prev, [id]: !prev[id] }))}
        style={{
          width: 44, height: 24, borderRadius: 12, cursor: "pointer",
          background: toggles[id] ? `${C.greenDim}0.3)` : "rgba(210,210,240,0.1)",
          border: `1px solid ${toggles[id] ? C.greenDim + "0.5)" : "rgba(210,210,240,0.15)"}`,
          position: "relative", transition: "all 0.3s",
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: "50%",
          background: toggles[id] ? C.green : "rgba(210,210,240,0.4)",
          position: "absolute", top: 2,
          left: toggles[id] ? 22 : 2,
          transition: "all 0.3s",
          boxShadow: toggles[id] ? `0 0 8px ${C.greenDim}0.5)` : "none",
        }} />
      </div>
    </div>
  );
  return (
    <div style={{ animation: "fadeUp 0.4s both" }}>
      <div style={sectionLabel}>PREFERENCES</div>
      <div style={glassCard}>
        <Toggle id="notifications" label="Push Notifications" />
        <Toggle id="haptics" label="Haptic Feedback" />
        <Toggle id="darkMode" label="Dark Mode" />
        <Toggle id="masterNumbers" label="Preserve Master Numbers" />
      </div>

      <div style={{ ...sectionLabel, marginTop: 8 }}>CALCULATION SYSTEM</div>
      <div style={glassCard}>
        {["Pythagorean", "Chaldean"].map((sys, i) => (
          <div key={sys} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0",
            borderBottom: i === 0 ? `1px solid ${C.cyanDim}0.05)` : "none",
            cursor: "pointer",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: `2px solid ${i === 0 ? C.green : "rgba(210,210,240,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {i === 0 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />}
            </div>
            <span style={{ ...brightText, color: i === 0 ? C.textBright : C.textDim }}>{sys}</span>
          </div>
        ))}
      </div>

      <div style={{ ...sectionLabel, marginTop: 8 }}>ABOUT</div>
      <div style={{ ...glassCard, ...dimText, textAlign: "center" }}>
        Liber Numerus: The Book of Numbers v2.4.1<br />
        <span style={{ fontSize: 10, opacity: 0.5 }}>Built with sacred intention</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ─── Main App ───
   ═══════════════════════════════════════════════ */
export default function NumerologyInsight() {
  const [name, setName] = useState("AURORA");
  const [inputValue, setInputValue] = useState("AURORA");
  const [calculated, setCalculated] = useState(true);
  const [showResult, setShowResult] = useState(true);
  const [animStep, setAnimStep] = useState(3);
  const [activeTab, setActiveTab] = useState("Home");
  const [showProfile, setShowProfile] = useState(false);

  const letters = name.toUpperCase().split("").filter(c => PYTHAGOREAN_MAP[c]);
  const digits = letters.map(c => PYTHAGOREAN_MAP[c]);
  const rawSum = digits.reduce((a, b) => a + b, 0);
  const { final, steps } = reduceToSingle(rawSum);

  const calculate = useCallback(() => {
    const clean = inputValue.toUpperCase().replace(/[^A-Z]/g, "");
    if (!clean) return;
    setName(clean);
    setCalculated(true);
    setShowResult(false);
    setAnimStep(0);
    setTimeout(() => setAnimStep(1), 400);
    setTimeout(() => setAnimStep(2), 1000);
    setTimeout(() => { setAnimStep(3); setShowResult(true); }, 1600);
  }, [inputValue]);

  const tabs = [
    { name: "Home", icon: "M3 12l9-9 9 9M5 11v8a1 1 0 001 1h3m10-9v8a1 1 0 01-1 1h-3m-6 0h6" },
    { name: "Calculations", icon: "M4 5h2m4 0h2m4 0h2M4 9h16M4 13h2m2 0h2m2 0h2m2 0h2M7 17h10M9 21h6" },
    { name: "Insights", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { name: "Research", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div style={{
      width: "100%", maxWidth: 420, margin: "0 auto",
      height: "100vh", maxHeight: 860,
      background: "linear-gradient(165deg, #0c0618 0%, #150d2e 25%, #1a1040 50%, #12082a 75%, #0a0416 100%)",
      fontFamily: "'Montserrat', sans-serif",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      boxShadow: "0 0 80px rgba(0,0,0,0.8)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap');
        @keyframes spinSlow { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity:0.6 } 50% { transform: scale(1.15); opacity:1 } }
        @keyframes flowFade { from { opacity:0; transform: translateY(-8px) } to { opacity:1; transform: translateY(0) } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform: translateY(0) } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 8px ${C.greenDim}0.3) } 50% { box-shadow: 0 0 18px ${C.greenDim}0.6) } }
        * { box-sizing: border-box; margin:0; padding:0; }
        input::placeholder { color: rgba(180,170,210,0.3); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.cyanDim}0.15); border-radius: 3px; }
      `}</style>

      <ParticleBackground />
      <SacredGeometry />
      <BlurredCurves />
      <ProfileOverlay show={showProfile} onClose={() => setShowProfile(false)} />

      {/* ─── Header ─── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px 8px", position: "relative", zIndex: 10,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(210,210,240,0.6)" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
        {/* Logo icon: 8-pointed star inside inverted pentagon */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 3, flexShrink: 0, position: "relative", top: 1 }}>
            <polygon
              points={[0,1,2,3,4].map(i => {
                const a = (i * 72 + 90) * Math.PI / 180;
                return `${12 + 10.5 * Math.cos(a)},${12 + 10.5 * Math.sin(a)}`;
              }).join(" ")}
              fill="none" stroke={C.gold} strokeWidth="1" opacity="0.9"
            />
            {/* 8-pointed star: two overlapping squares with crossing lines */}
            <rect x={12-5.5} y={12-5.5} width={11} height={11}
              fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.9"
            />
            <rect x={12-5.5} y={12-5.5} width={11} height={11}
              fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.9"
              transform="rotate(45 12 12)"
            />
            {/* Center isosceles triangle */}
            <polygon
              points="12,7 16.33,14.5 7.67,14.5"
              fill={C.gold} fillOpacity="0.2" stroke={C.gold} strokeWidth="0.7" opacity="0.9"
            />
          </svg>
          <span style={{
            fontSize: 14, fontWeight: 700, letterSpacing: 2,
            color: C.gold,
            fontFamily: "'Playfair Display', serif",
            textShadow: `0 0 12px ${C.goldDim}0.5), 0 0 30px ${C.goldDim}0.2)`,
          }}>Liber Numerus: <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: 1.5, color: `${C.goldDim}0.7)` }}>The Book of Numbers</span></span>
        </div>
        <button
          onClick={() => setShowProfile(true)}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.cyanDim}0.25), ${C.greenDim}0.2))`,
            border: `1px solid ${C.greenDim}0.35)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 12px ${C.greenDim}0.3)`}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(210,210,240,0.8)" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>
      </div>

      {/* ─── Scrollable Content ─── */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        position: "relative", zIndex: 5,
        padding: "0 20px 16px",
      }}>
        {activeTab === "Home" && (
          <div style={{ position: "relative", minHeight: showResult && animStep === 3 ? 480 : "auto" }}>
            <div style={{
              opacity: showResult && animStep === 3 ? 0 : 1,
              transform: showResult && animStep === 3 ? "translateX(-40px)" : "translateX(0)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
              pointerEvents: showResult && animStep === 3 ? "none" : "auto",
            }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: C.textDim, marginBottom: 10, fontWeight: 600 }}>ENTER NAME OR WORD:</div>
                <input
                  value={inputValue}
                  onChange={e => { setInputValue(e.target.value.toUpperCase().replace(/[^A-Z]/g, "")); setCalculated(false); setShowResult(false); }}
                  onKeyDown={e => e.key === "Enter" && calculate()}
                  placeholder="TYPE A NAME..."
                  style={{
                    width: "100%", padding: "12px 16px",
                    background: "rgba(18,10,35,0.5)", backdropFilter: "blur(8px)",
                    border: `1px solid ${C.cyanDim}0.2)`, borderRadius: 12,
                    color: C.gold, fontSize: 20, fontWeight: 700,
                    fontFamily: "'Montserrat', sans-serif", letterSpacing: 6,
                    textAlign: "center", outline: "none", transition: "border-color 0.3s",
                  }}
                  onFocus={e => e.target.style.borderColor = `${C.greenDim}0.5)`}
                  onBlur={e => e.target.style.borderColor = `${C.cyanDim}0.2)`}
                />
              </div>

              {calculated && letters.length > 0 && (
                <div style={{ animation: "fadeUp 0.5s both" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    {letters.map((l, i) => {
                      const sp = Math.min(56, 280 / Math.max(letters.length, 1));
                      return (
                        <div key={i} style={{
                          width: Math.min(50, sp - 4), height: Math.min(50, sp - 4),
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          background: "rgba(18,10,35,0.6)", backdropFilter: "blur(6px)",
                          border: `1px solid ${C.cyanDim}0.3)`, borderRadius: 8,
                          animation: `fadeUp 0.3s ${i * 0.06}s both`,
                          boxShadow: `0 0 8px ${C.cyanDim}0.06)`,
                        }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: C.textBright, lineHeight: 1 }}>{l}</span>
                          <span style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 2, opacity: 0.8 }}>{PYTHAGOREAN_MAP[l]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <FlowLines letters={letters} show={animStep >= 1} />
                  {animStep >= 1 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 20, animation: "fadeUp 0.4s both", flexWrap: "wrap" }}>
                      {digits.map((d, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 20, fontWeight: 700, color: C.textBright, fontFamily: "'Playfair Display', serif" }}>{d}</span>
                          {i < digits.length - 1 && <span style={{ fontSize: 16, color: `${C.greenDim}0.5)`, fontWeight: 500 }}>+</span>}
                        </span>
                      ))}
                      <span style={{ fontSize: 16, color: `${C.cyanDim}0.5)`, margin: "0 6px" }}>=</span>
                      <span style={{ fontSize: 28, fontWeight: 700, color: C.gold, fontFamily: "'Playfair Display', serif", textShadow: `0 0 15px ${C.goldDim}0.3)` }}>{rawSum}</span>
                    </div>
                  )}
                  {animStep >= 2 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16, animation: "fadeUp 0.5s both" }}>
                      <VortexRing number={rawSum} size={90} />
                      {steps.length > 1 && steps.slice(1).map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 9, color: `${C.greenDim}0.5)`, marginBottom: 2 }}>
                              {String(steps[i]).split("").join("+")}
                            </span>
                            <svg width="24" height="12" viewBox="0 0 24 12">
                              <path d="M2 6h16m0 0l-4-4m4 4l-4 4" fill="none" stroke={`${C.greenDim}0.4)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <VortexRing number={s} size={i === steps.length - 2 ? 90 : 70} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <ResultCard number={final} show={showResult && animStep === 3} />
          </div>
        )}

        {activeTab === "Calculations" && <CalculationsTab />}
        {activeTab === "Insights" && <InsightsTab />}
        {activeTab === "Research" && <ResearchTab />}
        {activeTab === "Settings" && <SettingsTab />}
      </div>

      {/* ─── Action Buttons (Home only) ─── */}
      {activeTab === "Home" && (
        <div style={{ display: "flex", gap: 12, padding: "8px 20px 12px", position: "relative", zIndex: 10 }}>
          {showResult && animStep === 3 ? (
            <>
              <button
                onClick={() => { setShowResult(false); setAnimStep(2); }}
                style={{
                  flex: 1, padding: "13px 0",
                  background: "rgba(18,10,35,0.6)", backdropFilter: "blur(8px)",
                  border: `1px solid ${C.cyanDim}0.3)`, borderRadius: 10,
                  color: C.textBright, fontSize: 12, fontWeight: 700,
                  letterSpacing: 2, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.target.style.borderColor = `${C.cyanDim}0.6)`; e.target.style.boxShadow = `0 0 16px ${C.cyanDim}0.12)`; }}
                onMouseLeave={e => { e.target.style.borderColor = `${C.cyanDim}0.3)`; e.target.style.boxShadow = "none"; }}
              >RE-CALCULATE</button>
              <button
                style={{
                  flex: 1, padding: "13px 0",
                  background: `linear-gradient(135deg, ${C.greenDim}0.12), ${C.cyanDim}0.08))`,
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${C.greenDim}0.35)`, borderRadius: 10,
                  color: C.green, fontSize: 12, fontWeight: 700,
                  letterSpacing: 2, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.target.style.borderColor = `${C.greenDim}0.6)`; e.target.style.boxShadow = `0 0 16px ${C.greenDim}0.12)`; }}
                onMouseLeave={e => { e.target.style.borderColor = `${C.greenDim}0.35)`; e.target.style.boxShadow = "none"; }}
              >SHARE</button>
            </>
          ) : (
            <button
              onClick={calculate}
              style={{
                flex: 1, padding: "14px 0",
                background: `linear-gradient(135deg, ${C.greenDim}0.15), ${C.cyanDim}0.1))`,
                backdropFilter: "blur(8px)",
                border: `1px solid ${C.greenDim}0.4)`, borderRadius: 10,
                color: C.green, fontSize: 13, fontWeight: 700,
                letterSpacing: 2.5, cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                transition: "all 0.3s", animation: "glowPulse 2s ease-in-out infinite",
              }}
            >CALCULATE</button>
          )}
        </div>
      )}

      {/* ─── Bottom Nav ─── */}
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "8px 4px 14px",
        background: "rgba(8,4,18,0.85)", backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.cyanDim}0.06)`,
        position: "relative", zIndex: 10,
      }}>
        {tabs.map(tab => {
          const isActive = tab.name === activeTab;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 6px", position: "relative",
              }}
            >
              {isActive && (
                <div style={{
                  position: "absolute", top: -9, width: 20, height: 2,
                  background: C.green, borderRadius: 1,
                  boxShadow: `0 0 8px ${C.greenDim}0.6)`,
                }} />
              )}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={isActive ? C.green : "rgba(180,170,210,0.3)"}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: isActive ? `drop-shadow(0 0 6px ${C.greenDim}0.5))` : "none", transition: "all 0.3s" }}>
                <path d={tab.icon} />
              </svg>
              <span style={{
                fontSize: 8, fontWeight: 600, letterSpacing: 0.3,
                color: isActive ? C.green : "rgba(180,170,210,0.3)",
                transition: "color 0.3s",
              }}>{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
