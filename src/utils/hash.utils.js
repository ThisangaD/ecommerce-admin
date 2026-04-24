/**
 * @file hash.utils.js
 * @description Utility functions for password hashing and verification using bcrypt.
 * Provides a consistent salt round configuration across the application.
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} plainText - The raw password to hash.
 * @returns {Promise<string>} The bcrypt hash string.
 */
export const hashPassword = (plainText) => bcrypt.hash(plainText, SALT_ROUNDS);

/**
 * Compares a plaintext password against a stored bcrypt hash.
 * @param {string} plainText - The raw password attempt.
 * @param {string} hash - The stored bcrypt hash.
 * @returns {Promise<boolean>} True if the password matches.
 */
export const comparePassword = (plainText, hash) => bcrypt.compare(plainText, hash);
