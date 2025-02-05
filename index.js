//mongodb+srv://db:<db_password>@cluster0.xz7mt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userSchema = require('./models/User');



dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
