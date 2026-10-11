# Deployment Guide

## Production Build
```bash
# Build contracts, api, and web applications
pnpm build
```

## Docker Deployment
```bash
# Start all containers using docker compose
cd infra
docker compose up --build -d
```
- Web: `http://localhost:3000`
- API: `http://localhost:5000/api/v1`
- MongoDB: `localhost:27017`
