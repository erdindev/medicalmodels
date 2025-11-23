# MedicalModels.co - TODO & Roadmap

## Aktueller Stand
- [x] Next.js Projekt Setup
- [x] Prisma Schema (hochmodular, erweiterbar)
- [x] Homepage mit Features
- [x] /models - Übersicht mit Filtern
- [x] /models/[slug] - Detailseite
- [x] /compare - Vergleichsmodul mit ROC-Kurven
- [x] /datasets - Dataset-Übersicht
- [x] /papers - Research Papers
- [x] Statische Teaser-Seite für medicalmodels.co

---

## Nächste Schritte

### Social Media Integration
- [ ] **Automatisierte Tweets auf X (Twitter)**
  - API Key vorhanden
  - Mögliche Tweet-Typen:
    - Neues Modell hinzugefügt
    - Modell-Update (neue Version)
    - Wöchentliche Highlights
    - Neue Publikationen
  - Implementierung:
    - X API v2 Integration
    - Cron-Job für scheduled Tweets
    - Admin-Interface für manuelle Tweets

### Datenbank
- [ ] Prisma DB initialisieren (`prisma db push`)
- [ ] Seed-Daten migrieren von Demo-Daten zu DB
- [ ] Admin-Interface für CRUD-Operationen

### Features
- [ ] User Authentication (NextAuth.js)
- [ ] Model-Submission Workflow
- [ ] Saved Collections für User
- [ ] API für externe Integration
- [ ] Newsletter-Signup

### Content
- [ ] Mehr Demo-Modelle hinzufügen
- [ ] Echte ROC-Kurven-Daten
- [ ] Bias-Analyse Visualisierung
- [ ] PDF-Export für Vergleiche

### Deployment
- [ ] Teaser-Seite auf medicalmodels.co deployen
- [ ] Full-App Deployment (Vercel/Railway)
- [ ] Domain-Setup und SSL

---

## Notizen

### X (Twitter) API Integration
```env
# .env.local (nicht committen!)
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_SECRET=xxx
TWITTER_BEARER_TOKEN=xxx
```

Beispiel Tweet-Template:
```
🆕 New Model Added: {model_name}

📊 AUC: {auc}% | Sensitivity: {sens}%
🏥 Specialty: {specialty}
✅ {fda_status}

Explore more: medicalmodels.co/models/{slug}

#MedicalAI #HealthcareAI #{specialty}
```
