import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

import connectDb from './Utils/DB.js';
import {
  initializeSocket,
  getSocketStats,
  isUserOnline,
  getOnlineUsers,
  emitToUser,
  emitToConversation,
  sendNotification,
  shutdownSocket,
} from './Utils/socket.js';

// ─── Routes — Auth ───────────────────────────────────────────
import AuthUserRouter from './routes/Auth-UserRouter.js';

// Auto Payment Dectore  Controller or FUnction 


// ─── Routes — Client ─────────────────────────────────────────
import ClientProfileRoutes       from './routes/Users/Client/client-ProfileRoutes.js';
import JobUploadForClientRouter  from './routes/Users/Client/Job-Upload-forClient.Route.js';
import ClientJobAplicationRouter from './routes/Users/Client/Client-application.Route.js';
import ClientPortfolioRouter     from './routes/Users/Client/Client-Portfolio.Route.js';
import ClientEmployeeRouter      from './routes/Users/Client/employeeRoutesfor-Client.js';

// ─── Routes — Employee ───────────────────────────────────────
import EmployeeProfileRoutes        from './routes/Users/Employee/employee-ProfileRoutes.js';
import GetAllJobAndApplyForEmployee from './routes/Users/Employee/GetAllJob.Route.js';
import PortfolioRouter              from './routes/Users/Employee/PortFolio.Route.js';
import { employeeClientRouter }     from './routes/Users/Employee/employeeClient.Route.js';

// ─── Routes — Chat, Calls, Notifications ─────────────────────
import chatRoutes             from './routes/Users/Chat/chatRoutes.js';
import { CallRouter }         from './routes/Call-Route/Call.Route.js';

// NOtuficatuion
import { NotificationRouter } from './routes/Notification.Routes/NotificationRoute.js';


// EMployee NOtifications
import { EmployeeNotificationRouter } from './routes/Notification.Routes/Employee-Notification-Route/Employee-Notification-Route.js';

// ─── Routes — Admin ──────────────────────────────────────────

import AdminAuthRoutes from './Controller/Admin/Route/Admin.Auth.Router.js';
import EmployeeManagementRouter from './Controller/Admin/Route/Employee-Managemnet.route.js';
import { ClientNotificationRouter } from './routes/Notification.Routes/Client-Notification-Route/Client-Notification-Route.js';
import { RecomendationNotificationRouter } from './routes/Notification.Routes/Recomendation-Notification-Route/Recomendation-Notification-Route.js';
// import AllUserManagementRouter from './Controller/Admin/Routes/admin.AllUsermanagemen.Route.js';



// ✅ app.js — imports at the TOP of the file with all other imports

import Subscriptionrouter from './routes/Payment/subscriptionRoutes.js';

// ─── Routes — Dev ────────────────────────────────────────────

import backupConnection from './Config/backupDb.js';

// ─── Routes — Payment ────────────────────────────────────────


// ═════════════════════════════════════════════════════════════
// APP + SERVER
// ═════════════════════════════════════════════════════════════

const app    = express();
const PORT   = process.env.PORT || 5000;
const server = http.createServer(app);

const io = initializeSocket(server);
if (io) {
  console.log('✅ Socket.IO attached to HTTP server successfully');
} else {
  console.error('❌ Socket.IO FAILED to attach');
}

// ═════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════
// MIDDLEWARE — ORDER IS CRITICAL
// ═════════════════════════════════════════════════════════════

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006',
    'exp://10.26.205.107:8081',
    'https://www.nixvo.in',
    'https://nixvo.in',
    'http://10.26.205.107:8081',
    /^http:\/\/10\.26\.205\.\d+/,
  ],
  credentials:    true,
  exposedHeaders: ['x-new-access-token', 'x-new-refresh-token'],
}));

// ── 1️⃣ rawBody FIRST — webhook needs this before JSON parsing ──
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/payment/webhook') {
    let rawData = '';
    req.on('data', chunk => rawData += chunk);
    req.on('end', () => {
      // ✅ Handle Razorpay empty test ping
      if (!rawData || rawData === '' || rawData === '{}') {
        return res.status(200).json({ success: true, received: true });
      }
      req.rawBody = rawData;
      try {
        req.body = JSON.parse(rawData);
      } catch (e) {
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
});

// ── 2️⃣ Body parsing AFTER rawBody ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────


app.use('/api/v1/payment', Subscriptionrouter);




// ═════════════════════════════════════════════════════════════
// SYSTEM ROUTES
// ═════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.json({ success: true, message: '🚀 EditCraft API active', socket: getSocketStats() });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', uptime: process.uptime(), socket: getSocketStats() });
});

