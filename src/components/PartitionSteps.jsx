
function PartitionSteps({ steps }) {
    if (!steps || !steps.length) {
        return <p style={{ textAlign: 'center', color: '#6b7280', padding: 24 }}>No partition steps available.</p>
    }

    return (
        <div>
            {steps.map((step, i) => (
                <div key={i} className="step-card">
                    <div className="step-card-header">
                        <div className="step-number">{step.step}</div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
                            {step.description || `Partition Step ${step.step}`}
                        </span>
                    </div>
                    <div className="step-card-body">
                        {step.partitions.map((group, g) => (
                            <span key={g} className="group-badge">
                                <span className="group-label">G{g + 1}:</span>
                                {'{ ' + group.join(', ') + ' }'}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PartitionSteps
