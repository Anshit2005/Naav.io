# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Render.com account (for free PostgreSQL) OR local PostgreSQL installed
- [ ] Database credentials (from Render dashboard or local setup)

## Step-by-Step Setup

### 1. Database Setup (10 minutes)

#### Option A: Render.com (Recommended - Free Cloud Database)

1. **Create Render account:**
   - Go to [render.com](https://render.com) and sign up (free)
   - Use GitHub login for easiest setup

2. **Create PostgreSQL database:**
   - Click "New +" → "PostgreSQL"
   - Name: `fueleu-db`
   - Database: `fueleu_db`
   - Region: Choose closest to you
   - Plan: **Free**
   - Click "Create PostgreSQL"
   - Wait 2-3 minutes for provisioning

3. **Get credentials from Render dashboard:**
   - Click on your database
   - Go to "Connections" section
   - Copy **External Database URL** or note individual fields:
     - Hostname (DB_HOST)
     - Port (5432)
     - Database (DB_NAME)
     - Username (DB_USER)
     - Password (click "Show" to reveal)

4. **Configure backend:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `backend/.env` with Render credentials:
   ```env
   DB_HOST=your-hostname.onrender.com
   DB_PORT=5432
   DB_NAME=fueleu_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_SSL=true
   PORT=3001
   NODE_ENV=development
   ```

   **See [RENDER_SETUP.md](./RENDER_SETUP.md) for detailed step-by-step guide!**

#### Option B: Local PostgreSQL

1. **Install PostgreSQL** (if not installed)
2. **Create database:**
   ```sql
   CREATE DATABASE fueleu_db;
   ```
3. **Configure backend** with local credentials (see [DATABASE_SETUP.md](./DATABASE_SETUP.md))

### 2. Backend Setup (3 minutes)

```bash
cd backend
npm install
npm run migrate    # Creates database tables
npm run seed       # Loads initial route data
npm run dev        # Starts server on http://localhost:3001
```

**Expected output:**
```
🚀 Server running on http://localhost:3001
```

### 3. Frontend Setup (2 minutes)

Open a **new terminal window**:

```bash
cd frontend
npm install
npm run dev        # Starts app on http://localhost:3000
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### 4. Access the Application

Open your browser and navigate to: **http://localhost:3000**

You should see the Fuel EU Maritime Compliance Dashboard with 4 tabs:
- Routes
- Compare
- Banking
- Pooling

## Troubleshooting

### "Cannot connect to database"
- Verify PostgreSQL is running: `pg_isready` or check service status
- Double-check credentials in `backend/.env`
- Ensure database `fueleu_db` exists

### "Port 3001 already in use"
- Change `PORT` in `backend/.env` to another port (e.g., 3002)
- Update `frontend/vite.config.ts` proxy target to match

### "Port 3000 already in use"
- Change port in `frontend/vite.config.ts`:
  ```ts
  server: {
    port: 3001,  // Change to available port
  }
  ```

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check `frontend/vite.config.ts` proxy configuration
- Verify CORS is enabled in backend (it is by default)

## Next Steps

1. **Explore Routes Tab**: View routes and set a baseline
2. **Use Compare Tab**: Compare routes against baseline
3. **Try Banking Tab**: 
   - First, calculate CB for a route (e.g., R001, year 2024)
   - Then bank the surplus
   - Apply banked amount to a deficit
4. **Test Pooling Tab**:
   - Select multiple ships
   - Create a compliance pool

## Need Help?

- See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed database configuration
- See [README.md](./README.md) for full documentation
- Check console logs for error messages

## Common Commands

```bash
# Backend
cd backend
npm run dev        # Development server
npm run build      # Build for production
npm run migrate    # Run database migrations
npm run seed       # Seed initial data

# Frontend
cd frontend
npm run dev        # Development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Database Credentials Location

Your database credentials are stored in:
- **File**: `backend/.env`
- **Template**: `backend/.env.example`

**Important**: Never commit `.env` to version control (it's in `.gitignore`)

