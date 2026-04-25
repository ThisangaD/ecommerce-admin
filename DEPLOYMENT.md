# Deployment Guide (Railway)

This guide provides step-by-step instructions for deploying the **SHOP ADMIN** dashboard to [Railway](https://railway.app/).

## Prerequisites
- A Railway account.
- This repository pushed to your GitHub account.

## Step 1: Create a Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard).
2. Click **+ New Project**.
3. Select **Deploy from GitHub repo** and choose your repository.

## Step 2: Add a PostgreSQL Database
1. In your Railway project, click **+ Add Service**.
2. Select **Database** -> **Add PostgreSQL**.
3. Railway will automatically provision a database and provide a `DATABASE_URL` environment variable to your application service.

## Step 3: Configure Environment Variables
1. Go to the **Variables** tab of your application service.
2. Ensure the following variables are set:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: A long, random string (e.g., `your-super-secret-jwt-key`)
   - `SESSION_SECRET`: A long, random string (e.g., `your-adminjs-session-secret`)
   - `DATABASE_URL`: (Automatically provided by Railway if linked to the Postgres service)
   - `PORT`: (Automatically provided by Railway)

## Step 4: Database Seeding (Optional)
The application uses `sequelize.sync()` which will automatically create the necessary tables on the first run.
If you want to populate the database with initial data (Admin user, categories, products), you can run the seed script once after the first deployment.

You can do this via the Railway CLI or by temporarily changing the start command in Railway to:
`npm run seed && npm start`

**Note:** Don't forget to change it back to `npm start` after the seeding is successful.

## Step 5: Verification
1. Once the build and deployment are finished, Railway will provide a URL (e.g., `https://your-app.up.railway.app`).
2. Visit the URL.
3. Access the admin dashboard at `/admin`.

---

### Important Notes
- **SSL**: The application is configured to require SSL for database connections in production, which is a requirement for Railway's external database access.
- **AdminJS Bundling**: We have added a `build` script in `package.json` that bundles AdminJS components during the Railway build process for optimal performance.
