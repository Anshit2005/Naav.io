# Fuel EU Maritime Compliance Platform

A full-stack application for managing Fuel EU Maritime compliance, including route management, compliance balance calculation, banking, and pooling operations.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters / Clean Architecture) principles:

### Backend Structure

```
backend/
  src/
    core/              # Business logic (framework-independent)
      domain/         # Domain entities
      application/    # Use cases
      ports/          # Interfaces (inbound/outbound)
    adapters/
      inbound/http/   # HTTP controllers (Express)
      outbound/postgres/  # PostgreSQL repositories
    infrastructure/
      db/             # Database connection, migrations, seeds
      server/         # Express server setup
```

### Frontend Structure

```
frontend/
  src/
    core/             # Business logic (framework-independent)
      domain/         # Domain entities
      ports/          # Interfaces (API client)
    adapters/
      ui/             # React components
      infrastructure/ # API client implementation (Axios)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Setup Instructions

1. **Clone the repository** (or navigate to the project directory)

2. **Set up the database:**
   - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions
   - Create a PostgreSQL database named `fueleu_db`
   - Configure your database credentials in `backend/.env`

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run migrate    # Create database tables
   npm run seed       # Load initial data
   npm run dev        # Start development server (port 3001)
   ```

4. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev        # Start development server (port 3000)
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📋 Features

### Routes Tab
- View all routes with filtering (vessel type, fuel type, year)
- Set baseline route for comparisons
- Display route details: GHG intensity, fuel consumption, distance, emissions

### Compare Tab
- Compare routes against baseline
- Calculate percentage difference
- Visualize GHG intensity with bar charts
- Compliance status (✅/❌) based on target intensity (89.3368 gCO₂e/MJ)

### Banking Tab (Article 20)
- Calculate Compliance Balance (CB)
- Bank positive CB for future use
- Apply banked surplus to current deficits
- View banking records and KPIs

### Pooling Tab (Article 21)
- Create compliance pools with multiple ships
- Validate pool rules:
  - Pool sum must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative
- Greedy allocation algorithm for CB distribution

## 🧮 Core Formulas

- **Target Intensity (2025)**: 89.3368 gCO₂e/MJ (2% below 91.16)
- **Energy in Scope**: `fuelConsumption × 41,000 MJ/t`
- **Compliance Balance**: `(Target − Actual) × Energy in scope`
  - Positive CB = Surplus
  - Negative CB = Deficit

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── core/              # Domain & use cases
│   │   ├── adapters/          # HTTP & database adapters
│   │   └── infrastructure/    # Server & DB setup
│   ├── package.json
│   └── .env                   # Database credentials (create from .env.example)
│
├── frontend/
│   ├── src/
│   │   ├── core/              # Domain & ports
│   │   └── adapters/          # React components & API client
│   └── package.json
│
├── DATABASE_SETUP.md          # Database configuration guide
├── AGENT_WORKFLOW.md          # AI agent usage documentation
├── REFLECTION.md              # Reflection on AI agent usage
└── README.md                  # This file
```

## 🔌 API Endpoints

### Routes
- `GET /routes` - Get all routes
- `POST /routes/:routeId/baseline` - Set baseline route
- `GET /routes/comparison` - Get route comparisons

### Compliance
- `GET /compliance/cb?shipId&year` - Calculate/get compliance balance
- `GET /compliance/adjusted-cb?shipId&year` - Get adjusted CB (after banking)

### Banking
- `GET /banking/records?shipId&year` - Get banking records
- `POST /banking/bank` - Bank positive CB
- `POST /banking/apply` - Apply banked surplus

### Pooling
- `POST /pools` - Create compliance pool

## 🛠️ Technology Stack

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Hexagonal Architecture

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Recharts (for data visualization)
- Axios

## 📝 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fueleu_db
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `.env` file has correct credentials
- Ensure database `fueleu_db` exists
- See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed help

### Port Already in Use
- Backend default: 3001 (change in `backend/.env`)
- Frontend default: 3000 (change in `frontend/vite.config.ts`)

### CORS Errors
- Ensure backend is running on port 3001
- Check `frontend/vite.config.ts` proxy configuration

## 📚 Documentation

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration guide
- [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) - AI agent usage documentation
- [REFLECTION.md](./REFLECTION.md) - Reflection on development process

## 📄 License

ISC

## 👤 Author

Full-Stack Developer Assignment - Fuel EU Maritime Compliance Platform

