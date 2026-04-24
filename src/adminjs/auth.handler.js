import { User } from '../models/index.js';
import { comparePassword } from '../utils/hash.utils.js';

export const adminAuthenticate = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('[AdminJS] Authentication error:', error);
    return null;
  }
};
