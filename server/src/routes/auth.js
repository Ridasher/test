import express from 'express';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { id: 'admin', email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { id: 'admin', email, name: 'Admin User' } });
  }

  return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
});

router.get('/me', requireAuth, (req, res) => {
  // Returns the current user from the token
  res.json({ user: req.user });
});

export default router;
