'use client';

import { FormEvent, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Network, ShieldCheck, Sparkles } from 'lucide-react';
import { generateArchitecture, type ArchitecturePlan } from '../../lib/aegis-api';

const defaultRequirement = 'Build a secure multi-tenant SaaS API with authentication, role-based access control, PostgreSQL, audit logs, rate limiting, and a Next.js dashboard.';
type PlanListKey = 'architecture' | 'components' | 'risks' | 'next_steps';
const sections: Array<{ key: PlanListKey; title: string; icon: typeof Network }> = [
  { key: 'architecture', title: 'Architecture', icon: Network },
  { key: 'components', title: 'Core components', icon: Sparkles },
  { key: 'risks', title: 'Risks & guardrails', icon: AlertTriangle },
  { key: 'next_steps', title: 'Recommended next steps', icon: CheckCircle2 },
];

export default function ArchitectPage() {
  const [requirement, setRequirement] = useState(defaultRequirement);
  const [plan, setPlan] = useState<ArchitecturePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (requirement.trim().length < 10) { setError('Describe the system in at least 10 characters.'); return; }
    setLoading(true); setError('');
    try { setPlan(await generateArchitecture(requirement.trim())); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to generate the architecture plan.'); }
    finally { setLoading(false); }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '34px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <a href="/" style={{ color: '#8f99a8', textDecoration: 'none', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 28 }}><ArrowLeft size={14} /> Back to AEGIS Command Center</a>
        <div className="section-header" style={{ alignItems: 'flex-end' }}>
          <div><div className="eyebrow">AI ORCHESTRATION · ARCHITECT AGENT</div><h1>Architecture workspace</h1><p>Turn a plain-language requirement into a structured, reviewable architecture plan before development begins.</p></div>
          <div className="badge badge-green"><span className="badge-dot" />Controlled autonomy</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, .9fr) minmax(0, 1.1fr)', gap: 14, alignItems: 'start' }}>
          <form className="card" onSubmit={submit} style={{ padding: 18 }}>
            <div className="eyebrow">REQUIREMENT</div><h2 style={{ fontSize: 16, margin: '0 0 7px' }}>What should AEGIS design?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 10, lineHeight: 1.6, margin: '0 0 14px' }}>The requirement is sent to the FastAPI Architect endpoint. In development, AEGIS can run in deterministic mock mode; with an OpenAI key configured, the same workflow can use the real model provider.</p>
            <textarea value={requirement} onChange={(event) => setRequirement(event.target.value)} rows={12} placeholder="Describe the product, users, integrations, data and security requirements..." style={{ width: '100%', resize: 'vertical', border: '1px solid var(--line)', borderRadius: 9, background: '#0b0e13', color: 'var(--text)', padding: 13, outline: 'none', fontSize: 11, lineHeight: 1.65 }} />
            {error && <div style={{ marginTop: 10, padding: 10, border: '1px solid #4d202a', borderRadius: 8, background: '#230e14', color: '#ff9aaa', fontSize: 10, display: 'flex', gap: 7, alignItems: 'flex-start' }}><AlertTriangle size={14} />{error}</div>}
            <button className="primary-button" disabled={loading} style={{ marginTop: 12, width: '100%', opacity: loading ? .7 : 1 }}>{loading ? <><Loader2 size={15} /> Generating architecture...</> : <><Sparkles size={15} /> Generate architecture</>}</button>
          </form>
          <section className="card" style={{ minHeight: 500 }}>
            {!plan ? <div style={{ minHeight: 500, display: 'grid', placeItems: 'center', padding: 40, textAlign: 'center' }}><div><div className="agent-icon violet" style={{ margin: '0 auto 14px' }}><Network size={23} /></div><h2 style={{ fontSize: 16, margin: '0 0 7px' }}>Ready to reason</h2><p style={{ color: 'var(--muted)', fontSize: 10, maxWidth: 360, lineHeight: 1.6, margin: 0 }}>Submit a requirement to produce an architecture summary, system boundaries, risks and implementation sequence.</p></div></div> :
              <div style={{ padding: 18 }}><div className="card-heading" style={{ padding: '0 0 14px', borderBottom: '1px solid var(--line)' }}><div><div className="eyebrow">ARCHITECTURE PLAN</div><h3 style={{ fontSize: 14, margin: 0 }}>Generated design</h3></div><div className="badge badge-blue"><span className="badge-dot" />Ready for review</div></div>
                <div style={{ margin: '15px 0 18px', padding: 13, borderRadius: 8, background: '#121821', border: '1px solid #202b39' }}><div className="eyebrow">SUMMARY</div><p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#c9d1dc' }}>{plan.summary}</p></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{sections.map(({ key, title, icon: Icon }) => <div key={key} style={{ border: '1px solid var(--line)', borderRadius: 9, padding: 13, background: '#0d1015' }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}><Icon size={14} color={key === 'risks' ? 'var(--amber)' : 'var(--accent)'} /><b style={{ fontSize: 10 }}>{title}</b></div><ul style={{ margin: 0, paddingLeft: 17, color: '#8d98a7', fontSize: 9, lineHeight: 1.7 }}>{plan[key].map((item: string) => <li key={item}>{item}</li>)}</ul></div>)}</div>
                <div style={{ marginTop: 13, padding: 11, borderTop: '1px solid var(--line)', color: '#687382', fontSize: 9, display: 'flex', alignItems: 'center', gap: 7 }}><ShieldCheck size={13} color="var(--green)" /> No deployment or destructive action is performed by this step.</div>
              </div>}
          </section>
        </div>
      </div>
    </main>
  );
}
