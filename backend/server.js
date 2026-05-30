
const express = require('express');
const cors = require('cors');
const dfaRoutes = require('./routes/dfaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api', dfaRoutes);


app.get('/', (req, res) => {
    res.json({
        message: 'DFA Minimization API is running',
        endpoints: {
            minimize: 'POST /api/minimize',
        },
    });
});


app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});


app.listen(PORT, () => {
    console.log(`✓ DFA Minimization API running on http://localhost:${PORT}`);
});