if (process.env.NODE_ENV === 'development') {
  app.get('/debug/socket', (req, res) => {
    const onlineUsers = getOnlineUsers();
    res.json({ success: true, stats: getSocketStats(), onlineUsers, onlineCount: onlineUsers.length });
  });

  app.get('/debug/socket/user/:userId', (req, res) => {
    const online = isUserOnline(req.params.userId);
    res.json({ success: true, userId: req.params.userId, online, status: online ? 'online' : 'offline' });
  });
}

// ═════════════════════════════════════════════════════════════
// API ROUTES
// ═════════════════════════════════════════════════════════════

// Auth
app.use('/api/v1/auth-user', AuthUserRouter);



// Client
app.use('/api/v1/client-profiledata',  ClientProfileRoutes);
app.use('/api/v1/jobs',                JobUploadForClientRouter);
app.use('/api/v1/client/applications', ClientJobAplicationRouter);
app.use('/api/v1/client/portfolio',    ClientPortfolioRouter);
app.use('/api/v1/client/employees',    ClientEmployeeRouter);

// Employee
app.use('/api/v1/employee-profiledata', EmployeeProfileRoutes);
app.use('/api/v1/employee/portfolio',   PortfolioRouter);
app.use('/api/v1/employee/client',      employeeClientRouter);
app.use('/api/v1/employee',             GetAllJobAndApplyForEmployee);

// Chat
app.use('/api/v1/chat', chatRoutes);
// Calls
app.use('/api/v1/user/calls', CallRouter);

// Notifications   ->  Dismental and Unused from now on Clossing Soon
app.use('/api/user/notifications', NotificationRouter);


// Client-Notification
app.use('/api/v1/client/notifications',ClientNotificationRouter);
// Employee-Notification
app.use('/api/v1/employee/notifications',EmployeeNotificationRouter);


// Recomendation - ROute
app.use('/api/both/recomendation',RecomendationNotificationRouter);

// Admin
app.use('/api/admin/auth',           AdminAuthRoutes);
app.use('/api/admin/employeeManagement', EmployeeManagementRouter);

// app.use('/api/admin/allusermanagement',AllUserManagementRouter)



// Test 
import Testrouter from './routes/Test.Routes.js';
import Certificaterouter from './routes/Certificate/CertificateRoute.js';
import UpdateRouter from './routes/AppVersion.Route.js';



// Dev only
if (process.env.NODE_ENV === 'development') {
  app.use('/test', Testrouter);
}



app.use('/api/v1/app-version', UpdateRouter);



// Certificate 

app.use('/api/v1/certificate', Certificaterouter);



// Payment

// app.use('/api/user/subscription', SubscriptionRouter);
// app.use('/api/user/escrow',       EscrowRouter);
// app.use('/api/user/transaction',  TransactionRouter);
// app.use('/api/user/withdrawal',   withdrawalRouter);
// app.use('/api/user/payment',      PaymentRouter);



// ═════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═════════════════════════════════════════════════════════════


app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error('❌ Express error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ═════════════════════════════════════════════════════════════
// START
// ═════════════════════════════════════════════════════════════

const startServer = async () => {
  try {
    await connectDb();
    

    server.listen(PORT, '0.0.0.0', () => {
      const stats = getSocketStats();
      console.log('\n╔══════════════════════════════════════════════╗');
      console.log(`║  🚀 Server running on http://localhost:${PORT}  ║`);
      console.log('╠══════════════════════════════════════════════╣');
      console.log(`║  🟢 Socket.IO initialized : ${stats.initialized}             ║`);
      console.log(`║  👥 Online users          : ${stats.onlineUsers}                     ║`);
      console.log(`║  🔌 Active connections    : ${stats.connections}                     ║`);
      console.log(`║  🏠 Active rooms          : ${stats.rooms}                     ║`);
      console.log('╚══════════════════════════════════════════════╝\n');

   
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};
// ═════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═════════════════════════════════════════════════════════════

const shutdown = async (signal) => {
  console.log(`\n🛑 ${signal} — shutting down…`);
  shutdownSocket();
  server.close(async () => {
    await mongoose.connection.close();
    await backupConnection.close();  // ← add this
    console.log('👋 Goodbye.');
    process.exit(0);
  });
  setTimeout(() => { console.error('❌ Shutdown timed out'); process.exit(1); }, 10_000);
};


process.on('SIGTERM',            () => shutdown('SIGTERM'));
process.on('SIGINT',             () => shutdown('SIGINT'));
process.on('uncaughtException',  (e) => { console.error('❌ Uncaught Exception:',  e); shutdown('UNCAUGHT EXCEPTION'); });
process.on('unhandledRejection', (e) => { console.error('❌ Unhandled Rejection:', e); shutdown('UNHANDLED REJECTION'); });



if (process.env.NODE_ENV !== 'development') {
  setInterval(async () => {
    try {
      await fetch('https://api.editcraft.co.in/health');
    } catch (_) {}
  }, 10 * 60 * 1000); // ping every 10 minutes
}

startServer();

export default app;