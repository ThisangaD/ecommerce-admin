/**
 * @file auth.routes.js
 * @description REST API authentication routes.
 * Provides the POST /api/login endpoint for user authentication
 * and JWT token generation.
 */

import { Router } from 'express';
import { User, Setting } from '../models/index.js';
import { comparePassword } from '../utils/hash.utils.js';
import { signToken, verifyToken } from '../utils/jwt.utils.js';

const router = Router();

/**
 * POST /api/login
 * Authenticates a user and returns a signed JWT token.
 *
 * @body {string} email    - User's email address
 * @body {string} password - User's plaintext password
 *
 * @returns {200} { token, user: { id, name, email, role } }
 * @returns {400} If email or password is missing
 * @returns {401} If credentials are invalid
 * @returns {500} On internal server error
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * Middleware to verify access.
 * Supports both JWT (for external calls) and Session (for AdminJS dashboard).
 */
export const requireAdmin = (req, res, next) => {
  // 1. Check for JWT in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      if (decoded.role === 'admin') {
        req.user = decoded;
        return next();
      }
      return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
  }

  // 2. Fallback: Check for AdminJS session (for calls from custom dashboard components)
  // AdminJS stores the user in req.session.adminUser in buildAuthenticatedRouter
  const sessionUser = req.session?.adminUser;
  if (sessionUser && sessionUser.role === 'admin') {
    req.user = sessionUser;
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
};

/**
 * Middleware to verify any authenticated user (admin or regular user).
 */
export const requireAuth = (req, res, next) => {
  // 1. JWT Check
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
  }

  // 2. Session Check
  const sessionUser = req.session?.adminUser;
  if (sessionUser) {
    req.user = sessionUser;
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
};

// GET /api/settings — fetch all settings (admin only)
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await Setting.findAll({ order: [['key', 'ASC']] });
    res.json(settings);
  } catch (error) {
    console.error('[Settings] GET error:', error);
    res.status(500).json({ message: 'Failed to fetch settings.' });
  }
});

// PUT /api/settings/:key — update a single setting value (admin only)
router.put('/settings/:key', requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await Setting.findOne({ where: { key } });
    if (!setting) {
      return res.status(404).json({ message: `Setting '${key}' not found.` });
    }

    await setting.update({ value });
    res.json({ message: 'Setting updated successfully.', setting });
  } catch (error) {
    console.error('[Settings] PUT error:', error);
    res.status(500).json({ message: 'Failed to update setting.' });
  }
});

export default router;
