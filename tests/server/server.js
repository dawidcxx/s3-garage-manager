import { createServer } from 'node:http';
import { CLUSTER_STATUS_RESPONSE, HEALTH_RESPONSE } from './responseFixtures.js';
import { gracefulShutdown } from './gracefulShutdown.js';

const FIXTURES = {
  GET: {
    '/health': HEALTH_RESPONSE,
    '/status': CLUSTER_STATUS_RESPONSE,

    // Non fixture related
    '/': '',
    '/favicon.ico': '',
  },
  POST: {},
  DELETE: {},
};

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  console.log('Incoming request:', req.method, req.url);

  if (Object.keys(FIXTURES).includes(req.method)) {
    const data = requireNotNull(FIXTURES['GET'][req.url.trim()], `#FIXTURES['GET'][req.url]. Missing test fixture?`);
    res.end(JSON.stringify(data, null, 2));
    return;
  } else if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    res.end();
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`GarageMockAPIServer is running @ PORT='${PORT}'`);
});

gracefulShutdown(server).install();

function requireNotNull(value, msg) {
  if (value === null || value === undefined) {
    throw new Error(`requireNotNull check failed: '${msg}'`);
  }
  return value;
}
