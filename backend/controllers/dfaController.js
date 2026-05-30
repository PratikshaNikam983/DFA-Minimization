
const {
    validateDFA,
    findReachableStates,
    removeUnreachableStates,
    partitionRefinement,
} = require('../algorithms/minimizeDFA');


const minimizeHandler = (req, res) => {
    try {
        const { states, alphabet, transitions, startState, finalStates } = req.body;

        
        if (!states || !alphabet || !transitions || !startState || !finalStates) {
            return res.status(400).json({
                error: 'Missing required fields',
                message:
                    'Request body must include: states, alphabet, transitions, startState, finalStates',
            });
        }

        const dfaData = { states, alphabet, transitions, startState, finalStates };

    
        const validation = validateDFA(dfaData);
        if (!validation.valid) {
            return res.status(400).json({
                error: 'Invalid DFA',
                messages: validation.errors,
            });
        }

      
        const reachableStates = findReachableStates(dfaData);
        const reachableDFA = removeUnreachableStates(dfaData, reachableStates);

        
        const { partitionSteps, minimizedDFA } = partitionRefinement(reachableDFA);

        
        return res.status(200).json({
            minimizedDFA,
            graphData: {
                reachableStates,
                partitionSteps,
                minimizedDFA,
            },
        });
    } catch (err) {
        console.error('Minimization error:', err);
        return res.status(500).json({
            error: 'Minimization failed',
            message: err.message,
        });
    }
};

module.exports = { minimizeHandler };
