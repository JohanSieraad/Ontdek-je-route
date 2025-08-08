# Database Setup Guide voor RouteParel

## PostgreSQL Database Setup

### 1. PostgreSQL Installatie

#### Op Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Op macOS (via Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

#### Op Windows:
Download van: https://www.postgresql.org/download/windows/

### 2. Database en User Aanmaken

```bash
# Verbind als postgres superuser
sudo -u postgres psql

# Maak database user aan
CREATE USER routeparel WITH PASSWORD 'jouw_wachtwoord_hier';

# Maak database aan
CREATE DATABASE routeparel OWNER routeparel;

# Geef juiste privileges
GRANT ALL PRIVILEGES ON DATABASE routeparel TO routeparel;

# Verlaat psql
\q
```

### 3. Environment Variables Setup

Maak een `.env` bestand in de root van je project:

```bash
# Database configuratie
DATABASE_URL=postgresql://routeparel:jouw_wachtwoord_hier@localhost:5432/routeparel
PGHOST=localhost
PGPORT=5432
PGUSER=routeparel
PGPASSWORD=jouw_wachtwoord_hier
PGDATABASE=routeparel

# Google Maps API
GOOGLE_MAPS_API_KEY=AIzaSyDJ--TC9RCw-JNdA3eCJwtUhZ0QtgofzeY

# Development
NODE_ENV=development
```

### 4. Database Schema Setup

```bash
# Installeer dependencies
npm install

# Push database schema (Drizzle ORM)
npm run db:push

# Of gebruik de migration script
npm run db:migrate
```

### 5. Verificatie

Test de database verbinding:
```bash
npm run db:studio  # Optioneel: Drizzle Studio voor database browser
```

## Cloud Database Alternatieven

### Neon Database (Aanbevolen - Gratis tier)
1. Ga naar https://neon.tech
2. Maak een gratis account
3. Maak een nieuwe database
4. Kopieer de connection string naar DATABASE_URL

### Supabase (Gratis tier)
1. Ga naar https://supabase.com
2. Maak een project
3. Gebruik de PostgreSQL connection details

### Railway (Eenvoudig deployment)
1. Ga naar https://railway.app
2. Verbind je GitHub repository
3. Voeg PostgreSQL database toe
4. Deploy automatisch bij elke commit

## Productie Deployment

### Via Docker (Aanbevolen)
```dockerfile
# Dockerfile aanwezig in project root
docker build -t routeparel .
docker run -p 5000:5000 --env-file .env routeparel
```

### Via PM2 (Node.js Process Manager)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Backup Script

```bash
#!/bin/bash
# backup-db.sh
pg_dump -h localhost -U routeparel -d routeparel > backup_$(date +%Y%m%d_%H%M%S).sql
```

## GitHub Actions CI/CD

`.github/workflows/deploy.yml` is al aanwezig voor automatische deployment.