import { Router } from 'express';
import { User } from '../models/index.js';
import { comparePassword } from '../utils/hash.utils.js';
import { signToken } from '../utils/jwt.utils.js';

const router = Router();

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
