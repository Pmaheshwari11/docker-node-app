const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');

// ── User Model ────────────────────────────────
const userSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    role:      { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ── Health Check ──────────────────────────────
router.get('/health', (req, res) => {
    const dbState = ['disconnected','connected','connecting','disconnecting'];

    res.json({
        status:      'healthy',
        timestamp:   new Date().toISOString(),
        uptime:      `${Math.floor(process.uptime())}s`,
        environment: process.env.NODE_ENV,
        database:    dbState[mongoose.connection.readyState],
        container: {
            hostname: os.hostname(),
            memory: {
                total: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
                free:  `${Math.round(os.freemem() / 1024 / 1024)}MB`
            }
        }
    });
});

// ── API Info ──────────────────────────────────
router.get('/', (req, res) => {
    res.json({
        app:     process.env.APP_NAME,
        version: '2.0.0',
        message: 'Node.js + MongoDB + Nginx running in Docker Compose!'
    });
});

// ── GET /users ────────────────────────────────
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ count: users.length, users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── POST /users ───────────────────────────────
router.post('/users', async (req, res) => {
    const { name, role } = req.body;

    if (!name || !role) {
        return res.status(400).json({ error: 'name and role are required' });
    }

    try {
        const user = await User.create({ name, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── DELETE /users/:id ─────────────────────────
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ping endpoint — useful for load balancer health checks
router.get('/ping', (req, res) => {
    res.json({
        pong: true,
        timestamp: Date.now()
    });
});

router.get('/', (req, res) => {
    res.json({
        app:     process.env.APP_NAME,
        version: '3.0.0',                    // bump version
        message: 'Deployed automatically via GitHub Actions CI/CD! 🚀',
        deployedAt: new Date().toISOString(), // add timestamp
        server: os.hostname()
    });
});

module.exports = router;
// deployed Sat Apr 18 12:26:16 PM IST 2026
