const request = require('supertest');
const express = require('express');

// Create a minimal test app (no DB needed)
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.get('/api/users', (req, res) => {
    res.json({ count: 0, users: [] });
});

app.post('/api/users', (req, res) => {
    const { name, role } = req.body;
    if (!name || !role) {
        return res.status(400).json({ error: 'name and role are required' });
    }
    res.status(201).json({ id: 1, name, role });
});

// Tests
describe('API Tests', () => {

    test('GET /api/health returns healthy', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('healthy');
    });

    test('GET /api/users returns array', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.users)).toBe(true);
    });

    test('POST /api/users creates user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Test User', role: 'DevOps' });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Test User');
    });

    test('POST /api/users rejects missing fields', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'No Role' });
        expect(res.statusCode).toBe(400);
    });

});
