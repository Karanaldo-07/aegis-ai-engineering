'use client';

import { FormEvent, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardCheck, Loader2, ShieldCheck, TestTube2 } from 'lucide-react';
import { generateTestingPlan, type TestingPlan } from '../../lib/aegis-api';

const defaultRequirement = 'Verify a new API feature with unit, contract, integration, regression, and security coverage before approval.';
type ListKey = 'strategy' | 'test_cases' | 'quality_gates' | 'guardrails';
const sections: Array<{ key: ListKey; title: string; icon: typeof TestTube2 }> = [
  { key: 'strategy', title: 'Test strategy', icon: TestTube2 },
  { key: 'test_cases', title: 'Test cases', icon: ClipboardCheck },
  { key: 'quality_gates', title: 'Quality gates', icon: CheckCircle2 },
  { key: 'guardrails', title: 'Safety controls', icon: ShieldCheck },
];

export default function TestingPage() {
  const [requirement, setRequirement] = useState(defaultRequirement);
  const [plan, setPlan] = useState<TestingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (requirement.trim().length < 10) { setError('Describe what should be verified in at least 10 characters.'); return; }
    setLoading(true); setError('');
    try { setPlan(await generateTestingPlan(requirement.trim())); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to generate the testing plan.'); }
    finally { setLoading(false); }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '34px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <a href="/" style={{ color: '#8f99a8', textDecoration: 'none', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 28 }}><ArrowLeft size={14} /> Back to AEGIS Command Center</a>
        <div className="section-header" style={{ alignItems: 'flex-end' }}>
          <div><div className="eyebrow">AI ORCHESTRATION · TESTING AGENT</div><h1>Testing workspace</h1><p>Turn a requirement into layered verification and release gates before AEGIS is allowed to act.</p></div>
          <div className="badge badge-green"><span className="badge-dot" />Read-only by default</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, .9fr) minmax(0, 1.1fr)', gap: 14, alignItems: 'start' }}>
          <form className="card" onSubmit={submit} style={{ padding: 18 }}>
            <div className="eyebrow">VERIFICATION REQUEST</div><h2 style={{ fontSize: 16, margin: '0 0 7px' }}>What should AEGIS verify?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 10, lineHeight: 1.6, margin: '0 0 14px' }}>This phase creates a reviewable test plan. It does not execute commands, modify files, write to GitHub, or deploy.</p>
            <textarea value={requirement} onChange={(event) => setRequirement(event.target.value)} rows={12} placeholder="Describe the feature, expected behavior, edge cases and constraints..." style={{ width: '100%', resize: 'vertical', border: '1px solid var(--line)', borderRadius: 9, background: '#0b0e13', color: 'var(--text)', padding: 13, outline: 'none', fontSize: 11, lineHeight: 1.65 }} />
            {error && <div style={{ marginTop: 10, padding: 10, border: '1px solid #4d202a', borderRadius: 8, background: '#230e14', color: '#ff9aaa', fontSize: 10, display: 'flex', gap: 7, alignItems: 'flex-start' }}><AlertTriangle size={14} />{error}</div>}
            <button className="primary-button" disabled={loading} style={{ marginTop: 12, width: '100%', opacity: loading ? .7 : 1 }}>{loading ? <><Loader2 size={15} /> Designing verification...</> : <><TestTube2 size={15} /> Generate testing plan</>}</button>
          </form>
          <section className="card" style={{ minHeight: 500 }}>
            {!plan ? <div style={{ minHeight: 500, display: 'grid', placeItems: 'center', padding: 40, textAlign: 'center' }}><div><div className="agent-icon green" style={{ margin: '0 auto 14px' }}><TestTube2 size={23} /></div><h2 style={{ fontSize: 16, margin: '0 0 7px' }}>Ready to verify safely</h2><p style={{ color: 'var(--muted)', fontSize: 10, maxWidth: 360, lineHeight: 1.6, margin: 0 }}>AEGIS will separate test strategy, concrete cases, quality gates and safety controls.</p></div></div> :
              <div style={{ padding: 18 }}><div className="card-heading" style={{ padding: '0 0 14px', borderBottom: '1px solid var(--line)' }}><div><div className="eyebrow">TESTING PLAN</div><h3 style={{ fontSize: 14, margin: 0 }}>Proposed verification</h3></div><div className="badge badge-blue"><span className="badge-dot" />Ready for review</div></div>
                <div style={{ margin: '15px 0 18px', padding: 13, borderRadius: 8, background: '#121821', border: '1px solid #202b39' }}><div className="eyebrow">SUMMARY</div><p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#c9d1dc' }}>{plan.summary}</p></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{sections.map(({ key, title, icon: Icon }) => <div key={key} style={{ border: '1px solid var(--line)', borderRadius: 9, padding: 13, background: '#0d1015' }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}><Icon size={14} color={key === 'guardrails' ? 'var(--green)' : 'var(--accent)'} /><b style={{ fontSize: 10 }}>{title}</b></div><ul style={{ margin: 0, paddingLeft: 17, color: '#8d98a7', fontSize: 9, lineHeight: 1.7 }}>{plan[key].map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
                <div style={{ marginTop: 13, padding: 11, borderTop: '1px solid var(--line)', color: '#687382', fontSize: 9, display: 'flex', alignItems: 'center', gap: 7 }}><ShieldCheck size={13} color="var(--green)" /> Test execution remains isolated and policy-controlled in the next automation phase.</div>
              </div>}
          </section>
        </div>
      </div>
    </main>
  );
}
