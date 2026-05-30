
import { useNavigate } from 'react-router-dom'
import DFAForm from '../components/DFAForm'

function InputDFA({ dfaMinimizer }) {
    const navigate = useNavigate()
    const { minimize, isLoading, error } = dfaMinimizer


    const handleSubmit = async (dfaData) => {
        const result = await minimize(dfaData)
        if (result) {
            navigate('/result')
        }
    }

    return (
        <div className="container-sm" style={{ paddingTop: 32, paddingBottom: 32 }}>
            <div className="page-header-sm">
                <h1>Input DFA</h1>
                <p>Define your Deterministic Finite Automaton below, or load a sample to get started.</p>
            </div>


            {error && (
                <div className="error-box">
                    <strong>Error: </strong>{error}
                </div>
            )}

            <DFAForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    )
}

export default InputDFA
