# Database Setup Instructions

## PostgreSQL Database Configuration

This application requires a PostgreSQL database. Follow these steps to set up your database credentials.

## Step 1: Install PostgreSQL

If you don't have PostgreSQL installed:

- **Windows**: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql` or download from the official site
- **Linux**: `sudo apt-get install postgresql` (Ubuntu/Debian) or use your distribution's package manager

## Step 2: Create Database

1. Open your PostgreSQL client (psql, pgAdmin, or any SQL client)
2. Connect to PostgreSQL as a superuser
3. Run the following SQL command to create the database:

```sql
CREATE DATABASE fueleu_db;
```

## Step 3: Get Your Database Credentials

You'll need the following information:

- **DB_HOST**: Usually `localhost` for local development
- **DB_PORT**: Default is `5432`
- **DB_NAME**: `fueleu_db` (or the name you chose)
- **DB_USER**: Your PostgreSQL username (default is often `postgres`)
- **DB_PASSWORD**: Your PostgreSQL password

### How to Find Your Credentials:

1. **If you installed PostgreSQL yourself:**
   - You set the password during installation
   - The username is usually `postgres` by default
   - Host is `localhost` and port is `5432`

2. **If using a cloud database (AWS RDS, Heroku, etc.):**
   - Check your cloud provider's dashboard for connection details
   - They will provide host, port, username, and password

3. **If you forgot your password:**
   - **Windows**: You can reset it through pgAdmin or by editing `pg_hba.conf`
   - **macOS/Linux**: Use `sudo -u postgres psql` to access without password, then change it

## Step 4: Configure Backend

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
DB_USER=your_username
DB_PASSWORD=your_password

PORT=3001
NODE_ENV=development
```

**Important**: Replace `your_username` and `your_password` with your actual PostgreSQL credentials.

## Step 5: Run Migrations and Seed Data

After configuring your `.env` file:

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Run database migrations:
   ```bash
   npm run migrate
   ```

3. Seed the database with initial data:
   ```bash
   npm run seed
   ```

## Troubleshooting

### Connection Refused Error

- Make sure PostgreSQL is running: `pg_isready` or check service status
- Verify the port (default 5432) is correct
- Check if PostgreSQL is listening on the correct interface

### Authentication Failed

- Double-check your username and password in `.env`
- Verify the user has permissions to access the database
- For local development, you might need to modify `pg_hba.conf` to allow local connections

### Database Does Not Exist

- Make sure you created the database: `CREATE DATABASE fueleu_db;`
- Verify the database name in `.env` matches the created database

### Permission Denied

- Ensure your PostgreSQL user has CREATE and INSERT permissions
- You may need to grant privileges:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE fueleu_db TO your_username;
  ```

## Security Note

- **Never commit `.env` files to version control** (they're already in `.gitignore`)
- Use strong passwords for production databases
- Consider using environment variables or secret management services for production

## Quick Test

To verify your connection works, you can run:

```bash
cd backend
npm run migrate
```

If this completes without errors, your database connection is configured correctly!

