import http from 'http';

const url = process.env.API_HEALTH_URL || 'http://localhost:5001/api/v1/health';
const maxAttempts = 30;
let attempts = 0;

console.log(`⏳ Waiting for API service at ${url}...`);

function checkService() {
  attempts++;
  http
    .get(url, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Service is healthy and ready!');
        process.exit(0);
      } else {
        retry();
      }
    })
    .on('error', () => {
      retry();
    });
}

function retry() {
  if (attempts >= maxAttempts) {
    console.error('❌ Service failed to become ready within timeout.');
    process.exit(1);
  }
  setTimeout(checkService, 1000);
}

checkService();
