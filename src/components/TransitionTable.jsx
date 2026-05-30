
function TransitionTable({ dfa, title }) {
    if (!dfa || !dfa.states || !dfa.alphabet || !dfa.transitions) return null
    const { states, alphabet, transitions, startState, finalStates } = dfa

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {title && (
                <div style={{ padding: '12px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{title}</span>
                </div>
            )}
            <div style={{ overflowX: 'auto' }}>
                <table className="dfa-table">
                    <thead>
                        <tr>
                            <th>State</th>
                            {alphabet.map(sym => <th key={sym} className="center">δ( , {sym})</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {states.map(state => {
                            const isStart = state === startState
                            const isFinal = finalStates.includes(state)
                            let prefix = ''
                            if (isStart && isFinal) prefix = '→* '
                            else if (isStart) prefix = '→ '
                            else if (isFinal) prefix = '* '
                            return (
                                <tr key={state}>
                                    <td>
                                        {prefix && <span style={{ color: '#4f46e5', fontWeight: 700 }}>{prefix}</span>}
                                        {state}
                                    </td>
                                    {alphabet.map(sym => (
                                        <td key={sym} className="center">{transitions[state]?.[sym] || '—'}</td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="table-legend">
                <span>→ Start State</span>
                <span>* Final State</span>
            </div>
        </div>
    )
}

export default TransitionTable
