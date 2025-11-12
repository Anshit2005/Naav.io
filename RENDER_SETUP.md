# Render.com PostgreSQL Setup - Step by Step Guide

This is a detailed step-by-step guide to set up a free PostgreSQL database on Render.com for this project.

## 📋 Prerequisites

- A GitHub account (recommended for Render signup)
- Or an email address for Render account

## 🚀 Step-by-Step Instructions

### Step 1: Sign Up for Render

1. Go to **https://render.com**
2. Click **"Get Started for Free"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"** (recommended) or use email
4. Authorize Render to access your GitHub (if using GitHub)
5. Complete the signup process

### Step 2: Create PostgreSQL Database

1. **After logging in**, you'll see the Render Dashboard
2. Click the **"New +"** button (top right or center of dashboard)
3. From the dropdown, select **"PostgreSQL"**

### Step 3: Configure Database Settings

You'll see a form with these fields:

1. **Name**: 
   - Enter: `fueleu-db` (or any name you like)
   - This is just for identification in Render dashboard

2. **Database**: 
   - Enter: `fueleu_db` (or leave default)
   - This is the actual database name

3. **User**: 
   - Can leave default or customize
   - Example: `fueleu_user`

4. **Region**: 
   - Choose closest to you:
     - `Oregon (US West)` - for US West Coast
     - `Ohio (US East)` - for US East Coast
     - `Frankfurt (EU)` - for Europe
     - `Singapore (Asia)` - for Asia

5. **PostgreSQL Version**: 
   - Select **16** (or latest available)

6. **Plan**: 
   - Select **"Free"** (this is the free tier)
   - Shows: "512 MB RAM, Shared CPU"

7. **Datadog API Key** (optional):
   - Leave empty for now

### Step 4: Create and Wait

1. Click **"Create PostgreSQL"** button
2. You'll see a loading screen
3. **Wait 2-3 minutes** for Render to provision your database
4. You'll see a green checkmark when it's ready

### Step 5: Get Your Database Credentials

Once your database is created:

1. **Click on your database name** in the dashboard (e.g., `fueleu-db`)

2. You'll see several sections. Look for **"Connections"** section

3. **You'll see two connection strings:**
   - **Internal Database URL**: For services running on Render (ignore for now)
   - **External Database URL**: For local development (this is what you need!)

4. **Copy the External Database URL** - it looks like:
   ```
   postgresql://username:password@hostname.onrender.com:5432/database_name
   ```

5. **Extract the credentials manually:**
   
   Example URL:
   ```
   postgresql://fueleu_user:MyP@ssw0rd123@dpg-abc123xyz-a.oregon-postgres.render.com:5432/fueleu_db
   ```
   
   Breaking it down:
   - **Protocol**: `postgresql://`
   - **Username**: `fueleu_user` (everything between `://` and `:`)
   - **Password**: `MyP@ssw0rd123` (everything between `:` and `@`)
   - **Host**: `dpg-abc123xyz-a.oregon-postgres.render.com` (everything between `@` and `:`)
   - **Port**: `5432` (after the second `:`)
   - **Database**: `fueleu_db` (everything after the last `/`)

6. **Alternative Method - View Individual Fields:**
   
   Scroll down in the database page to see individual credential fields:
   - **Hostname**: `dpg-abc123xyz-a.oregon-postgres.render.com` → This is your `DB_HOST`
   - **Port**: `5432` → This is your `DB_PORT`
   - **Database**: `fueleu_db` → This is your `DB_NAME`
   - **Username**: `fueleu_user` → This is your `DB_USER`
   - **Password**: Click the "Show" button to reveal → This is your `DB_PASSWORD`

### Step 6: Configure Your .env File

1. **Navigate to your project:**
   ```bash
   cd backend
   ```

2. **Create .env file:**
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```

3. **Open `backend/.env` in a text editor** and fill in your credentials:

```env
# Render.com PostgreSQL Configuration
DB_HOST=dpg-abc123xyz-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=fueleu_db
DB_USER=fueleu_user
DB_PASSWORD=MyP@ssw0rd123
DB_SSL=true

PORT=3001
NODE_ENV=development
```

**Replace with YOUR actual values from Step 5!**

### Step 7: Test the Connection

1. **Install dependencies** (if not done already):
   ```bash
   cd backend
   npm install
   ```

2. **Run migrations** to create tables:
   ```bash
   npm run migrate
   ```
   
   **Expected output:**
   ```
   ✅ Database migration completed successfully
   ```

3. **Seed the database** with initial data:
   ```bash
   npm run seed
   ```
   
   **Expected output:**
   ```
   ✅ Database seeded successfully
   ```

### Step 8: Verify Everything Works

1. **Start your backend server:**
   ```bash
   npm run dev
   ```

2. **You should see:**
   ```
   🚀 Server running on http://localhost:3001
   ```

3. **Test the API:**
   - Open browser: http://localhost:3001/health
   - Should see: `{"status":"ok","timestamp":"..."}`

4. **Test database connection:**
   - Open: http://localhost:3001/routes
   - Should see route data (if seeded successfully)

## 🎉 Success!

If all steps completed without errors, your Render PostgreSQL database is set up and connected!

## 📝 Important Notes

### Render Free Tier Behavior

- **Auto-sleep**: Free databases sleep after 90 days of inactivity
- **Auto-wake**: They automatically wake up on first connection (takes ~30 seconds)
- **Persistent**: Your data persists even when sleeping
- **No credit card**: Free tier doesn't require payment info

### Security

- **Never commit `.env` file** to Git (already in `.gitignore`)
- **Keep credentials secret** - don't share publicly
- **Use environment variables** in production deployments

### Troubleshooting

If you encounter issues:

1. **Check credentials** - Make sure all values in `.env` match Render dashboard
2. **Verify SSL** - Ensure `DB_SSL=true` for Render
3. **Wait for wake-up** - If database is sleeping, first connection takes ~30 seconds
4. **Check Render status** - Go to Render dashboard, ensure database shows "Available"

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## 📞 Need Help?

- Check the main [DATABASE_SETUP.md](./DATABASE_SETUP.md) for more troubleshooting
- Review Render's documentation for database-specific issues
- Check console error messages for detailed information

