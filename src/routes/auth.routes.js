/**
 * @file auth.routes.js
 * @description REST API authentication routes.
 * Provides the POST /api/login endpoint for user authentication
 * and JWT token generation.
 */

import { Router } from 'express';
import { User } from '../models/index.js';
import { comparePassword } from '../utils/hash.utils.js';
import { signToken } from '../utils/jwt.utils.js';

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

export default router;
