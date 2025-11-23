# MedicalModels.co

A platform for discovering, comparing, and evaluating medical AI models for clinicians and researchers.

## Features

- **Model Catalog** - Browse medical AI models with detailed metrics
- **Compare** - Side-by-side comparison with ROC curve visualization
- **Metrics** - Sensitivity, Specificity, AUC, F1-Score, PPV, NPV
- **Regulatory Info** - FDA, CE Mark, HIPAA, GDPR compliance
- **Datasets & Papers** - Related training data and publications

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite / PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js (Google, GitHub)
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone repository
git clone git@github.com:erdindev/medicalmodels.git
cd medicalmodels

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your OAuth credentials

# Initialize database
npx prisma db push

# Seed demo data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Project Structure

```
src/
├── app/                 # Next.js pages
│   ├── api/auth/        # NextAuth API routes
│   ├── models/          # Model catalog & detail pages
│   ├── compare/         # Comparison tool
│   ├── datasets/        # Datasets overview
│   └── papers/          # Papers overview
├── components/          # React components
├── lib/                 # Utilities & config
└── types/               # TypeScript types

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Demo data seeder
```

## Deployment

```bash
# Production build
npm run build

# Start with PM2
pm2 start ecosystem.config.js --only medicalmodels-prod
```

## License

Private - All rights reserved
