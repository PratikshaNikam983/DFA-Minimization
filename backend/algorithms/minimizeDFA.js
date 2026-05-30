

/**
 * Validate that the DFA definition is complete and consistent.
 * @param {Object} dfa
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateDFA(dfa) {
    const errors = [];
    const { states, alphabet, transitions, startState, finalStates } = dfa;

    if (!states || states.length === 0) {
        errors.push('DFA must have at least one state.');
    }

    if (!alphabet || alphabet.length === 0) {
        errors.push('DFA must have at least one alphabet symbol.');
    }

    if (!startState) {
        errors.push('Start state is required.');
    } else if (!states.includes(startState)) {
        errors.push(`Start state "${startState}" is not in the states list.`);
    }

    if (!finalStates || finalStates.length === 0) {
        errors.push('At least one final state is required.');
    } else {
        finalStates.forEach((f) => {
            if (!states.includes(f)) {
                errors.push(`Final state "${f}" is not in the states list.`);
            }
        });
    }

    if (transitions && states && alphabet) {
        states.forEach((state) => {
            alphabet.forEach((symbol) => {
                const target = transitions[state]?.[symbol];
                if (target && !states.includes(target)) {
                    errors.push(
                        `Transition δ(${state}, ${symbol}) = "${target}" goes to invalid state.`
                    );
                }
            });
        });
    }

    return { valid: errors.length === 0, errors };
}

 

/**
 * Find all states reachable from the start state using BFS.
 * @param {Object} dfa
 * @returns {string[]}
 */
function findReachableStates(dfa) {
    const { states, alphabet, transitions, startState } = dfa;
    const visited = new Set();
    const queue = [startState];
    visited.add(startState);

    while (queue.length > 0) {
        const current = queue.shift();
        alphabet.forEach((symbol) => {
            const next = transitions[current]?.[symbol];
            if (next && !visited.has(next)) {
                visited.add(next);
                queue.push(next);
            }
        });
    }

    return states.filter((s) => visited.has(s));
}

/**
 * Remove unreachable states and their transitions.
 * @param {Object} dfa
 * @param {string[]} reachableStates
 * @returns {Object}
 */
function removeUnreachableStates(dfa, reachableStates) {
    const reachableSet = new Set(reachableStates);
    const newTransitions = {};

    reachableStates.forEach((state) => {
        if (dfa.transitions[state]) {
            newTransitions[state] = {};
            Object.entries(dfa.transitions[state]).forEach(([symbol, target]) => {
                if (reachableSet.has(target)) {
                    newTransitions[state][symbol] = target;
                }
            });
        }
    });

    return {
        states: reachableStates,
        alphabet: dfa.alphabet,
        transitions: newTransitions,
        startState: dfa.startState,
        finalStates: dfa.finalStates.filter((f) => reachableSet.has(f)),
    };
}

// ─────────────────────────────────────────────────────────
// Partition Refinement (Hopcroft-style)
// ─────────────────────────────────────────────────────────

/**
 * Split a group if its states transition to different partition groups.
 * @param {string[]} group
 * @param {string[][]} partitions
 * @param {string[]} alphabet
 * @param {Object} transitions
 * @returns {string[][]}
 */
function splitGroup(group, partitions, alphabet, transitions) {
    const getGroupIndex = (state) => {
        return partitions.findIndex((g) => g.includes(state));
    };

    const getSignature = (state) => {
        return alphabet
            .map((symbol) => {
                const target = transitions[state]?.[symbol];
                if (!target) return -1; // Dead state / missing transition
                return getGroupIndex(target);
            })
            .join(',');
    };

    const signatureMap = {};
    group.forEach((state) => {
        const sig = getSignature(state);
        if (!signatureMap[sig]) signatureMap[sig] = [];
        signatureMap[sig].push(state);
    });

    return Object.values(signatureMap);
}

/**
 * Build the minimized DFA from final partitions.
 * @param {string[][]} partitions
 * @param {Object} dfa
 * @returns {Object}
 */
function buildMinimizedDFA(partitions, dfa) {
    const { alphabet, transitions, startState, finalStates } = dfa;
    const finalSet = new Set(finalStates);

    const stateToGroup = {};
    partitions.forEach((group, idx) => {
        group.forEach((state) => {
            stateToGroup[state] = idx;
        });
    });

    const newStateNames = partitions.map((group) =>
        group.length === 1 ? group[0] : `{${group.join(',')}}`
    );

    const newTransitions = {};
    partitions.forEach((group, idx) => {
        const representative = group[0];
        const stateName = newStateNames[idx];
        newTransitions[stateName] = {};

        alphabet.forEach((symbol) => {
            const target = transitions[representative]?.[symbol];
            if (target) {
                const targetGroupIdx = stateToGroup[target];
                newTransitions[stateName][symbol] = newStateNames[targetGroupIdx];
            }
        });
    });

    const startGroupIdx = stateToGroup[startState];
    const newStartState = newStateNames[startGroupIdx];

    const newFinalStates = partitions
        .map((group, idx) => ({ name: newStateNames[idx], group }))
        .filter(({ group }) => group.some((s) => finalSet.has(s)))
        .map(({ name }) => name);

    return {
        states: newStateNames,
        alphabet: [...alphabet],
        transitions: newTransitions,
        startState: newStartState,
        finalStates: newFinalStates,
    };
}

/**
 * Run partition refinement on a DFA (with only reachable states).
 *
 * Algorithm:
 * 1. Initial partition: {final states} and {non-final states}
 * 2. For each group, check if all states behave identically
 * 3. If not, split the group into subgroups
 * 4. Repeat until no more splits are possible
 *
 * @param {Object} dfa
 * @returns {{ partitionSteps: Array, minimizedDFA: Object }}
 */
function partitionRefinement(dfa) {
    const { states, alphabet, transitions, startState, finalStates } = dfa;
    const finalSet = new Set(finalStates);

    const nonFinalStates = states.filter((s) => !finalSet.has(s));
    let partitions = [];

    if (nonFinalStates.length > 0) partitions.push(nonFinalStates);
    if (finalStates.length > 0) partitions.push([...finalStates]);

    const partitionSteps = [];
    partitionSteps.push({
        step: 1,
        partitions: partitions.map((g) => [...g]),
        description: 'Initial partition: separate final and non-final states',
    });

    let changed = true;
    let stepCount = 1;

    while (changed) {
        changed = false;
        const newPartitions = [];

        for (const group of partitions) {
            if (group.length <= 1) {
                newPartitions.push(group);
                continue;
            }

            const subgroups = splitGroup(group, partitions, alphabet, transitions);

            if (subgroups.length > 1) {
                changed = true;
                newPartitions.push(...subgroups);
            } else {
                newPartitions.push(group);
            }
        }

        partitions = newPartitions;

        if (changed) {
            stepCount++;
            partitionSteps.push({
                step: stepCount,
                partitions: partitions.map((g) => [...g]),
                description: `Refinement step ${stepCount}: split groups where states transition to different groups`,
            });
        }
    }

    // Final step
    stepCount++;
    partitionSteps.push({
        step: stepCount,
        partitions: partitions.map((g) => [...g]),
        description:
            'Final partition: no further splits possible — these are the minimized states',
    });

    const minimizedDFA = buildMinimizedDFA(partitions, dfa);

    return { partitionSteps, minimizedDFA };
}



module.exports = {
    validateDFA,
    findReachableStates,
    removeUnreachableStates,
    partitionRefinement,
};
