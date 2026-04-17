# docker-node-app

![CI/CD Pipeline](https://github.com/pmaheshwari11/docker-node-app/actions/workflows/ci-cd.yml/badge.svg)

A production-ready Node.js REST API containerized with Docker,
orchestrated with Docker Compose, and deployed via GitHub Actions CI/CD.

## Stack
- Node.js + Express
- MongoDB
- Nginx (reverse proxy)
- Docker + Docker Compose
- GitHub Actions CI/CD

## Quick Start
```bash
docker compose up -d
curl http://localhost/api/health
```

## Architecture
```
Internet → Nginx:80 → Node.js:3000 → MongoDB:27017
```
