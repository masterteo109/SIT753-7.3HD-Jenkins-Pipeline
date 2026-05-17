## Main Features

- Versioned REST API: `/api/v1`
- Student CRUD API
- Course CRUD API
- API key protection for write operations
- Request validation with `express-validator`
- Security headers with `helmet`
- Rate limiting
- Central error handling
- Request ID middleware
- Persistent JSON data store
- Winston structured logging
- Health checks:
  - `/health/live`
  - `/health/ready`
- Prometheus metrics:
  - `/metrics`
- Browser dashboard:
  - `/view`
- Jest + Supertest automated tests
- Dockerfile and Docker Compose support
- Prometheus monitoring config

## Install

```bash
npm install
```

## Run Locally

Create a `.env` file from `.env.example`, or just run with defaults:

```bash
npm start
```

Open:

```text
http://localhost:3000/view
http://localhost:3000/health/ready
http://localhost:3000/api/v1/students
http://localhost:3000/metrics
```

## Run Tests

```bash
npm test
```

## Build Check

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## API Key

Write operations require this header:

```text
X-API-Key: dev-api-key
```

Example PowerShell request:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/v1/students" `
  -Method Post `
  -Headers @{"X-API-Key"="dev-api-key"} `
  -ContentType "application/json" `
  -Body '{"name":"Lan Nguyen","email":"lan.nguyen@example.com","courseCode":"SIT753","status":"active"}'
```

## Docker

Build:

```bash
docker build -t sit753-student-platform .
```

Run on host port 8081:

```bash
docker run -d -p 8081:3000 --name sit753-student-platform sit753-student-platform
```

Open:

```text
http://localhost:8081/view
```

Stop:

```bash
docker stop sit753-student-platform
docker rm sit753-student-platform
```

## Docker Compose with Prometheus

```bash
docker compose up -d --build
```

Open:

```text
http://localhost:8081/view
http://localhost:9090
```

## Suggested Project Description for Report

This project is a production-like Student Management Platform built with Node.js and Express. It provides versioned REST APIs for managing students and courses, includes API key protection for write operations, validates request data, uses structured logging, exposes health check endpoints, and provides Prometheus-compatible metrics. The project is suitable for a full Jenkins DevOps pipeline because it supports automated build checks, unit/API tests, code quality analysis, security scanning, Docker-based deployment, release versioning, and monitoring.
