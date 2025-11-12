import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoutesController } from '../../adapters/inbound/http/routesController';
import { ComplianceController } from '../../adapters/inbound/http/complianceController';
import { BankingController } from '../../adapters/inbound/http/bankingController';
import { PoolingController } from '../../adapters/inbound/http/poolingController';
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/PostgresComplianceRepository';
import { PostgresBankingRepository } from '../../adapters/outbound/postgres/PostgresBankingRepository';
import { PostgresPoolRepository } from '../../adapters/outbound/postgres/PostgresPoolRepository';
import { CompareRoutes } from '../../core/application/CompareRoutes';
import { CalculateComplianceBalance } from '../../core/application/CalculateComplianceBalance';
import { BankSurplus } from '../../core/application/BankSurplus';
import { ApplyBanked } from '../../core/application/ApplyBanked';
import { CreatePool } from '../../core/application/CreatePool';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize repositories
const routeRepository = new PostgresRouteRepository();
const complianceRepository = new PostgresComplianceRepository();
const bankingRepository = new PostgresBankingRepository();
const poolRepository = new PostgresPoolRepository();

// Initialize use cases
const compareRoutes = new CompareRoutes();
const calculateCB = new CalculateComplianceBalance();
const bankSurplus = new BankSurplus();
const applyBanked = new ApplyBanked();
const createPool = new CreatePool();

// Initialize controllers
const routesController = new RoutesController(routeRepository, compareRoutes);
const complianceController = new ComplianceController(
  complianceRepository,
  routeRepository,
  calculateCB
);
const bankingController = new BankingController(
  bankingRepository,
  complianceRepository,
  bankSurplus,
  applyBanked
);
const poolingController = new PoolingController(
  poolRepository,
  complianceRepository,
  createPool
);

// Routes
app.get('/routes', (req, res) => routesController.getAllRoutes(req, res));
app.post('/routes/:routeId/baseline', (req, res) =>
  routesController.setBaseline(req, res)
);
app.get('/routes/comparison', (req, res) =>
  routesController.getComparison(req, res)
);

// Compliance
app.get('/compliance/cb', (req, res) =>
  complianceController.getComplianceBalance(req, res)
);
app.get('/compliance/adjusted-cb', (req, res) =>
  complianceController.getAdjustedComplianceBalance(req, res)
);

// Banking
app.get('/banking/records', (req, res) => bankingController.getRecords(req, res));
app.post('/banking/bank', (req, res) => bankingController.bank(req, res));
app.post('/banking/apply', (req, res) => bankingController.apply(req, res));

// Pooling
app.post('/pools', (req, res) => poolingController.create(req, res));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

