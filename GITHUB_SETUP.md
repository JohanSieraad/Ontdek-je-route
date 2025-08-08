# 🚀 GitHub Setup voor RouteParel

## Stap-voor-stap instructies om dit project naar GitHub te pushen:

### 1. Maak GitHub repository aan
1. Ga naar GitHub.com en log in
2. Klik op "New repository" (groene knop)
3. Repository name: `routeparel`
4. Description: `RouteParel - Dutch travel routes application`
5. Kies "Public" of "Private" 
6. **NIET** "Initialize with README" aanvinken
7. Klik "Create repository"

### 2. Push vanuit Replit
Open de Shell in Replit en run deze commando's:

```bash
# Git configuratie (vervang met je eigen gegevens)
git config --global user.name "Jouw Naam"
git config --global user.email "jouw.email@example.com"

# Initialize git repository
git init

# Add alle bestanden
git add .

# Eerste commit
git commit -m "Initial commit: RouteParel - Dutch travel routes application

- Complete React + TypeScript frontend with Tailwind CSS
- Express.js backend with Drizzle ORM  
- Castle routes with integrated user photos (Muiderslot, Kasteel Bouillon)
- Google Maps API integration
- Production-ready deployment configuration
- Database schema and authentication system
- Comprehensive documentation and setup guides"

# Add GitHub remote (vervang JOUW_GITHUB_USERNAME)
git remote add origin https://github.com/JOUW_GITHUB_USERNAME/routeparel.git

# Push naar GitHub
git push -u origin main
```

### 3. GitHub Actions CI/CD (optioneel)
De `.github/workflows/deploy.yml` file is al aanwezig en klaar voor:
- Automatische builds bij elke push
- Deployment naar Railway/DigitalOcean
- Database migraties

### 4. Environment Secrets toevoegen (voor deployment)
In GitHub repository → Settings → Secrets and variables → Actions:
- `DATABASE_URL`: Je PostgreSQL connection string
- `GOOGLE_MAPS_API_KEY`: Je Google Maps API key

### 5. Clone op lokale machine (optioneel)
```bash
git clone https://github.com/JOUW_GITHUB_USERNAME/routeparel.git
cd routeparel
npm install
```

## 📦 Wat wordt gepusht:
- ✅ Complete applicatie code (136 bestanden)
- ✅ Jouw kasteel foto's in `attached_assets/`
- ✅ Production deployment configuratie
- ✅ Database schema en migraties
- ✅ Volledige documentatie
- ✅ `.gitignore` file (node_modules uitgesloten)

## 🔧 Na push naar GitHub:
1. Repository is direct klaar voor deployment
2. README.md toont complete setup instructies
3. Issues/Pull requests kunnen gebruikt worden
4. Automatische CI/CD pipeline actief

**Let op**: Je hebt misschien een GitHub Personal Access Token nodig voor authentication.
Genereer deze in: GitHub → Settings → Developer settings → Personal access tokens