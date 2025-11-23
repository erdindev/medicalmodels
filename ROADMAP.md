# MedicalModels.co - Roadmap & Strategie

## Phase 1: Foundation (Aktuell)
- [x] Core UI mit Suche
- [x] Model-Vergleich mit ROC-Kurven
- [x] Teaser-Seite live
- [ ] **Auth: Google + GitHub Login**
- [ ] Datenbank live (Prisma → PostgreSQL)

---

## Phase 2: Core Features

### Authentication
- **Google OAuth** (Primär - Kliniker nutzen oft Google Workspace)
- **GitHub OAuth** (Für ML-Researcher/Entwickler)
- User-Profile mit gespeicherten Vergleichen

### User Features
- Modelle zu Favoriten hinzufügen
- Vergleiche speichern & teilen
- Persönliche Notizen zu Modellen
- Email-Alerts bei Model-Updates

### Content
- Model-Submission durch Community
- Review-Workflow für neue Einträge
- Versionierung (Model v1.0 → v2.0)
- Changelog pro Model

---

## Phase 3: Monetarisierung

### Freemium Modell

| Feature | Free | Pro ($29/mo) | Team ($99/mo) |
|---------|------|--------------|---------------|
| Suche & Filter | ✓ | ✓ | ✓ |
| Model-Details | ✓ | ✓ | ✓ |
| Vergleiche | 3/Tag | Unbegrenzt | Unbegrenzt |
| Gespeicherte Vergleiche | 5 | Unbegrenzt | Unbegrenzt |
| Export (PDF/CSV) | - | ✓ | ✓ |
| API-Zugang | - | 1000 req/mo | 10000 req/mo |
| Team-Workspace | - | - | ✓ |
| Priority Support | - | - | ✓ |

### Enterprise Optionen
- Custom Integration in Klinik-Systeme
- Interne Model-Registry
- Compliance-Reports (FDA/CE)
- On-Premise Option

### Weitere Revenue Streams
1. **Featured Listings** - Model-Anbieter zahlen für Sichtbarkeit
2. **API für Entwickler** - Pay-per-use für Integrationen
3. **Sponsored Research** - Partnerschaften mit Forschungseinrichtungen
4. **Whitelabel** - Plattform für Kliniken/Universitäten

---

## Phase 4: Growth

### Community
- Diskussionen/Kommentare zu Modellen
- Upvotes für hilfreiche Reviews
- Contributor-Badges
- Leaderboard für aktive Reviewer

### Content Expansion
- Benchmark-Leaderboards
- Tutorials/Guides für Model-Integration
- Use-Case Spotlights
- Industry News Feed

### Integrations
- PACS-Integration für Radiology
- EHR-Anbindung
- Jupyter Notebook Export
- HuggingFace Sync

---

## Technische Anforderungen

### Auth Stack (NextAuth.js)
```
- Google OAuth 2.0
- GitHub OAuth
- Optional später: Apple, Microsoft
```

### Database
```
- PostgreSQL (Supabase oder Railway)
- Redis für Caching
```

### Hosting
```
- Vercel (Frontend)
- Railway/Supabase (DB)
- CloudFlare (CDN, DDoS)
```

### Analytics
```
- PostHog (Privacy-focused)
- Stripe für Payments
```

---

## Prioritäten (Next Steps)

1. **Google + GitHub Auth implementieren**
2. **PostgreSQL Setup** (Supabase)
3. **User-Dashboard** (gespeicherte Vergleiche)
4. **Stripe Integration** für Pro-Plan
5. **Model-Submission Workflow**

---

## Differenzierung

### Was uns unique macht:
- **Fokus auf Validierung** - Externe Validierung als Key-Metrik
- **Bias-Transparenz** - Subgruppen-Performance sichtbar
- **Regulatory-First** - FDA/CE Status prominent
- **Vergleichbarkeit** - Side-by-side mit ROC-Overlay

### Wettbewerber:
- HuggingFace (zu generisch, nicht medical-focused)
- Papers with Code (nur Benchmarks, keine Regulatory-Info)
- FDA AI/ML Database (nur approved, keine Vergleiche)

---

## KPIs für Launch

- 100 Models gelistet
- 500 registrierte User (Monat 1)
- 50 Pro-Subscriptions (Monat 3)
- 10 Enterprise-Anfragen (Monat 6)
