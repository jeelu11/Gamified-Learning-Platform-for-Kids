const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const healthCheck = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);

  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

healthCheck.on('error', (err) => {
  console.error('Health check failed:', err);
  process.exit(1);
});

healthCheck.on('timeout', () => {
  console.error('Health check timeout');
  process.exit(1);
});

healthCheck.end();