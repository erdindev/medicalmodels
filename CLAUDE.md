# MedicalModels.co - Projekt-Dokumentation

## Projektübersicht
Zentrale Plattform zur systematischen Erfassung, Bewertung und Vergleich von Medical AI Modellen für Kliniker und Forscher.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS v4
- **Datenbank**: SQLite (Prisma ORM) - bereit für PostgreSQL-Migration
- **Auth**: NextAuth.js (Google + GitHub OAuth)
- **Charts**: Recharts (ROC-Kurven)
- **Deployment**: PM2 + Nginx + Let's Encrypt SSL

## Server-Konfiguration
- **IP**: 49.13.237.56 (Hetzner)
- **Domain**: medicalmodels.co (SSL aktiv)
- **PM2 Dashboard**: https://app.pm2.io/#/r/mr1i3mabhe4hzfw
- **Dev-Server**: Port 3000 (via PM2)

## Implementierte Features

### Auth-System
- Google OAuth Login
- GitHub OAuth Login
- Session-Management mit Prisma Adapter
- Protected Routes (/saved, /comparisons, /settings)
- User-Menu in Navbar mit Dropdown

### Seiten
- `/` - Homepage mit Hero-Search und Model-Grid
- `/models` - Model-Übersicht mit Filtern
- `/models/[slug]` - Model-Detailseite
- `/compare` - Side-by-Side Vergleich mit ROC-Kurven
- `/datasets` - Datasets-Übersicht
- `/papers` - Papers-Übersicht
- `/auth/signin` - Login-Seite
- `/auth/error` - Auth-Fehlerseite
- `/saved` - Gespeicherte Models (protected)
- `/comparisons` - Eigene Vergleiche (protected)
- `/settings` - Benutzereinstellungen + Subscription-Pläne

### Datenbank (Prisma Schema)
- User (mit role, plan, stripeCustomerId)
- Account, Session, VerificationToken (NextAuth)
- MedicalModel, ModelMetrics, RegulatoryInfo
- Dataset, Paper, Organization
- SavedModel, Comparison, ComparisonModel

### Design-Richtlinien
- Minimalistisch, kein Landing-Page-Overhead
- Direkt zur App, Hero-Search mit border-bottom only
- Einfache Navbar (Logo + 3 Links + User-Menu)
- Grünes Farbschema (primary: #22c55e)

## Wichtige Dateien
```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts
│   ├── auth/signin/page.tsx
│   ├── models/[slug]/page.tsx
│   ├── compare/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── navbar.tsx
│   ├── user-menu.tsx
│   └── providers.tsx
├── lib/
│   ├── auth.ts (NextAuth config)
│   ├── prisma.ts
│   └── data.ts (Demo-Daten)
└── middleware.ts (Protected Routes)

prisma/
├── schema.prisma
├── seed.ts
└── dev.db

.env (OAuth Credentials)
ecosystem.config.js (PM2)
```

## Commands
```bash
# Dev-Server starten
pm2 start ecosystem.config.js --only medicalmodels-dev

# Server neustarten
pm2 restart medicalmodels-dev

# Logs anzeigen
pm2 logs medicalmodels-dev

# Datenbank aktualisieren
npx prisma db push

# Seed ausführen
npx tsx prisma/seed.ts
```

## Nächste Schritte (Roadmap)
1. Stripe-Integration für Subscriptions
2. Admin-Dashboard
3. Echte Medical Models in DB seeden
4. X/Twitter API für automatische Tweets
5. Production-Deployment (nginx reverse proxy)
6. PostgreSQL Migration für Production

## Monetarisierung (Freemium)
- **Free**: Browse, 5 saved models, basic compare
- **Pro ($9/mo)**: Unlimited saves, advanced compare, PDF export, API
- **Team ($29/mo)**: 5 members, shared comparisons, priority support
