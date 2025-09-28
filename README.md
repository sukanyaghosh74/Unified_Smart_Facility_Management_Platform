# Unified Smart Facility Management Platform (USFMP)

## Table of contents

1. [Project overview](#project-overview)
2. [Repository layout](#repository-layout)
3. [Architecture & tech stack](#architecture--tech-stack)
4. [Prerequisites](#prerequisites)
5. [Environment variables](#environment-variables)
6. [Quick start (Docker)](#quick-start-docker)
7. [Local development (backend & frontend)](#local-development)
8. [Database & TimescaleDB notes](#database--timescaledb-notes)
9. [Seeding demo data & fake IoT generator](#seeding-demo-data--fake-iot-generator)
10. [Key backend routes & example requests](#key-backend-routes--example-requests)
11. [Frontend structure & components](#frontend-structure--components)
12. [Authentication & roles](#authentication--roles)
13. [Anomaly detection & alerts (design)](#anomaly-detection--alerts)
14. [Generating reports (PDFs)](#generating-reports-pdfs)
15. [Docker compose & deployment hints](#docker-compose--deployment-hints)
16. [Testing strategy](#testing-strategy)
17. [Troubleshooting & common issues](#troubleshooting--common-issues)
18. [How to contribute](#how-to-contribute)
19. [Appendix: useful snippets](#appendix-useful-snippets)

---

## Project overview

USFMP is a unified platform that combines:

* **Access control** (visitor passes, QR codes, entry logs) — inspired by Smart V-Pass
* **Climate monitoring** (CO₂, temperature, humidity, AQI) — inspired by Smart Airsenz
* **IT infrastructure monitoring** (server/VM metrics) — aligns with IT managed services

The goal: provide a single dashboard for facility managers to monitor people, environment, and infrastructure.

---

## Repository layout

```
/ (repo root)
├─ backend/           # FastAPI backend
├─ frontend/          # React + Tailwind + shadcn/ui
├─ infra/             # scripts: seeding, fake IoT generator, migrations helpers
├─ docker-compose.yml
└─ README.md
```

Note: The repository contains a working `docker-compose.yml` that orchestrates the stack (frontend, backend, postgres/timescaledb, mqtt broker if present).

---

## Architecture & tech stack

* **Backend:** Python + FastAPI (uvicorn)
* **Frontend:** React + TailwindCSS + shadcn/ui components
* **DB:** PostgreSQL with TimescaleDB extension for time-series sensor data
* **Messaging / IoT:** MQTT for live sensor ingestion + REST ingestion endpoints
* **Auth:** JWT-based auth with roles: `admin`, `security`, `facility_manager`
* **Containerization:** Docker + docker-compose
* **Charts:** Recharts (frontend)
* **Anomaly detection:** lightweight ML (isolation forest / simple z-score) on time-series

---

## Prerequisites

* Docker & docker-compose (recommended)
* Node.js (for frontend local dev) — v16+
* Python 3.10+ (for backend local dev)
* `yarn` or `npm` for frontend package management

---

## Environment variables

Create a `.env` file (or use docker-compose env) for the backend. Example `.env`:

```
# backend/.env
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=usfmp
POSTGRES_USER=usfmp_admin
POSTGRES_PASSWORD=supersecretpassword
JWT_SECRET=replace_with_a_strong_secret
MQTT_BROKER_HOST=mqtt
MQTT_BROKER_PORT=1883
TIMESCALEDB_EXTENSION=true
```

Frontend env (if needed) e.g. `frontend/.env.local`:

```
VITE_API_BASE=http://localhost:8000/api
VITE_SOCKET_URL=ws://localhost:8000/ws
```

---

## Quick Start (Docker)

Run everything with Docker Compose (preferred for demos):

```bash
# from repo root
docker-compose up --build
```

After containers are up:

* Frontend: `http://localhost:3000`
* Backend API docs (FastAPI): `http://localhost:8000/docs`

If you need to seed the database with demo users and facilities run:

```bash
# seed DB
docker-compose exec backend python /app/infra/seed_db.py

# start fake IoT data generator
docker-compose exec backend python /app/infra/fake_iot_data.py
```

> The paths above assume the backend container mounts the repository under `/app`.

---

## Local development

### Backend (FastAPI)

From `backend/`:

```bash
# create venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# start dev server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

FastAPI will auto-generate interactive docs at `http://localhost:8000/docs` and the OpenAPI JSON at `/openapi.json`.

### Frontend (React)

From `frontend/`:

```bash
yarn install
yarn dev
# or
npm install
npm run dev
```

Access the app at `http://localhost:3000` (default Vite port). Components are built using Tailwind and shadcn/ui. If you change Tailwind config, restart dev server.

---

## Database & TimescaleDB notes

This project uses TimescaleDB to store time-series IoT sensor data efficiently. In production, enable the `timescaledb` extension in PostgreSQL (docker image `timescale/timescaledb:latest-pg14` recommended).

Example SQL to enable extension (run as superuser):

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Example hypertable creation
CREATE TABLE sensor_readings (
  id SERIAL PRIMARY KEY,
  sensor_id TEXT NOT NULL,
  measurement_type TEXT NOT NULL,
  value DOUBLE PRECISION,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('sensor_readings', 'recorded_at');
```

---

## Seeding demo data & fake IoT generator

The `infra/` folder contains two useful scripts:

* `seed_db.py` — inserts admin users, sample facilities, devices and baseline data.
* `fake_iot_data.py` — publishes synthetic MQTT messages or calls REST ingestion endpoints to simulate sensors.

Example of using the fake data generator (simplified):

```python
# infra/fake_iot_data.py (concept snippet)
import time
import json
import random
import paho.mqtt.client as mqtt

mqtt_host = os.getenv('MQTT_BROKER_HOST', 'localhost')
client = mqtt.Client()
client.connect(mqtt_host, 1883)

SENSORS = ['room_101_temp', 'room_102_co2', 'lobby_aqi']

while True:
    sensor = random.choice(SENSORS)
    payload = {
        'sensor_id': sensor,
        'type': 'temperature',
        'value': round(random.uniform(20, 30), 2),
        'timestamp': time.time()
    }
    client.publish(f'usfmp/sensors/{sensor}', json.dumps(payload))
    time.sleep(2)
```

This generator helps you demo real-time charts and threshold alerts.

---

## Key backend routes & example requests

Below are the most important API endpoints developers will use. (Paths are examples; adjust if your `main.py` uses `/api` prefix.)

### Auth

**POST** `/auth/login` — login and receive JWT

Request:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpass"}'
```

Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Visitor / Access control

**POST** `/access/visitor` — create visitor record (issue QR pass)

Request (example):

```bash
curl -X POST http://localhost:8000/access/visitor \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","facility_id":1,"valid_until":"2025-10-15T18:00:00Z"}'
```

Response (returns record + QR code data):

```json
{
  "id": 42,
  "name": "John Doe",
  "qr_code": "<base64-png-data>",
  "valid_until": "2025-10-15T18:00:00Z"
}
```

**POST** `/access/scan` — scan QR or face-match endpoint (logs entry)

```bash
curl -X POST http://localhost:8000/access/scan \
  -H "Content-Type: application/json" \
  -d '{"qr_data":"<token-or-uuid>", "scanner_id": "door_1"}'
```

### Sensor ingestion (MQTT & REST)

**REST** `POST /sensors/ingest`

```bash
curl -X POST http://localhost:8000/sensors/ingest \
  -H "Content-Type: application/json" \
  -d '{"sensor_id":"room_101_temp","measurement_type":"temperature","value":25.1,"recorded_at":"2025-09-28T09:00:00Z"}'
```

**MQTT** — publish to topic `usfmp/sensors/<sensor_id>` with the JSON payload similar to above.

### IT infra metrics

**POST** `/infra/metrics` — push server metrics (or configure an agent to push periodically)

Payload example:

```json
{ "host": "web01", "cpu": 12.3, "memory": 54.1, "timestamp": "2025-09-28T09:00:00Z" }
```

---

## Frontend structure & components

High-level layout (inside `frontend/src`):

```
src/
├─ pages/
│  ├─ Dashboard.jsx
│  ├─ AccessTab.jsx
│  ├─ ClimateTab.jsx
│  └─ InfraTab.jsx
├─ components/
│  ├─ charts/    # Recharts wrappers for time-series
│  ├─ cards/     # Small data cards for real-time values
│  └─ forms/     # Visitor form, device registration
├─ services/
│  └─ api.js     # thin API client using fetch / axios
└─ utils/
   └─ auth.js    # JWT helpers
```

### Example: fetch sensor history (frontend helper)

```js
// frontend/src/services/api.js
export async function fetchSensorHistory(sensorId, from, to) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/sensors/${sensorId}/history?from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
```

Charts should consume the time-series data and map timestamps to `x` and values to `y`.

---

## Authentication & roles

Auth is JWT-based. The basic flow:

1. User logs in via `/auth/login` and receives JWT.
2. Frontend stores token in `localStorage` (or secure httpOnly cookie in production).
3. Include `Authorization: Bearer <token>` header in protected requests.

Roles determine UI & permissions:

* `admin` — full access, manage users, generate reports
* `facility_manager` — view analytics & climate controls, acknowledge alerts
* `security` — visitor logs, scan/approve entries

---

## Anomaly detection & alerts (design)

A simple, effective approach for initial MVP:

* **Climate anomalies:** for each sensor, compute rolling mean & stddev on last N readings. Flag if `value > mean + k*stddev`.
* **Infra anomalies:** use a simple autoencoder or isolation forest on CPU/memory patterns.

Example Python pseudo-code using z-score:

```python
from collections import deque

def is_anomalous(window, new_value, k=3):
    import statistics
    mean = statistics.mean(window)
    stdev = statistics.pstdev(window)
    if stdev == 0:
        return False
    z = abs((new_value - mean) / stdev)
    return z > k

# usage
window = deque(maxlen=50)
# fill window, then test incoming values
```

When an anomaly is detected, push an alert to the frontend via WebSocket or save to `alerts` table for the UI.

---

## Generating reports (PDFs)

The backend includes a PDF generation utility to create weekly/monthly reports. Libraries: `reportlab`, `weasyprint` or `pdfkit` (wkhtmltopdf).

Example using `pdfkit`:

```python
import pdfkit
from jinja2 import Environment, FileSystemLoader

html = Environment(loader=FileSystemLoader('templates')).get_template('report.html').render(context)
pdfkit.from_string(html, '/tmp/report.pdf')
```

Attach or serve the generated PDF at an authenticated endpoint like `/reports/<id>/download`.

---

## Docker compose & deployment hints

A minimal `docker-compose.yml` should include services:

* `postgres` (TimescaleDB image)
* `backend` (build from `backend/`)
* `frontend` (build from `frontend/`)
* `mqtt` (eclipse-mosquitto)
* optionally `pgadmin` or `grafana`

Example excerpt:

```yaml
version: '3.8'
services:
  postgres:
    image: timescale/timescaledb:latest-pg14
    environment:
      POSTGRES_DB: usfmp
      POSTGRES_USER: usfmp_admin
      POSTGRES_PASSWORD: supersecretpassword
    ports: ['5432:5432']
    volumes:
      - pgdata:/var/lib/postgresql/data

  mqtt:
    image: eclipse-mosquitto
    ports:
      - '1883:1883'

  backend:
    build: ./backend
    environment:
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=usfmp_admin
    depends_on:
      - postgres
      - mqtt
    ports: ['8000:8000']

  frontend:
    build: ./frontend
    ports: ['3000:3000']
    depends_on:
      - backend

volumes:
  pgdata:
```

For production, use managed PostgreSQL + Timescale or provision a VM with TimescaleDB installed. Use Nginx as a reverse-proxy and enable HTTPS via Certbot.

---

## Testing strategy

* **Unit tests:** backend routes, auth logic, small utils (pytest)
* **Integration tests:** seed DB, run backend, call REST endpoints (use `requests` or `httpx`), verify DB changes
* **Frontend tests:** component snapshot tests and a few integration tests using Playwright or Cypress

Example pytest snippet for auth:

```python
def test_login(client):
    res = client.post('/auth/login', json={'username': 'admin','password':'adminpass'})
    assert res.status_code == 200
    assert 'access_token' in res.json()
```

---

## Troubleshooting & common issues

* **Postgres connection refused:** Ensure `postgres` container is up and `POSTGRES_HOST` points to the service name in docker-compose. Check logs: `docker-compose logs postgres`.
* **Timescale extension missing:** Run `CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;` as a DB superuser.
* **MQTT messages not arriving:** Confirm broker is reachable and topics match. Use `mosquitto_sub -t 'usfmp/#' -v` to listen.
* **Frontend CORS errors:** Make sure backend allows requests from frontend origin. Example in FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

---

## How to contribute

1. Fork the repo and create a feature branch: `git checkout -b feat/<feature-name>`
2. Run tests locally and add tests for new features
3. Open a PR with a clear description and screenshots for UI changes
4. Keep commits small and focused

---

## Appendix: useful snippets

### 1) Create a visitor and generate QR (backend helper)

```python
# backend/app/services/qr_helper.py
import qrcode
import io
import base64

def generate_qr(data: str) -> str:
    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')
```

### 2) Sample FastAPI endpoint for sensor ingestion

```python
# backend/app/routes/sensors.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.db import get_db_session

router = APIRouter()

class SensorIn(BaseModel):
    sensor_id: str
    measurement_type: str
    value: float
    recorded_at: Optional[datetime.datetime]

@router.post('/ingest')
async def ingest_sensor(payload: SensorIn, db=Depends(get_db_session)):
    # insert into timescaledb table
    query = "INSERT INTO sensor_readings (sensor_id, measurement_type, value, recorded_at) VALUES ($1,$2,$3,$4)"
    await db.execute(query, payload.sensor_id, payload.measurement_type, payload.value, payload.recorded_at or datetime.datetime.utcnow())
    return {"status": "ok"}
```

### 3) WebSocket push for real-time updates (FastAPI)

```python
from fastapi import WebSocket

@app.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # handle subscription or send updates
            await websocket.send_text('pong')
    except WebSocketDisconnect:
        pass
```