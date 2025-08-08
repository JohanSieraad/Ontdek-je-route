# 🏰 RouteParel - Nederlandse Routes App

Een moderne web applicatie voor het ontdekken van historische routes door Nederland, België en andere regio's. Met persoonlijke aanbevelingen, audiogidsen en Google Maps integratie.

## 🚀 Quick Start

### Lokale Development
```bash
# 1. Clone de repository
git clone [jouw-github-url]
cd routeparel

# 2. Installeer dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Bewerk .env met jouw database en API keys

# 4. Setup database
./package-scripts.sh

# 5. Start development server
npm run dev
```

Bezoek: http://localhost:5000

### Met Docker
```bash
# Development met Docker Compose
docker-compose up --build

# Of alleen de app (vereist externe database)
docker build -t routeparel .
docker run -p 5000:5000 --env-file .env routeparel
```

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript  
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui (Radix UI components)
- **Maps**: Google Maps JavaScript API
- **State**: TanStack Query (React Query v5)
- **Routing**: Wouter (client) + Express (server)

## 📦 Environment Variables

Kopieer `.env.example` naar `.env` en configureer:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/routeparel
PGHOST=localhost
PGPORT=5432
PGUSER=routeparel
PGPASSWORD=your_password
PGDATABASE=routeparel

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application
NODE_ENV=development
SESSION_SECRET=your_random_session_secret
```

## 🗄️ Database Setup

### PostgreSQL Installatie
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows
# Download van https://www.postgresql.org/download/
```

### Database Configuratie
```sql
-- Verbind als postgres user
sudo -u postgres psql

-- Maak user en database
CREATE USER routeparel WITH PASSWORD 'your_password';
CREATE DATABASE routeparel OWNER routeparel;
GRANT ALL PRIVILEGES ON DATABASE routeparel TO routeparel;
```

### Schema Setup
```bash
# Push schema naar database
npm run db:push

# Of gebruik de automated setup
./package-scripts.sh
```

## 🚀 Deployment Opties

### 1. Neon Database (Aanbevolen - Gratis)
- Ga naar [neon.tech](https://neon.tech)
- Maak gratis account en database
- Kopieer connection string naar `DATABASE_URL`

### 2. Railway (Volledig platform)
- Verbind GitHub repository op [railway.app](https://railway.app)
- Voeg PostgreSQL service toe
- Deploy automatisch bij elke push

### 3. Digital Ocean App Platform
- Gebruik de meegeleverde `docker-compose.yml`
- Configureer environment variables
- Auto-deploy via GitHub

### 4. VPS Deployment
```bash
# Met PM2 process manager
npm install -g pm2
npm run build
pm2 start dist/index.js --name "routeparel"
pm2 save && pm2 startup
```

## 📁 Project Structuur

```
├── client/src/          # React frontend
│   ├── components/      # UI componenten
│   ├── pages/          # Route pagina's
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functies
├── server/             # Express backend
│   ├── routes/         # API route handlers
│   ├── middleware/     # Express middleware
│   └── db.ts          # Database configuratie
├── shared/             # Gedeelde types en schema's
├── attached_assets/    # Gebruiker afbeeldingen
└── docs/              # Documentatie
```

## 🔧 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build voor productie
npm run start       # Start productie server
npm run db:push     # Update database schema
npm run db:studio   # Open Drizzle Studio (database GUI)
npm run check       # TypeScript type checking
```

## 📊 Health Check

De app bevat een health check endpoint voor monitoring:
- **URL**: `/api/health`
- **Method**: GET
- **Response**: Server status, database connectivity, uptime

## 🗺️ Features

### Huidige Features
- **Route Ontdekking**: Kasteel routes door Noord-Holland, Utrecht, Ardennen
- **Audio Gidsen**: Gesproken verhalen bij routes en stops  
- **Google Maps**: Interactieve kaarten met route visualization
- **Responsive Design**: Mobiel-vriendelijke interface
- **Persoonlijke Profielen**: Voertuig voorkeuren, favoriete locaties

### Geplande Features
- **Multi-dag routes**: Uitgebreide routes met overnachtingen
- **Accommodatie integratie**: Booking.com en Airbnb partnerships
- **App Store publicatie**: iOS en Android apps
- **Uitgebreide content**: Meer regio's en route types

## 🤝 Contributing

1. Fork de repository
2. Maak een feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Open een Pull Request

## 📄 License

MIT License - zie LICENSE bestand voor details.

## 🆘 Support

Voor vragen of problemen:
- GitHub Issues voor bug reports
- Check de `setup-database.md` voor database setup hulp
- Raadpleeg `replit.md` voor project architectuur details