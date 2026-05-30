
import { useState } from 'react'

const SAMPLE_DFAS = [
    {
        name: 'Example 1: Strings ending with "b"',
        data: {
            states: ['A', 'B', 'C', 'D'],
            alphabet: ['a', 'b'],
            transitions: { A: { a: 'B', b: 'C' }, B: { a: 'A', b: 'D' }, C: { a: 'B', b: 'C' }, D: { a: 'A', b: 'D' } },
            startState: 'A',
            finalStates: ['C', 'D'],
        },
    },
    {
        name: 'Example 2: With unreachable states',
        data: {
            states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'],
            alphabet: ['0', '1'],
            transitions: {
                q0: { '0': 'q1', '1': 'q2' }, q1: { '0': 'q0', '1': 'q3' }, q2: { '0': 'q4', '1': 'q5' },
                q3: { '0': 'q4', '1': 'q5' }, q4: { '0': 'q4', '1': 'q5' }, q5: { '0': 'q5', '1': 'q5' },
            },
            startState: 'q0',
            finalStates: ['q3', 'q4'],
        },
    },
    {
        name: 'Example 3: Strings starting with "a"',
        data: {
            states: ['q0', 'q1', 'q2'],
            alphabet: ['a', 'b'],
            transitions: {
                q0: { a: 'q1', b: 'q2' },
                q1: { a: 'q1', b: 'q1' },
                q2: { a: 'q2', b: 'q2' },
            },
            startState: 'q0',
            finalStates: ['q1'],
        },
    },
    {
        name: 'Example 4: Even number of 0s',
        data: {
            states: ['s0', 's1', 's2', 's3', 's4', 's5'],
            alphabet: ['0', '1'],
            transitions: {
                s0: { '0': 's1', '1': 's2' },
                s1: { '0': 's0', '1': 's3' },
                s2: { '0': 's3', '1': 's0' },
                s3: { '0': 's2', '1': 's1' },
                s4: { '0': 's5', '1': 's4' },
                s5: { '0': 's4', '1': 's5' },
            },
            startState: 's0',
            finalStates: ['s0', 's2', 's4'],
        },
    },
]

function DFAForm({ onSubmit, isLoading }) {
    const [statesInput, setStatesInput] = useState('')
    const [alphabetInput, setAlphabetInput] = useState('')
    const [startState, setStartState] = useState('')
    const [finalStatesInput, setFinalStatesInput] = useState('')
    const [transitions, setTransitions] = useState([{ from: '', symbol: '', to: '' }])
    const [errors, setErrors] = useState([])

    const addTransition = () => setTransitions([...transitions, { from: '', symbol: '', to: '' }])

    const removeTransition = (index) => {
        if (transitions.length <= 1) return
        setTransitions(transitions.filter((_, i) => i !== index))
    }

    const updateTransition = (index, field, value) => {
        const updated = [...transitions]
        updated[index][field] = value.trim()
        setTransitions(updated)
    }

    const loadExample = (example) => {
        const { states, alphabet, startState: s, finalStates, transitions: t } = example.data
        setStatesInput(states.join(', '))
        setAlphabetInput(alphabet.join(', '))
        setStartState(s)
        setFinalStatesInput(finalStates.join(', '))
        const rows = []
        Object.entries(t).forEach(([from, syms]) => {
            Object.entries(syms).forEach(([sym, to]) => rows.push({ from, symbol: sym, to }))
        })
        setTransitions(rows)
        setErrors([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = []
        const states = statesInput.split(',').map(s => s.trim()).filter(Boolean)
        const alphabet = alphabetInput.split(',').map(s => s.trim()).filter(Boolean)
        const finals = finalStatesInput.split(',').map(s => s.trim()).filter(Boolean)

        if (!states.length) errs.push('At least one state is required.')
        if (!alphabet.length) errs.push('At least one alphabet symbol is required.')
        if (!startState.trim()) errs.push('Start state is required.')
        else if (!states.includes(startState.trim())) errs.push(`Start state "${startState.trim()}" not in states.`)
        if (!finals.length) errs.push('At least one final state is required.')
        finals.forEach(f => { if (!states.includes(f)) errs.push(`Final state "${f}" not in states.`) })

        const valid = transitions.filter(t => t.from && t.symbol && t.to)
        if (!valid.length) errs.push('At least one transition is required.')
        valid.forEach(t => {
            if (!states.includes(t.from)) errs.push(`Source "${t.from}" not a valid state.`)
            if (!alphabet.includes(t.symbol)) errs.push(`Symbol "${t.symbol}" not in alphabet.`)
            if (!states.includes(t.to)) errs.push(`Target "${t.to}" not a valid state.`)
        })

        if (errs.length) { setErrors(errs); return }

        const transObj = {}
        valid.forEach(({ from, symbol, to }) => {
            if (!transObj[from]) transObj[from] = {}
            transObj[from][symbol] = to
        })

        setErrors([])
        onSubmit({ states, alphabet, transitions: transObj, startState: startState.trim(), finalStates: finals })
    }

    return (
        <div>
            {/* Sample Data Buttons */}
            <div className="card" style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Load Sample Data:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SAMPLE_DFAS.map((ex, i) => (
                        <button key={i} type="button" onClick={() => loadExample(ex)} className="btn-sample">{ex.name}</button>
                    ))}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card">
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 20 }}>DFA Input</h2>

                {errors.length > 0 && (
                    <div className="error-box">
                        <strong>Please fix the following:</strong>
                        <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">States (comma-separated):</label>
                    <input type="text" value={statesInput} onChange={e => setStatesInput(e.target.value)} placeholder="e.g. q0, q1, q2" className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label">Alphabet (comma-separated):</label>
                    <input type="text" value={alphabetInput} onChange={e => setAlphabetInput(e.target.value)} placeholder="e.g. a, b" className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label">Start State:</label>
                    <input type="text" value={startState} onChange={e => setStartState(e.target.value)} placeholder="e.g. q0" className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label">Final States (comma-separated):</label>
                    <input type="text" value={finalStatesInput} onChange={e => setFinalStatesInput(e.target.value)} placeholder="e.g. q2" className="form-input" />
                </div>

                <div className="form-group">
                    <div className="flex-between" style={{ marginBottom: 8 }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>Transitions:</label>
                        <button type="button" onClick={addTransition} className="btn-green">+ Add Transition</button>
                    </div>
                    {transitions.map((t, index) => (
                        <div key={index} className="transition-row">
                            <input value={t.from} onChange={e => updateTransition(index, 'from', e.target.value)} placeholder="From state" />
                            <input value={t.symbol} onChange={e => updateTransition(index, 'symbol', e.target.value)} placeholder="Symbol" className="symbol-input" />
                            <input value={t.to} onChange={e => updateTransition(index, 'to', e.target.value)} placeholder="To state" />
                            <button type="button" onClick={() => removeTransition(index)} className="btn-red">Remove</button>
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 15 }}>
                    {isLoading ? (<><span className="spinner" style={{ marginRight: 8 }}></span>Minimizing...</>) : 'Minimize DFA'}
                </button>
            </form>
        </div>
    )
}

export default DFAForm
