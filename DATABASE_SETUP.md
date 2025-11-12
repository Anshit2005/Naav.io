# Database Setup Instructions

This guide covers setting up PostgreSQL using **Render.com** (free tier) or local PostgreSQL.

## 🚀 Option 1: Render.com PostgreSQL (Recommended - Free & Cloud-Based)

Render.com offers a free PostgreSQL database that's perfect for development and demos. No local installation required!

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up for a free account (GitHub login recommended)
3. Verify your email if required

### Step 2: Create PostgreSQL Database

1. **Navigate to Dashboard:**
   - After logging in, click **"New +"** button
   - Select **"PostgreSQL"**

2. **Configure Database:**
   - **Name**: `fueleu-db` (or any name you prefer)
   - **Database**: `fueleu_db` (or leave default)
   - **User**: Will be auto-generated (you can change it)
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **PostgreSQL Version**: `16` (or latest available)
   - **Plan**: Select **"Free"** (512 MB RAM, shared CPU)

3. **Create Database:**
   - Click **"Create Database"**
   - Wait 2-3 minutes for provisioning

### Step 3: Get Database Credentials

Once your database is created:

1. **Click on your database** in the Render dashboard
2. **Find the "Connections" section** - you'll see:
   - **Internal Database URL** (for Render services)
   - **External Database URL** (for local development)

3. **Copy the External Database URL** - it looks like:
   ```
   postgresql://username:password@hostname.onrender.com:5432/database_name
   ```

4. **Extract credentials from the URL:**
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
   - Example: `postgresql://fueleu_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com:5432/fueleu_db`
   
   From this example:
   - **DB_HOST**: `dpg-xxxxx-a.oregon-postgres.render.com`
   - **DB_PORT**: `5432`
   - **DB_NAME**: `fueleu_db` (last part after `/`)
   - **DB_USER**: `fueleu_user` (first part after `postgresql://`)
   - **DB_PASSWORD**: `abc123xyz` (between `://` and `@`)

5. **Alternative: View Individual Credentials:**
   - Scroll down to see individual fields:
     - **Hostname**: Your DB_HOST
     - **Port**: 5432
     - **Database**: Your DB_NAME
     - **Username**: Your DB_USER
     - **Password**: Click "Show" to reveal (copy this!)

### Step 4: Configure Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Open `backend/.env` and fill in your Render credentials:

```env
# Render.com PostgreSQL Configuration
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=fueleu_db
DB_USER=fueleu_user
DB_PASSWORD=your_actual_password_here
DB_SSL=true

PORT=3001
NODE_ENV=development
```

**Important**: 
- Replace all values with your actual Render credentials
- Set `DB_SSL=true` for Render (required for secure connections)

### Step 5: Run Migrations and Seed Data

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Run database migrations:
   ```bash
   npm run migrate
   ```
   
   **Expected output:**
   ```
   ✅ Database migration completed successfully
   ```

3. Seed the database with initial data:
   ```bash
   npm run seed
   ```
   
   **Expected output:**
   ```
   ✅ Database seeded successfully
   ```

### Step 6: Verify Connection

Test your connection by running:
```bash
npm run migrate
```

If successful, you're all set! 🎉

---

## 💻 Option 2: Local PostgreSQL

If you prefer to use a local PostgreSQL installation:

### Step 1: Install PostgreSQL

- **Windows**: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql` or download from the official site
- **Linux**: `sudo apt-get install postgresql` (Ubuntu/Debian)

### Step 2: Create Database

1. Open your PostgreSQL client (psql, pgAdmin, or any SQL client)
2. Connect to PostgreSQL as a superuser
3. Run the following SQL command:

```sql
CREATE DATABASE fueleu_db;
```

### Step 3: Get Your Database Credentials

- **DB_HOST**: `localhost`
- **DB_PORT**: `5432`
- **DB_NAME**: `fueleu_db`
- **DB_USER**: Your PostgreSQL username (default is often `postgres`)
- **DB_PASSWORD**: Your PostgreSQL password (set during installation)

### Step 4: Configure Backend

1. Navigate to the `backend` directory
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Open `backend/.env` and fill in your credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fueleu_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

PORT=3001
NODE_ENV=development
```

### Step 5: Run Migrations and Seed Data

Same as Step 5 in Render setup above.

---

## 🔍 Troubleshooting

### Render.com Specific Issues

#### "Connection timeout" or "Connection refused"
- **Solution**: Render free tier databases spin down after 90 days of inactivity. They auto-start on first connection (takes ~30 seconds)
- Wait a moment and try again, or ping the database first

#### "SSL required" error
- **Solution**: Make sure `DB_SSL=true` in your `.env` file
- Render requires SSL for all connections

#### "Authentication failed"
- **Solution**: Double-check your password in Render dashboard
- Passwords are case-sensitive
- Make sure you're using the **External Database URL** credentials, not Internal

#### "Database does not exist"
- **Solution**: The database name in Render is usually the same as your service name
- Check the database name in Render dashboard → Connections section

### General Issues

#### "Cannot connect to database"
- Verify your credentials are correct
- Check if database is running (for local) or active (for Render)
- Ensure firewall isn't blocking port 5432

#### "Permission denied"
- For Render: You should have full permissions automatically
- For local: Grant privileges:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE fueleu_db TO your_username;
  ```

---

## 🔐 Security Notes

- **Never commit `.env` files** to version control (already in `.gitignore`)
- **Render passwords**: Keep them secure, don't share publicly
- **Local passwords**: Use strong passwords for production
- For production deployments, use environment variables or secret management services

---

## 📊 Render.com Free Tier Limits

- **512 MB RAM**
- **Shared CPU**
- **90-day inactivity spin-down** (auto-starts on connection)
- **No credit card required**
- **Perfect for development and demos**

---

## ✅ Quick Test

To verify your connection works:

```bash
cd backend
npm run migrate
```

If this completes without errors, your database connection is configured correctly! 🎉

---

## 🆘 Need Help?

- **Render Support**: [Render Docs](https://render.com/docs)
- **PostgreSQL Docs**: [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Check console logs for detailed error messages
