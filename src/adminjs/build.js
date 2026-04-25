/**
 * @file build.js
 * @description Script to bundle AdminJS components for production.
 */

import AdminJS from 'adminjs';
import * as AdminJSSequelize from '@adminjs/sequelize';
import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../../');

AdminJS.registerAdapter(AdminJSSequelize);

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add('Dashboard', path.join(__dirname, './components/Dashboard.jsx')),
  Settings: componentLoader.add('Settings', path.join(__dirname, './components/Settings.jsx')),
};

componentLoader.override('Login', path.join(__dirname, './components/Login.jsx'));

const adminOptions = {
  resources: [], // Resources are not strictly needed for bundling components
  componentLoader,
  rootPath: '/admin',
};

const build = async () => {
  const bundlePath = path.join(projectRoot, '.adminjs');
  
  if (fs.existsSync(bundlePath)) {
    console.log('Cleaning old AdminJS assets...');
    fs.rmSync(bundlePath, { recursive: true, force: true });
  }

  console.log('Building fresh AdminJS assets for production...');
  const admin = new AdminJS(adminOptions);
  // This will bundle all components registered in componentLoader
  await admin.initialize();
  console.log('AdminJS assets built successfully!');
};

build().catch((err) => {
  console.error('Error building AdminJS assets:', err);
  process.exit(1);
});
