/**
 * Home.jsx - Landing page
 * Premium dark theme with DFA visual preview, terminal preview, and bento cards
 */
import { Link } from 'react-router-dom'

const features = [
    { step: '01', title: 'Input DFA', desc: 'Add states, alphabet & transition rules with an intuitive form interface.', color: '#7C3AED' },
    { step: '02', title: 'Validate & Minimize', desc: 'Automatic validation followed by partition refinement algorithm.', color: '#06B6D4' },
    { step: '03', title: 'View Steps', desc: 'See each partition refinement step with clear, detailed explanations.', color: '#F59E0B' },
    { step: '04', title: 'Visualize', desc: 'Interactive graph visualization of original and minimized DFA.', color: '#10B981' },
]

function Home() {
    return (
        <div>
            {/* Hero */}
            <div className="page-header" style={{ padding: '72px 24px 56px' }}>
                <h1>Minimize DFA Instantly</h1>
                <p className="hero-subtitle" style={{ position: 'relative' }}>
                    Visualize state reduction using the{' '}
                    <span className="hero-highlight">Partition Refinement Algorithm</span>
                </p>
                <div className="flex-center" style={{ marginTop: 28 }}>
                    <Link to="/input" className="btn-white" style={{ padding: '13px 32px', fontSize: 15 }}>
                        Get Started →
                    </Link>
                    <Link to="/about" className="btn-outline" style={{ padding: '12px 28px', fontSize: 15 }}>
                        Learn More
                    </Link>
                </div>

                {/* Terminal Preview */}
                <div className="terminal-preview">
                    <div className="terminal-line" style={{ marginTop: 12 }}>
                        <span className="terminal-prompt">$ </span>
                        <span>dfa-minimize </span>
                        <span className="terminal-highlight">--states</span> q0,q1,q2,q3
                    </div>
                    <div className="terminal-line">
                        <span className="terminal-prompt">$ </span>
                        <span className="terminal-highlight">--alphabet</span> a,b
                    </div>
                    <div className="terminal-line">
                        <span className="terminal-success">✓ </span>
                        <span>Minimized: 4 states → 2 states</span>
                    </div>
                </div>
            </div>

            {/* DFA Visual Preview */}
            <div className="dfa-preview-section">
                <div className="dfa-preview-container">
                    <div className="dfa-preview-title">Live Preview</div>
                    <h2 className="dfa-preview-heading">See DFA Minimization in Action</h2>

                    {/* Original DFA */}
                    <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Original DFA
                    </div>
                    <div className="dfa-flow">
                        <div className="dfa-node start-node">q0</div>
                        <span className="dfa-arrow">→</span>
                        <div className="dfa-node">q1</div>
                        <span className="dfa-arrow">→</span>
                        <div className="dfa-node">q2</div>
                        <span className="dfa-arrow">→</span>
                        <div className="dfa-node final-node">q3</div>
                    </div>

                    {/* Minimize Label */}
                    <div className="dfa-minimize-label">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Minimized
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Minimized DFA */}
                    <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Minimized DFA
                    </div>
                    <div className="dfa-flow minimized">
                        <div className="dfa-node start-node">q0</div>
                        <span className="dfa-arrow">→</span>
                        <div className="dfa-node final-node">q1</div>
                    </div>
                </div>
            </div>

            {/* Features — Bento Cards */}
            <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
                <h2 className="section-heading-gradient" style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)', marginBottom: 8 }}>
                    How It Works
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, fontSize: 15 }}>
                    A complete pipeline from DFA input to minimized automaton visualization
                </p>

                <div className="grid-4">
                    {features.map((f) => (
                        <div key={f.step} className="feature-card">
                            <span className="feature-step-number">{f.step}</span>
                            <div className="feature-icon" style={{ background: f.color }}>{f.step.replace(/^0/, '')}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="container" style={{ paddingBottom: 48 }}>
                <div className="cta-box">
                    <h2>Ready to Minimize Your DFA?</h2>
                    <p>Input your automaton and watch the partition refinement algorithm in action.</p>
                    <Link to="/input" className="btn-primary" style={{ padding: '13px 32px', fontSize: 15 }}>Start Now →</Link>
                </div>
            </div>

            <div className="footer">
                DFA Minimization System — Semester IV Project | Theory of Computation
            </div>
        </div>
    )
}

export default Home
