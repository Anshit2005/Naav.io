# Naav.io — Fuel EU Maritime Compliance Platform

A full-stack compliance management system that helps maritime operators monitor, compare, and optimize ship emissions under the Fuel EU Maritime Regulation (EU 2023/1805).

## 🌊 Overview

Naav.io is a comprehensive platform designed to help shipping companies comply with the European Union's Fuel EU Maritime Regulation. The system enables operators to:

- **Monitor** route emissions and compliance balances
- **Compare** vessel performance against baseline targets
- **Optimize** compliance through banking and pooling mechanisms
- **Track** GHG intensity and ensure regulatory compliance

Built with modern web technologies and following clean architecture principles, Naav.io provides an intuitive interface for managing complex maritime compliance requirements.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters / Clean Architecture) principles, ensuring clean separation of concerns and maintainability:

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
- PostgreSQL 12+ (local) OR Render.com account (free cloud database)
- Git

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anshit2005/Naav.io.git
   cd Naav.io
   ```

2. **Set up the database:**
   - **Option 1 (Recommended)**: Use Render.com free PostgreSQL - See [RENDER_SETUP.md](./RENDER_SETUP.md) for step-by-step guide
   - **Option 2**: Use local PostgreSQL - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for instructions
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

### 🗺️ Routes Management
- View all routes with comprehensive filtering (vessel type, fuel type, year)
- Set baseline route for performance comparisons
- Display detailed route metrics: GHG intensity, fuel consumption, distance, total emissions
- Real-time route data management

### 📊 Route Comparison
- Compare routes against baseline performance
- Calculate percentage difference in GHG intensity
- Visualize emissions data with interactive bar charts
- Compliance status indicators (✅/❌) based on target intensity (89.3368 gCO₂e/MJ)
- Target-based compliance checking

### 💰 Banking (Article 20)
- Calculate Compliance Balance (CB) for vessels
- Bank positive CB for future use
- Apply banked surplus to current deficits
- View comprehensive banking records and KPIs
- Track banking transactions over time

### 🤝 Pooling (Article 21)
- Create compliance pools with multiple ships
- Validate pool rules:
  - Pool sum must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative
- Greedy allocation algorithm for optimal CB distribution
- Real-time pool validation and member management

## 🧮 Core Formulas

The platform implements the official Fuel EU Maritime calculation methodologies:

- **Target Intensity (2025)**: 89.3368 gCO₂e/MJ (2% below 91.16)
- **Energy in Scope**: `fuelConsumption × 41,000 MJ/t`
- **Compliance Balance**: `(Target − Actual) × Energy in scope`
  - Positive CB = Surplus (can be banked)
  - Negative CB = Deficit (requires offsetting)

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
├── RENDER_SETUP.md            # Render.com PostgreSQL setup guide
├── DATABASE_SETUP.md          # Database configuration guide
├── QUICK_START.md             # Quick setup guide
├── AGENT_WORKFLOW.md          # AI agent usage documentation
├── REFLECTION.md              # Reflection on development process
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

### Health Check
- `GET /health` - Server health status

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Architecture**: Hexagonal Architecture (Ports & Adapters)
- **Validation**: Zod

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts (for data visualization)
- **HTTP Client**: Axios
- **Architecture**: Hexagonal Architecture

## 📝 Environment Variables

### Backend (.env)

**For Render.com:**
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

**For Local PostgreSQL:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fueleu_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_SSL=false
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running (local) or active (Render)
- Check `.env` file has correct credentials
- Ensure database `fueleu_db` exists
- See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed help

### Port Already in Use
- Backend default: 3001 (change in `backend/.env`)
- Frontend default: 3000 (change in `frontend/vite.config.ts`)

### CORS Errors
- Ensure backend is running on port 3001
- Check `frontend/vite.config.ts` proxy configuration

### Render Database Issues
- Free tier databases sleep after 90 days - they auto-wake on first connection (~30 seconds)
- Ensure `DB_SSL=true` for Render connections
- See [RENDER_SETUP.md](./RENDER_SETUP.md) for troubleshooting

## 📚 Documentation

- [RENDER_SETUP.md](./RENDER_SETUP.md) - **Step-by-step Render.com PostgreSQL setup** (Recommended)
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration guide (Render + Local options)
- [QUICK_START.md](./QUICK_START.md) - Quick setup guide
- [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) - AI agent usage documentation
- [REFLECTION.md](./REFLECTION.md) - Reflection on development process

## 📄 License

ISC

## 👤 Author

Naav.io - Fuel EU Maritime Compliance Platform

## 🔗 Repository

[GitHub Repository](https://github.com/Anshit2005/Naav.io)

---

**Built with ❤️ for maritime compliance management**
