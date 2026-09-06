"use client";

import { Activity, Bot, Box, BrainCircuit, ChevronDown, CircleCheck, Code2, Database, FileCode2, GitBranch, Github, LayoutDashboard, LockKeyhole, Network, Play, Plus, Rocket, Search, Settings, ShieldCheck, Terminal, TestTube2, Users, Bell } from "lucide-react";
import { useState } from "react";

const nav = [
  { section: "Workspace", items: [["Overview", LayoutDashboard], ["Projects", Box], ["AI Agents", Bot], ["Knowledge Base", BrainCircuit]] },
  { section: "Engineering", items: [["Requirements", FileCode2], ["Architecture", Network], ["Code", Code2], ["Tests", TestTube2]] },
  { section: "Security & Ops", items: [["Security Center", ShieldCheck], ["GitHub", Github], ["Activity Logs", Activity]] },
];

const projects = [
  { name: "Interview Lens", meta: "AI interview intelligence · main", badge: "Healthy", cls: "" },
  { name: "AEGIS Control Plane", meta: "Autonomous engineering platform · main", badge: "Building", cls: "blue" },
  { name: "Turf Booking Platform", meta: "Full-stack booking system · main", badge: "Healthy", cls: "" },
  { name: "Ball Bearing Vision", meta: "Defect detection · production", badge: "Review", cls: "warn" },
];

const agents = [
  ["Architect Agent", "Designs system architecture & ADRs", Network],
  ["Developer Agent", "Plans and implements code changes", Terminal],
  ["Security Agent", "Scans code, deps and attack surface", LockKeyhole],
  ["Testing Agent", "Generates tests and validates changes", TestTube2],
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [started, setStarted] = useState(false);
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">A</div><div><strong>AEGIS</strong><span>ENGINEERING CONTROL PLANE</span></div></div>
        {nav.map(group => <div key={group.section}><div className="navlabel">{group.section}</div>{group.items.map(([label, Icon]) => <button className={`navitem ${active===label ? "active" : ""}`} onClick={()=>setActive(label as string)} key={label as string}><Icon className="navicon"/><span>{label}</span></button>)}</div>)}
        <div className="navlabel">System</div><button className="navitem" onClick={()=>setActive("Settings")}><Settings className="navicon"/><span>Settings</span></button>
        <div style={{position:"absolute",bottom:22,left:16,right:16,borderTop:"1px solid var(--line)",paddingTop:15}}><div className="navitem"><div className="avatar">KB</div><span><b style={{fontSize:11}}>Karan Bhise</b><small style={{display:"block",color:"var(--muted)",fontSize:9}}>Administrator</small></span><ChevronDown size={13} style={{marginLeft:"auto"}}/></div></div>
      </aside>
      <main className="main">
        <header className="topbar"><div className="crumb">Workspace / <b>{active}</b></div><div className="top-actions"><button className="iconbtn"><Search size={15}/></button><button className="iconbtn"><Bell size={15}/></button><div className="avatar">KB</div></div></header>
        <div className="content">
          <div className="hero"><div><div className="eyebrow">Autonomous engineering</div><h1>{active === "Overview" ? "Good evening, Karan." : active}</h1><div className="subtitle">Ship software faster with controlled, observable AI agents.</div></div><button className="primary" onClick={()=>setStarted(!started)}><Plus size={14} style={{verticalAlign:"-2px",marginRight:6}}/>{started ? "Project initialized" : "New project"}</button></div>
          <section className="grid4">
            {[['Active Projects','04','+1 this week'],['AI Tasks Running','12','+28% vs last week'],['Security Score','91%','Excellent posture'],['Deployments','27','98.6% success rate']].map(([l,v,t])=><div className="card" key={l}><div className="statlabel">{l}</div><div className="stat">{v}</div><div className={`trend ${t==='Excellent posture'?'muted':''}`}>{t}</div></div>)}
          </section>
          <section className="grid-main">
            <div className="card"><div className="cardhead"><div className="cardtitle">Projects</div><span className="link">View all →</span></div>{projects.map(p=><div className="project" key={p.name}><div><div className="pname">{p.name}</div><div className="pmeta">{p.meta}</div></div><span className={`badge ${p.cls}`}>{p.badge}</span></div>)}</div>
            <div className="card"><div className="cardhead"><div className="cardtitle">Agent activity</div><span className="link">Live</span></div>{agents.map(([name,desc,Icon])=><div className="agentrow" key={name as string}><div className="agenticon"><Icon size={14}/></div><div><div className="agentname">{name as string}</div><div className="agentdesc">{desc as string}</div></div><span className="live">● ACTIVE</span></div>)}</div>
          </section>
          <section className="grid-main">
            <div className="card"><div className="cardhead"><div className="cardtitle">Recent activity</div><span className="link">Audit log →</span></div>{[["Developer Agent opened PR #42","3 min ago"],["Security Agent completed dependency scan","18 min ago"],["RAG index refreshed · 248 documents","42 min ago"],["Deployment v0.8.4 promoted to staging","1 hr ago"]].map(([x,t])=><div className="activity" key={x}><div className="dot"/><div><p>{x}</p><small>{t}</small></div></div>)}</div>
            <div className="card security"><div className="cardhead"><div className="cardtitle">Security posture</div><span className="badge">Protected</span></div><div className="score"><div className="ring"/><div className="checks">{[["Critical vulnerabilities","0"],["Dependency risks","2 low"],["Secrets exposed","0"],["Policy checks","24 / 24"]].map(([x,v])=><div className="check" key={x}><span>{x}</span><b>{v}</b></div>)}</div></div></div>
          </section>
          <div className="footer">AEGIS v0.1 · Mock environment · Human approval required for privileged actions</div>
        </div>
      </main>
    </div>
  );
}
