/**
 * @file auth.handler.js
 * @description AdminJS authentication handler.
 * Validates user credentials and returns the user object for AdminJS session.
 * Returning null denies access to the admin panel.
 */

import { User } from '../models/index.js';
import { comparePassword } from '../utils/hash.utils.js';

/**
 * Called by AdminJS on every login attempt via the /admin/login form.
 * @param {string} email    - Email entered in the login form.
 * @param {string} password - Password entered in the login form.
 * @returns {Promise<object|null>} User data object or null if unauthorized.
 */
export const adminAuthenticate = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return null;

    // Return a plain object — AdminJS stores this in session
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
