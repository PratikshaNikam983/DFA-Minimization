/**
 * About.jsx - Educational content
 */

const sections = [
    {
        title: 'What is a DFA?', emoji: '🤖',
        content: `A Deterministic Finite Automaton (DFA) is a mathematical model of computation that recognizes patterns in strings. It has five components:\n\n• States (Q) — A finite set of states\n• Alphabet (Σ) — A finite set of input symbols\n• Transition Function (δ) — Maps each (state, symbol) pair to exactly one next state\n• Start State (q₀) — The initial state\n• Final States (F) — Accepting states\n\nThe DFA reads input one symbol at a time, following transitions. If it ends in a final state, the string is accepted.`,
    },
    {
        title: 'What is DFA Minimization?', emoji: '✂️',
        content: `DFA minimization reduces a DFA to its smallest equivalent form — the fewest states that recognize the same language.\n\nWhy minimize?\n• Reduces computational cost\n• Simplifies analysis\n• Produces a unique canonical form\n• Useful in compilers, pattern matching, and verification`,
    },
    {
        title: 'The Algorithm', emoji: '⚙️',
        content: `This system uses Partition Refinement:\n\n1. Remove Unreachable States — BFS from start state\n2. Initial Partition — Separate final and non-final states\n3. Iterative Refinement — Split groups where states transition to different groups\n4. Termination — Stop when no more splits possible\n5. Construct Minimized DFA — Each group becomes one state`,
    },
    {
        title: 'Time Complexity', emoji: '⏱️',
        content: `Standard Partition Refinement:\n• Time: O(n² · |Σ|) where n = states, |Σ| = alphabet size\n• Space: O(n · |Σ|)\n\nHopcroft's optimized version runs in O(n · |Σ| · log n).`,
    },
    {
        title: 'Applications', emoji: '💡',
        content: `• Compiler Design — Lexical analyzers use minimized DFAs\n• Pattern Matching — Regular expressions compile to DFAs\n• Network Protocols — Protocol verification\n• Model Checking — Hardware/software verification\n• Bioinformatics — DNA/RNA pattern recognition`,
    },
]

function About() {
    return (
        <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
            <div className="page-header-sm">
                <h1>About DFA Minimization</h1>
                <p>Learn about Deterministic Finite Automata and the minimization algorithm</p>
            </div>

            {sections.map(s => (
                <div key={s.title} className="about-article">
                    <div className="about-article-header">
                        <span style={{ fontSize: 20 }}>{s.emoji}</span>
                        <h2>{s.title}</h2>
                    </div>
                    <div className="about-article-body">{s.content}</div>
                </div>
            ))}

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-faint)', marginTop: 40 }}>
                DFA Minimization System — Semester IV Project | Theory of Computation
            </p>
        </div>
    )
}

export default About
