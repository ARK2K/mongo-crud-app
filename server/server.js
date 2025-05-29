const express = require('express');
const cors = require('cors');
const app = express();
const mongoRoutes = require('./routes/mongoRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', mongoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));