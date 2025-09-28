# Unified Smart Facility Management Platform (USFMP)

A production-ready platform integrating IoT sensor data, secure access control, and IT infrastructure monitoring into a unified dashboard.

## Stack
- **Backend:** Python FastAPI
- **Frontend:** React + TailwindCSS + shadcn/ui
- **Database:** PostgreSQL + TimescaleDB
- **IoT Integration:** MQTT & REST
- **Auth:** JWT (Admin, Security, Facility Manager)
- **Containerization:** Docker + docker-compose

## Features
- Access Control (Smart V-Pass)
- Climate Monitoring (Smart Airsenz)
- IT Infra Monitoring (IT Managed Services)
- Analytics & Reporting (PDF, charts)

## Quick Start

1. Clone the repo
2. Run `docker-compose up --build`
3. Access frontend at `http://localhost:3000`, backend at `http://localhost:8000`

## Seed Data & Demo Scripts

- **Seed the database:**
  ```bash
  docker-compose exec backend python /app/infra/seed_db.py
  ```
- **Run fake IoT data generator:**
  ```bash
  docker-compose exec backend python /app/infra/fake_iot_data.py
  ```

## Development
- Backend: `cd backend && uvicorn main:app --reload`
- Frontend: `cd frontend && yarn dev`

---

**Detailed module docs and usage instructions coming soon.**
