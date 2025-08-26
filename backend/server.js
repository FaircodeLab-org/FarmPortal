// backend/server.js
const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const mongoose = require('mongoose');
const path     = require('path');

dotenv.config();

/* ───── Express app ───── */
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ───── MongoDB ───── */
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmportal')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

/* ───── Routes ───── */
const authRoutes      = require('./src/routes/authRoutes');
const requestRoutes   = require('./src/routes/requestRoutes');
const dataRoutes      = require('./src/routes/dataRoutes');      // supplier-side sync
const importerRoutes  = require('./src/routes/importerRoutes');  // new
const erpnextRoutes   = require('./src/routes/erpnextRoutes');
// const supplierRoutes   = require('./src/routes/supplierRoutes');  // new

app.use('/api/auth',      authRoutes);
app.use('/api/requests',  requestRoutes);
app.use('/api/data',      dataRoutes);       // supplier endpoints
app.use('/api/importer',  importerRoutes);   // customer / importer endpoints
app.use('/api/erpnext',   erpnextRoutes);
// app.use('/api',           supplierRoutes);   // supplier endpoints

/* test */
app.get('/api/test', (_req, res) =>
  res.json({ message: 'FarmPortal API is running!' })
);

/* error handler */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

/* ───── Start server ───── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));