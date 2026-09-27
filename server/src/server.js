import 'dotenv/config';
import http from 'http';
import { app } from './app.js';
import { startDailyStreakScheduler } from './services/streak.service.js';

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = '0.0.0.0';
const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`🚀 Peer Club API running at http://${HOST}:${PORT}`);
  console.log(`📊 Health check at http://${HOST}:${PORT}/api/health`);
  startDailyStreakScheduler();
});

