# Cryptocurrency Portfolio Valuation System

A monorepo application for real-time cryptocurrency portfolio tracking and valuation. Built with Symfony backend and Next.js frontend.

## Quick Links

- **API Documentation**: https://crypto-curr.digispace.pro/docs (Swagger UI)
- **Dashboard**: https://crypto-curr.digispace.pro (Next.js Frontend)

## System Architecture

### Production Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Production Setup                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Internet → External Caddy (192.168.100.23) ← TLS/SSL (Let's Enc) │
│              (Reverse Proxy, Auto HTTPS)                           │
│                          ↓                                          │
│        Docker VM (192.168.100.28)                                  │
│      ┌─────────────────────────────────────────────────┐           │
│      │                                                 │           │
│      │  FrankenPHP + Symfony + Caddy (Internal)       │           │
│      │  ┌──────────────────────────────────────────┐  │           │
│      │  │ PHP API Service (crypto-app-php)        │  │           │
│      │  │ • HTTP/2, HTTP/3                        │  │           │
│      │  │ • Symfony 7.2 + API Platform            │  │           │
│      │  │ • Fetches prices from Binance API       │  │           │
│      │  │ • Validates portfolio calculations      │  │           │
│      │  └──────────────────────────────────────────┘  │           │
│      │                    ↕                            │           │
│      │  ┌──────────────────────────────────────────┐  │           │
│      │  │ Scheduler (crypto-app-scheduler)        │  │           │
│      │  │ • Runs portfolio snapshots hourly       │  │           │
│      │  │ • Consumes messenger queue              │  │           │
│      │  │ • Calculates total portfolio value      │  │           │
│      │  └──────────────────────────────────────────┘  │           │
│      │                    ↕                            │           │
│      │  ┌──────────────────────────────────────────┐  │           │
│      │  │ PostgreSQL 16 (crypto-app-db)           │  │           │
│      │  │ • Traders table                         │  │           │
│      │  │ • Portfolio entries (BTC, ETH, etc)    │  │           │
│      │  │ • Historical snapshots with USD value   │  │           │
│      │  └──────────────────────────────────────────┘  │           │
│      │                                                 │           │
│      │  ┌──────────────────────────────────────────┐  │           │
│      │  │ Next.js PWA (crypto-app-pwa:3000)       │  │           │
│      │  │ • React dashboard                       │  │           │
│      │  │ • Real-time updates via Mercure         │  │           │
│      │  │ • Portfolio charts and statistics       │  │           │
│      │  └──────────────────────────────────────────┘  │           │
│      │                                                 │           │
│      └─────────────────────────────────────────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Tech Stack Overview

| Component | Technology | Purpose | Key Details |
|-----------|-----------|---------|-------------|
| **API** | Symfony 7.2 + API Platform | REST endpoints for portfolio data | Built-in Swagger docs, HATEOAS |
| **Async Tasks** | Symfony Messenger + Worker | Portfolio calculations without blocking requests | Runs independently, retries on failure |
| **Frontend** | Next.js + React | User dashboard and portfolio view | SSG/SSR, live updates via WebSocket |
| **Database** | PostgreSQL 16 | Persistent data storage | ACID transactions, JSON support |
| **Containerization** | Docker Compose | Local and production orchestration | Two-tier config: local/production |
| **Web Server** | Caddy (FrankenPHP) | HTTP/2, HTTPS, PHP execution | Zero-config HTTPS |
| **Load Balancer** | External Caddy | SSL termination, reverse proxy | Let's Encrypt auto-renewal |

### Why This Architecture?

#### 1. Separate Scheduler Service for Asynchronous Processing
- **Problem**: Portfolio valuation requires calling Binance API for each asset (slow, 3-5 seconds per request)
- **Why separate container**: Scheduler runs in its own isolated service that doesn't compete for resources with the API
- **Benefit**: 
  - API service stays responsive and fast, unaffected by long-running calculations
  - Scheduler can be restarted without taking down the API
  - Can scale scheduler independently if needed (e.g., run multiple scheduler instances)
  - Portfolio snapshots happen in background via message queue, not during HTTP requests
- **Result**: Users get instant API responses while calculations happen asynchronously in the background

#### 2. Two-Container Docker Setup
```
compose.yaml       • Used locally with pre-built images (fast)
compose.prod.yaml  • Rebuilds PHP/Next.js from source (controlled deployment)
```
- **Benefit**: Development is fast, production is reproducible and auditable

#### 3. Two-Tier Reverse Proxy (External + Internal Caddy)
- **External Caddy** (192.168.100.23): Handles all HTTPS, Certificate renewal
- **Internal Caddy** (inside Docker VM): Routes to PHP/Next.js, HTTP/2 support
- **Why**: Allows quick container restarts without SSL disruptions

#### 4. PostgreSQL with JSON Support
- Stores trader profiles and asset holdings
- JSON columns for flexible asset metadata
- Historical snapshots with USD valuations for charting

#### 5. Monorepo Structure
- API, Scheduler, and Frontend in one project
- Deployed together, but can scale independently
- Faster local development (all services run locally)

### Deployment Flow

1. **GitHub Action** creates a release artifact
2. **SSH upload** to server at `/home/yurii/crypto-curr-port-val/releases/<sha>`
3. **Symlink switch** updates `current` → new release
4. **Docker build** from `compose.yaml` + `compose.prod.yaml`
5. **Database migrations** applied automatically
6. **Service startup** with health checks

### Quick Start Production Deploy

From the production server's `current` directory:

```bash
# Build Docker images from source
docker compose -p crypto-app -f compose.yaml -f compose.prod.yaml build --no-cache --pull

# Start all services
docker compose -p crypto-app -f compose.yaml -f compose.prod.yaml up -d --remove-orphans

# Run database migrations
docker compose -p crypto-app -f compose.yaml -f compose.prod.yaml exec php \
  php bin/console doctrine:migrations:migrate --no-interaction

# (Optional) Load demo data
docker compose -p crypto-app -f compose.yaml -f compose.prod.yaml exec php \
  php bin/console doctrine:fixtures:load --no-interaction
```

### Verification

```bash
# Check API is responding
curl https://crypto-curr.digispace.pro/docs

# View scheduler logs
docker logs crypto-app-scheduler-prod -f

# Check portfolio snapshot table
docker compose -p crypto-app -f compose.yaml -f compose.prod.yaml exec database \
  psql -U app -d app -c "SELECT * FROM portfolio_history ORDER BY calculated_at DESC LIMIT 5;"
```

## Local Development

### Prerequisites
- Docker & Docker Compose
- Port 80, 443 available (or modify compose.yaml)

### Start Services
```bash
docker compose up -d
```

Access:
- API: http://localhost/docs

### Run Migrations & Fixtures
See [api/README.md](api/README.md) for detailed commands.

