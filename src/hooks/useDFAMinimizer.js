
import { useState, useCallback } from 'react'
import { minimizeDFA } from '../services/api'

/**

 * @returns {Object}
 */
export function useDFAMinimizer() {
    const [result, setResult] = useState(null)
    const [originalDFA, setOriginalDFA] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    /**
    
     * @param {Object} dfaData 
     * @returns {Object|null} 
     */
    const minimize = useCallback(async (dfaData) => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await minimizeDFA(dfaData)

            const minimizationResult = {
                reachableStates: data.graphData.reachableStates,
                partitionSteps: data.graphData.partitionSteps,
                minimizedDFA: data.minimizedDFA,
            }

            setOriginalDFA(dfaData)
            setResult(minimizationResult)
            setIsLoading(false)

            return minimizationResult
        } catch (err) {
            
            const message =
                err.response?.data?.messages?.join(' ') ||
                err.response?.data?.message ||
                err.message ||
                'Minimization failed'
            setError(message)
            setIsLoading(false)
            return null
        }
    }, [])

    const reset = useCallback(() => {
        setResult(null)
        setOriginalDFA(null)
        setError(null)
    }, [])

    return { minimize, result, originalDFA, isLoading, error, reset }
}

export default useDFAMinimizer
