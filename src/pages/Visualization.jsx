
import { useMemo } from 'react'
import { Link } from 'react-router-dom'


function getPositions(states, cx, cy, radius) {
    const pos = {}
    states.forEach((state, i) => {
        const angle = (2 * Math.PI * i) / states.length - Math.PI / 2
        pos[state] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
    })
    return pos
}


function DFAGraph({ dfa, width, height, title }) {
    const R = 24
    const cx = width / 2
    const cy = height / 2
    const lr = Math.min(width, height) / 2 - 55

    const pos = useMemo(() => getPositions(dfa.states, cx, cy, lr), [dfa.states, cx, cy, lr])

    const edges = useMemo(() => {
        const m = {}
        Object.entries(dfa.transitions).forEach(([from, syms]) => {
            Object.entries(syms).forEach(([sym, to]) => {
                const k = `${from}->${to}`
                if (!m[k]) m[k] = { from, to, symbols: [] }
                m[k].symbols.push(sym)
            })
        })
        return Object.values(m)
    }, [dfa.transitions])

    const getPath = (from, to) => {
        const a = pos[from], b = pos[to]
        if (!a || !b) return { path: '', lx: 0, ly: 0 }
        if (from === to) {
            return { path: `M ${a.x - 8} ${a.y - R} A 15 15 0 1 1 ${a.x + 8} ${a.y - R}`, lx: a.x, ly: a.y - R - 30 }
        }
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy)
        const nx = dx / d, ny = dy / d
        const sx = a.x + nx * R, sy = a.y + ny * R, ex = b.x - nx * (R + 6), ey = b.y - ny * (R + 6)
        const mx = (sx + ex) / 2, my = (sy + ey) / 2
        const hasRev = edges.some(e => e.from === to && e.to === from)
        if (hasRev) {
            const px = -ny * 20, py = nx * 20
            return { path: `M ${sx} ${sy} Q ${mx + px} ${my + py} ${ex} ${ey}`, lx: mx + px, ly: my + py - 8 }
        }
        return { path: `M ${sx} ${sy} L ${ex} ${ey}`, lx: mx - ny * 12, ly: my + nx * 12 - 4 }
    }

    return (
        <div className="graph-container">
            <div className="graph-header">{title}</div>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="graph-svg">
                <defs>
                    <marker id={`a-${title}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                    </marker>
                    <marker id={`as-${title}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
                    </marker>
                </defs>
                
                {pos[dfa.startState] && (
                    <g>
                        <line x1={pos[dfa.startState].x - R - 35} y1={pos[dfa.startState].y} x2={pos[dfa.startState].x - R - 6} y2={pos[dfa.startState].y} stroke="#16a34a" strokeWidth="2" markerEnd={`url(#as-${title})`} />
                        <text x={pos[dfa.startState].x - R - 40} y={pos[dfa.startState].y - 8} fill="#16a34a" fontSize="10" fontWeight="600" textAnchor="end">start</text>
                    </g>
                )}
                
                {edges.map((e, i) => {
                    const { path, lx, ly } = getPath(e.from, e.to)
                    return (
                        <g key={i}>
                            <path d={path} fill="none" stroke="#6366f1" strokeWidth="1.5" markerEnd={`url(#a-${title})`} />
                            <text x={lx} y={ly} fill="#d97706" fontSize="12" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{e.symbols.join(', ')}</text>
                        </g>
                    )
                })}
                
                {dfa.states.map(state => {
                    const p = pos[state]
                    if (!p) return null
                    const isFinal = dfa.finalStates.includes(state), isStart = state === dfa.startState
                    return (
                        <g key={state}>
                            {isFinal && <circle cx={p.x} cy={p.y} r={R + 4} fill="none" stroke="#d97706" strokeWidth="2" />}
                            <circle cx={p.x} cy={p.y} r={R} fill={isStart ? '#dcfce7' : 'white'} stroke={isFinal ? '#d97706' : isStart ? '#16a34a' : '#9ca3af'} strokeWidth="2" />
                            <text x={p.x} y={p.y} fill="#1e293b" fontSize="13" fontWeight="600" textAnchor="middle" dominantBaseline="central" fontFamily="monospace">{state}</text>
                        </g>
                    )
                })}
            </svg>
            <div className="graph-legend">
                <span>🟢 Start</span>
                <span>🟡 Final (double circle)</span>
                <span>🟣 Transition</span>
            </div>
        </div>
    )
}

function Visualization({ result, originalDFA }) {
    if (!result || !originalDFA) {
        return (
            <div className="empty-state">
                <div className="card">
                    <p style={{ fontSize: 40, marginBottom: 12 }}>👁</p>
                    <h2>No DFA to Visualize</h2>
                    <p>Input and minimize a DFA first.</p>
                    <Link to="/input" className="btn-primary">Go to Input →</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container-lg" style={{ paddingTop: 32, paddingBottom: 32 }}>
            <div className="page-header-sm">
                <h1>DFA Visualization</h1>
                <p>Side-by-side comparison of original and minimized DFA</p>
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
                <DFAGraph dfa={originalDFA} width={500} height={400} title="Original DFA" />
                <DFAGraph dfa={result.minimizedDFA} width={500} height={400} title="Minimized DFA" />
            </div>

            <div style={{ textAlign: 'center' }}>
                <Link to="/result" className="btn-outline-gray">← Back to Results</Link>
            </div>
        </div>
    )
}

export default Visualization
