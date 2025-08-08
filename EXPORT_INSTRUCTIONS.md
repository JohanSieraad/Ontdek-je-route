# RouteParel Export Package

Dit export pakket bevat alle broncode en configuratie bestanden voor de RouteParel applicatie.

## 📦 Inhoud van dit pakket:

### Applicatie Code
- `client/` - React frontend (TypeScript + Tailwind CSS)
- `server/` - Express.js backend (TypeScript)
- `shared/` - Gedeelde types en database schema's

### Configuratie
- `package.json` - Dependencies en scripts
- `tsconfig.json` - TypeScript configuratie
- `vite.config.ts` - Frontend build configuratie
- `drizzle.config.ts` - Database ORM configuratie
- `tailwind.config.ts` - CSS framework configuratie

### Deployment Files
- `Dockerfile` - Container configuratie
- `docker-compose.yml` - Volledige stack setup
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `.env.example` - Environment variables template

### Setup Scripts
- `package-scripts.sh` - Geautomatiseerde database setup
- `setup-database.md` - Uitgebreide database instructies
- `README.md` - Complete project documentatie

### Assets
- `attached_assets/` - Jouw kasteel foto's (Muiderslot, Kasteel Bouillon)
- `replit.md` - Project architectuur en voorkeuren

## 🚀 Quick Start in nieuwe omgeving:

1. **Extract bestanden**
2. **Installeer dependencies**: `npm install`
3. **Database setup**: Kopieer `.env.example` naar `.env` en configureer
4. **Run setup**: `./package-scripts.sh` (of handmatig database aanmaken)
5. **Start development**: `npm run dev`

## 🌐 Database opties:
- **Lokaal**: PostgreSQL installeren
- **Cloud**: Neon.tech (gratis), Supabase, of Railway

## 📊 Features inbegrepen:
- Complete kasteel routes (Noord-Holland, Utrecht, Ardennen)
- Jouw eigen foto's geïntegreerd
- Google Maps integratie
- Audio gidsen systeem
- Gebruiker authenticatie
- Responsive design
- Database met Drizzle ORM

## 🔧 Environment Variables:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/database
GOOGLE_MAPS_API_KEY=your_api_key
NODE_ENV=development
```

**Let op**: `node_modules` en `dist` zijn uitgesloten om bestandsgrootte te beperken. 
Run `npm install` na extractie.

Voor vragen: zie README.md en setup-database.md