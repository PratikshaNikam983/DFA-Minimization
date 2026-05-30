/**
 * api.js - Axios service for backend communication
 * Contains API instance and minimization endpoint call
 */
import axios from 'axios'

// Create axios instance with backend base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
})

/**
 * Send DFA data to backend for minimization
 * @param {Object} dfaData - The DFA definition object
 * @param {string[]} dfaData.states - Array of state names
 * @param {string[]} dfaData.alphabet - Array of input symbols
 * @param {Object} dfaData.transitions - Transition function {state: {symbol: nextState}}
 * @param {string} dfaData.startState - The initial state
 * @param {string[]} dfaData.finalStates - Array of accepting states
 * @returns {Promise<Object>} The minimization result
 */
export const minimizeDFA = async (dfaData) => {
    const response = await api.post('/api/minimize', dfaData)
    return response.data
}

export default api
