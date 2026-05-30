/**
 * Result.jsx - Minimization Results Page
 * Supports downloading results as JSON or PDF
 */
import { Link } from 'react-router-dom'
import TransitionTable from '../components/TransitionTable'
import PartitionSteps from '../components/PartitionSteps'

function Result({ result, originalDFA }) {
    if (!result || !originalDFA) {
        return (
            <div className="empty-state">
                <div className="card">
                    <p style={{ fontSize: 40, marginBottom: 12 }}>📄</p>
                    <h2>No Results Yet</h2>
                    <p>You need to input and minimize a DFA first.</p>
                    <Link to="/input" className="btn-primary">Go to Input →</Link>
                </div>
            </div>
        )
    }

    const { reachableStates, partitionSteps, minimizedDFA } = result

    const downloadJSON = () => {
        const data = { originalDFA, reachableStates, partitionSteps, minimizedDFA }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'dfa-minimization-result.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const downloadPDF = () => {
        // Build transition table HTML helper
        const buildTableHTML = (dfa, title) => {
            const symbols = dfa.alphabet || []
            let html = `<h3 style="margin:18px 0 8px;font-size:15px;">${title}</h3>`
            html += `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">`
            html += `<thead><tr style="background:#f5f7fb;"><th style="padding:8px 12px;border:1px solid #e2e5f0;text-align:left;">State</th>`
            symbols.forEach(s => {
                html += `<th style="padding:8px 12px;border:1px solid #e2e5f0;text-align:center;color:#7c3aed;">δ( , ${s})</th>`
            })
            html += `</tr></thead><tbody>`
            dfa.states.forEach(state => {
                const isStart = state === dfa.startState
                const isFinal = (dfa.finalStates || []).includes(state)
                const prefix = isStart ? '→ ' : isFinal ? '* ' : ''
                const stateColor = (isStart || isFinal) ? 'color:#7c3aed;' : ''
                html += `<tr><td style="padding:8px 12px;border:1px solid #e2e5f0;font-family:monospace;${stateColor}">${prefix}${state}</td>`
                symbols.forEach(sym => {
                    const key = `${state},${sym}`
                    const target = (dfa.transitions && dfa.transitions[key]) || '-'
                    html += `<td style="padding:8px 12px;border:1px solid #e2e5f0;text-align:center;font-family:monospace;color:#7c3aed;">${target}</td>`
                })
                html += `</tr>`
            })
            html += `</tbody></table>`
            return html
        }

        // Build partition steps HTML
        let stepsHTML = '<h3 style="margin:18px 0 8px;font-size:15px;">Partition Refinement Steps</h3>'
        partitionSteps.forEach((step, i) => {
            stepsHTML += `<div style="margin-bottom:8px;padding:10px 14px;background:#f5f7fb;border-radius:8px;border:1px solid #e2e5f0;">`
            stepsHTML += `<strong style="color:#7c3aed;">Step ${i + 1}:</strong> `
            if (Array.isArray(step)) {
                stepsHTML += step.map(group => `{ ${Array.isArray(group) ? group.join(', ') : group} }`).join('  ')
            } else {
                stepsHTML += JSON.stringify(step)
            }
            stepsHTML += `</div>`
        })

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>DFA Minimization Results</title>
                <style>
                    body { font-family: 'Inter', 'Segoe UI', sans-serif; padding: 32px; color: #111827; max-width: 800px; margin: 0 auto; }
                    h1 { font-size: 24px; color: #111827; margin-bottom: 4px; }
                    h2 { font-size: 18px; color: #374151; margin: 24px 0 12px; }
                    .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
                    .stats { display: flex; gap: 12px; margin-bottom: 24px; }
                    .stat-box { flex: 1; text-align: center; padding: 16px; background: #f5f7fb; border-radius: 10px; border: 1px solid #e2e5f0; }
                    .stat-val { font-size: 28px; font-weight: 800; color: #7c3aed; }
                    .stat-lbl { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
                    .badge { display: inline-block; padding: 4px 12px; background: #ede9fe; border: 1px solid #c4b5fd; border-radius: 6px; font-size: 13px; font-family: monospace; color: #6d28d9; margin: 3px; }
                    .footer-print { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e5f0; font-size: 11px; color: #9ca3af; text-align: center; }
                    @media print { body { padding: 16px; } }
                </style>
            </head>
            <body>
                <h1>DFA Minimization Results</h1>
                <div class="subtitle">Reduced from ${originalDFA.states.length} states to ${minimizedDFA.states.length} states</div>
                
                <div class="stats">
                    <div class="stat-box"><div class="stat-val">${originalDFA.states.length}</div><div class="stat-lbl">Original States</div></div>
                    <div class="stat-box"><div class="stat-val">${reachableStates.length}</div><div class="stat-lbl">Reachable States</div></div>
                    <div class="stat-box"><div class="stat-val">${minimizedDFA.states.length}</div><div class="stat-lbl">Minimized States</div></div>
                    <div class="stat-box"><div class="stat-val">${partitionSteps.length}</div><div class="stat-lbl">Partition Steps</div></div>
                </div>

                <h2>📋 Original DFA</h2>
                ${buildTableHTML(originalDFA, 'Original Transition Table')}

                <h2>🔍 Reachable States</h2>
                <div style="margin-bottom:16px;">
                    ${reachableStates.map(s => `<span class="badge">${s}</span>`).join(' ')}
                </div>

                ${stepsHTML}

                <h2>✅ Minimized DFA</h2>
                ${buildTableHTML(minimizedDFA, 'Minimized Transition Table')}

                <div class="footer-print">DFA Minimization System — Generated ${new Date().toLocaleString()}</div>
            </body>
            </html>
        `

        // Use a hidden iframe to avoid popup blockers
        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.top = '-10000px'
        iframe.style.left = '-10000px'
        iframe.style.width = '800px'
        iframe.style.height = '600px'
        document.body.appendChild(iframe)

        const doc = iframe.contentDocument || iframe.contentWindow.document
        doc.open()
        doc.write(printContent)
        doc.close()

        // Wait for content to render, then print
        setTimeout(() => {
            iframe.contentWindow.focus()
            iframe.contentWindow.print()
            // Clean up after print dialog closes
            setTimeout(() => {
                document.body.removeChild(iframe)
            }, 1000)
        }, 500)
    }

    return (
        <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
            {/* Header */}
            <div className="page-header-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1>Minimization Results</h1>
                    <p>Reduced from {originalDFA.states.length} states to {minimizedDFA.states.length} states</p>
                </div>
                <div className="header-actions">
                    <button onClick={downloadJSON} className="btn-white btn-sm">⬇ Download JSON</button>
                    <button onClick={downloadPDF} className="btn-white btn-sm">📄 Download PDF</button>
                    <Link to="/visualize" className="btn-outline btn-sm">👁 Visualize</Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid-stats">
                <div className="stat-card"><div className="stat-value">{originalDFA.states.length}</div><div className="stat-label">Original States</div></div>
                <div className="stat-card"><div className="stat-value">{reachableStates.length}</div><div className="stat-label">Reachable States</div></div>
                <div className="stat-card"><div className="stat-value">{minimizedDFA.states.length}</div><div className="stat-label">Minimized States</div></div>
                <div className="stat-card"><div className="stat-value">{partitionSteps.length}</div><div className="stat-label">Partition Steps</div></div>
            </div>

            {/* Original DFA */}
            <div className="section">
                <h2 className="section-title">📋 Original DFA</h2>
                <TransitionTable dfa={originalDFA} title="Original Transition Table" />
            </div>

            {/* Reachable States */}
            <div className="section">
                <h2 className="section-title">🔍 Reachable States</h2>
                <div className="card">
                    <div className="flex-wrap-gap">
                        {reachableStates.map(s => <span key={s} className="state-badge">{s}</span>)}
                    </div>
                    {reachableStates.length < originalDFA.states.length && (
                        <p style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
                            Removed {originalDFA.states.length - reachableStates.length} unreachable state(s):{' '}
                            <span style={{ color: '#dc2626', fontFamily: 'monospace' }}>
                                {originalDFA.states.filter(s => !reachableStates.includes(s)).join(', ')}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            {/* Partition Steps */}
            <div className="section">
                <h2 className="section-title">📊 Partition Refinement Steps</h2>
                <PartitionSteps steps={partitionSteps} />
            </div>

            {/* Minimized DFA */}
            <div className="section">
                <h2 className="section-title">✅ Minimized DFA</h2>
                <TransitionTable dfa={minimizedDFA} title="Minimized Transition Table" />
            </div>
        </div>
    )
}

export default Result

