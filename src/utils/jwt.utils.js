/**
 * @file jwt.utils.js
 * @description Utility functions for signing and verifying JSON Web Tokens.
 * Centralizes JWT configuration (secret, expiry) from environment variables.
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'fallback-secret';
const EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Signs a JWT token containing the given payload.
 * @param {object} payload - Data to encode (e.g., { id, email, role }).
 * @returns {string} Signed JWT string.
 */
export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRY });

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - The JWT string to verify.
 * @returns {object} Decoded payload if valid.
 * @throws {JsonWebTokenError} If the token is invalid or expired.
 */
export const verifyToken = (token) => jwt.verify(token, SECRET);
