# Audiogami Demo App - Voice Support Tickets

> A demonstration SPA showcasing how Audiogami transforms voice descriptions into structured support tickets with Human-in-the-Loop (HITL) validation.

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Use Cases](#use-cases)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Technical Stack](#technical-stack)
- [Data Models](#data-models)
- [Screenshots](#screenshots)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Changelog](#changelog)

---

## 🎯 Overview

This application demonstrates the core value proposition of Audiogami: converting unstructured voice input into structured, actionable support tickets. The demo simulates a two-pass voice processing system where:

1. **Pass 1**: User describes their problem naturally - the system extracts key information in real-time
2. **Pass 2**: System asks targeted follow-up questions for missing details
3. **HITL**: User validates and completes the extracted information
4. **Confirmation**: Ticket is created and assigned to an appropriate agent

**Key Features**:
- **Real-time Question-Answer Alignment**: Answers appear inline with questions as they're detected
- **True Single-Page Architecture**: No URL changes, state-machine based navigation
- **Progressive Field Detection**: Visual feedback as information is extracted from transcription

**Phase 1 Status**: This is a simulation using pre-recorded transcripts. No real SDK or voice processing is integrated yet.

---

## ✨ Features

### Core Capabilities

- ✅ **4 Industry Use Cases** - IT Support, E-commerce, SaaS, Developer Portal
- ✅ **Bilingual Interface** - Full FR/EN support with instant switching
- ✅ **Smart Field Extraction** - Progressive information capture across 2 passes
- ✅ **Real-time Question-Answer Alignment** - Answers appear inline with questions as they're detected
- ✅ **Dynamic Question Reordering** - Answered questions automatically rise to the top
- ✅ **HITL Validation** - Editable forms with required/optional field grouping
- ✅ **Auto-categorization** - Intelligent priority and category assignment
- ✅ **Tag System** - Smart tagging (urgent, recurring, VIP, etc.)
- ✅ **Agent Assignment** - Visual agent cards with estimated response times
- ✅ **Knowledge Base** - Contextual article suggestions per use case
- ✅ **Dashboard** - Full back-office with search, filter, and export

### UX Enhancements

- 🎨 Modern, responsive design with Tailwind CSS
- ⚡ Fast typewriter effect for realistic transcription simulation
- 📊 Visual progress bars with color-coded states
- 🎭 Smooth animations and transitions (fade-in for detected fields)
- 📱 Mobile-first responsive layout
- 🌐 Persistent language preference
- 🔄 True single-page experience (URL stays at `/` throughout)
- ✨ Progressive field detection with real-time visual feedback

### Technical Features

- 💾 Dual-mode persistence (Supabase database + localStorage fallback)
- 🔄 Real-time form validation
- 📤 CSV export for ticket data
- 🎯 Modular component architecture
- ⚙️ Production-ready build configuration
- 🚀 Hot Module Replacement (HMR) in development

---

## 🏢 Use Cases

### 🖥️ IT Support - PC Expert Support
**Context**: Gaming PC retailer providing technical support

**Questions**:
1. Quel appareil ou composant pose problème ? / Which device or component is having issues?
2. Que se passe-t-il exactement ? / What exactly is happening?
3. Depuis quand et à quelle fréquence ? / Since when and how often?

**Categories**: Hardware, Software, Network, Peripheral, Other

**Sample Issues**: Graphics card crashes, keyboard malfunction, driver issues

---

### 👟 E-commerce - ShoeShop Support
**Context**: Online shoe store handling orders and deliveries

**Questions**:
1. Quel est votre numéro de commande ? / What is your order number?
2. Quel problème rencontrez-vous ? / What problem are you experiencing?
3. Avez-vous déjà contacté le transporteur ? / Have you already contacted the carrier?

**Categories**: Delivery, Product Defect, Wrong Item, Refund, Other

**Sample Issues**: Missing package, wrong size received, delayed delivery

---

### 📊 SaaS - CRM Helper
**Context**: CRM software technical support

**Questions**:
1. Quelle fonctionnalité est concernée ? / Which feature is affected?
2. Décrivez le comportement inattendu / Describe the unexpected behavior
3. Quel est l'impact sur votre travail ? / What is the impact on your work?

**Categories**: Bug, Feature Request, Access Issue, Performance, Other

**Sample Issues**: PDF export timeout, missing date filters, login problems

---

### 💻 Dev Portal - DevPortal Feedback
**Context**: Developer portal for API users

**Questions**:
1. S'agit-il d'un bug, d'une idée ou d'une question ? / Is it a bug, an idea, or a question?
2. Décrivez précisément la situation / Describe the situation precisely
3. Quelle est l'urgence pour vous ? / What is the urgency for you?

**Categories**: Bug, Enhancement, New Feature, Documentation, Other

**Sample Issues**: Double-click creates duplicates, OAuth docs incomplete

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/gami-lab/voice-support-claude.git
cd voice-support-claude

# Install dependencies
npm install

# Configure environment (optional - app works with localStorage by default)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (see Database Setup below)
```

### Development Server

```bash
# Start Vite dev server with HMR
npm run dev

# Server will start at http://localhost:5173
```

Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Build output will be in the `dist/` directory.

### Database Setup (Optional)

The app works out of the box using **localStorage** for data persistence. For production deployments with persistent database storage, you can configure **Supabase**.

#### Why Use Supabase?

- ✅ Persistent data across sessions and devices
- ✅ Real-time updates and collaboration
- ✅ Built-in authentication and authorization
- ✅ Automatic backups and scaling
- ✅ SQL database with full query capabilities

#### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

#### Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

#### Step 3: Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **IMPORTANT**: Never commit `.env.local` to git! It's already in `.gitignore`.

#### Step 4: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql` from this project
4. Paste into the SQL editor and click **Run**

This will create:
- `tickets` table with all required fields
- Indexes for better query performance
- Auto-updating `updated_at` trigger
- Row Level Security (RLS) policies
- Sample seed data (optional)

#### Step 5: Verify Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console - you should see:
   ```
   ✅ Supabase configured - using database storage
   ```

3. Create a test ticket and verify it appears in Supabase:
   - Go to **Table Editor** → **tickets** in Supabase dashboard
   - You should see your newly created ticket

#### Fallback to localStorage

If Supabase credentials are not configured or invalid, the app automatically falls back to localStorage. You'll see this message in the console:
```
ℹ️ Supabase not configured - using localStorage
```

No code changes required - the storage layer handles this transparently!

---

## 📁 Project Structure

```
voice-support-claude/
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.jsx        # App header with branding & language toggle
│   │   └── Footer.jsx        # Footer with Audiogami attribution
│   │
│   ├── screens/              # Page-level route components
│   │   ├── Home.jsx          # Landing page with use case selection
│   │   ├── Recording.jsx     # Voice simulation with typewriter effect
│   │   ├── Validate.jsx      # HITL form validation screen
│   │   ├── Confirmation.jsx  # Success screen with agent assignment
│   │   └── Dashboard.jsx     # Back-office ticket management
│   │
│   ├── data/                 # Static data and configurations
│   │   ├── enums.js          # Status, Priority, Category, Tag enums
│   │   ├── transcriptions.js # Pre-recorded voice transcripts (FR/EN)
│   │   ├── useCases.js       # Use case configs, questions, KB articles
│   │   └── translations.js   # i18n strings for FR/EN
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useLanguage.jsx   # Language context provider & switcher
│   │
│   ├── lib/                  # External service integrations
│   │   └── supabase.js       # Supabase client configuration
│   │
│   ├── utils/                # Utility functions
│   │   └── storage.js        # Dual-mode storage (Supabase + localStorage)
│   │
│   ├── App.jsx               # Root component with state machine navigation
│   ├── main.jsx              # React 19 entry point
│   └── index.css             # Global styles, Tailwind directives, animations
│
├── supabase/                 # Database configuration
│   └── schema.sql            # PostgreSQL schema for tickets table
│
├── public/                   # Static assets
│   └── vite.svg
│
├── dist/                     # Production build output (generated)
│
├── node_modules/             # Dependencies (generated)
│
├── README.md                 # This file
├── CHANGELOG.md              # Version history and release notes
├── package.json              # NPM dependencies and scripts
├── package-lock.json         # Dependency lock file
├── vite.config.js            # Vite bundler configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS plugins (Tailwind + Autoprefixer)
├── eslint.config.js          # ESLint linting rules
├── .env.example              # Environment variables template
├── .env.local                # Local environment (not in git)
├── .gitignore                # Git ignore patterns
└── index.html                # HTML entry point
```

---

## 🔄 Workflow

### User Journey (4 Screens)

```mermaid
graph LR
    A[Home] --> B[Recording]
    B --> C[Validate]
    C --> D[Confirmation]
    D --> E[Dashboard]
    E --> A
```

#### 1. **Home Screen** - Use Case Selection
- Display 4 use case cards with icons and descriptions
- Show 3-step process overview
- Link to dashboard for viewing existing tickets

#### 2. **Recording Screen** - Voice Simulation
- Show use case questions with inline answer display
- **Test Pass 1**: Play first transcript with typewriter effect
- **Real-time field detection**: Answers appear progressively as transcript plays
- **Dynamic reordering**: Answered questions move to top, unanswered stay at bottom
- **Visual feedback**: Answered questions highlighted with blue border and checkmark
- Highlight missing required fields
- **Test Pass 2**: Play follow-up transcript
- Complete remaining fields with same real-time feedback
- Auto-navigate to validation

#### 3. **Validate Screen** - HITL Form
- Editable form with all extracted fields
- Required fields clearly marked
- Dropdowns for enums (status, priority, category)
- Tag selection with chip UI
- Completion status indicator
- Option to return to recording or validate & continue

#### 4. **Confirmation Screen** - Success & Assignment
- Ticket summary with color-coded badges
- 3 available agents with specialty and estimated time
- Knowledge base article suggestions
- Optional email notification
- Create ticket and redirect options

#### 5. **Dashboard** - Back Office
- Statistics cards by status
- Category breakdown
- Search and filter controls
- Sortable ticket table
- Click to view full ticket details
- CSV export

---

## 🛠️ Technical Stack

### Frontend Framework
- **React 19.0.0** - Component-based UI library with latest features
- **Vite 7.2.6** - Next-generation build tool with lightning-fast HMR
- **State Machine Navigation** - Pure React state-based screen management (no router)

### Styling
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **PostCSS 8.4.49** - CSS transformations
- **Autoprefixer 10.4.20** - Automatic vendor prefixing

### State Management
- React Context API for language preferences
- React useState/useEffect for component state
- Dual-mode storage (Supabase + localStorage fallback)

### Database & Backend
- **Supabase Client 2.48.1** - PostgreSQL database with real-time capabilities
- Automatic fallback to localStorage when Supabase not configured
- Row Level Security (RLS) for data protection

### Development Tools
- **ESLint 9.17.0** - Code quality and consistency
- **Vite Plugin React 4.3.4** - Fast Refresh support

---

## 📊 Data Models

### Ticket Schema

```javascript
{
  id: string,                    // UUID
  created_at: string,            // ISO 8601 timestamp
  use_case: enum,                // it_support | ecommerce | saas | dev_portal
  status: enum,                  // new | in_progress | waiting_customer | resolved | closed
  priority: enum,                // critical | high | medium | low
  category: enum,                // Use case specific categories
  tags: string[],                // Array of tag enums
  raw_transcript: string,        // Complete voice transcript
  language: string,              // 'fr' | 'en'
  email: string,                 // Optional user email

  // Use case specific fields (nullable)
  device: string,
  symptoms: string,
  frequency: string,
  environment: string,
  actions_tried: string,
  impact: string,
  order_number: string,
  problem_type: string,
  product_description: string,
  delivery_status: string,
  desired_resolution: string,
  purchase_date: string,
  feature: string,
  steps_to_reproduce: string,
  request_type: string,
  description: string,
  urgency: string,
  context: string,
  expected_behavior: string,
  ideas_needs: string
}
```

### Enums Reference

**Status**: `new`, `in_progress`, `waiting_customer`, `resolved`, `closed`

**Priority**: `critical`, `high`, `medium`, `low`

**Tags**: `urgent`, `recurring`, `first_contact`, `escalation`, `vip_customer`, `workaround_available`

**Categories by Use Case**:
- IT Support: `hardware`, `software`, `network`, `peripheral`, `other`
- E-commerce: `delivery`, `product_defect`, `wrong_item`, `refund`, `other`
- SaaS: `bug`, `feature_request`, `access_issue`, `performance`, `other`
- Dev Portal: `bug`, `enhancement`, `new_feature`, `documentation`, `other`

---

## 🖼️ Screenshots

### Home - Use Case Selection
Select from 4 different support scenarios with visual cards and icons.

### Recording - Voice Simulation
Watch as the system "listens" and progressively extracts information with a realistic typewriter effect.

### Validation - HITL Form
Review and complete extracted information in an editable, user-friendly form.

### Confirmation - Success
See ticket summary, assigned agent, and helpful knowledge base articles.

### Dashboard - Back Office
Manage all tickets with powerful filtering, search, and export capabilities.

---

## 👨‍💻 Development

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

The app works out of the box with localStorage (no configuration needed). To enable Supabase database storage:

1. Copy the template:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. See the [Database Setup](#database-setup-optional) section for detailed instructions.

**Note**: The app automatically detects Supabase configuration and falls back to localStorage if not configured.

### Adding New Use Cases

1. Define enums in `src/data/enums.js`
2. Add configuration in `src/data/useCases.js`
3. Create transcriptions in `src/data/transcriptions.js`
4. Add translations in `src/data/translations.js`

### Adding New Languages

1. Add translations object in `src/data/translations.js`
2. Add transcription variants in `src/data/transcriptions.js`
3. Update language switcher in `src/components/Header.jsx`

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Deploy to GitHub Pages

```bash
npm run build
# Configure GitHub Pages to serve from 'dist' directory
```

### Environment Configuration for Production

#### Vercel Deployment with Supabase

1. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment Variables** in Vercel Dashboard:
   - Go to your project settings → Environment Variables
   - Add `VITE_SUPABASE_URL` with your Supabase project URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

3. **Redeploy**:
   ```bash
   vercel --prod
   ```

#### Netlify Deployment with Supabase

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Configure Environment Variables** in Netlify:
   - Go to Site settings → Environment variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

3. **Deploy** by dragging the `dist` folder to Netlify or connecting your Git repository

#### Important Notes

- The app will automatically use Supabase if environment variables are present
- If not configured, it falls back to localStorage (works locally but data doesn't persist across devices)
- Make sure your Supabase database schema is set up (see [Database Setup](#database-setup-optional))
- Environment variables starting with `VITE_` are embedded in the build and exposed to the client

---

## 🤝 Contributing

This is a demonstration project for Audiogami. For questions or feedback:

1. Open an issue describing your feedback
2. Fork the repository
3. Create a feature branch
4. Submit a pull request with detailed description

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and release notes.

**Latest Version**: 1.1.0 (2025-12-02)

---

## 📄 License

This project is proprietary software built for Audiogami. All rights reserved.

---

## 🙏 Acknowledgments

- **Audiogami Team** - For the innovative voice-to-ticket concept
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first styling approach
- **Vite** - For blazing fast development experience

---

## 📞 Support

For technical support or questions:
- Open an issue on GitHub
- Contact: [Audiogami Support](mailto:support@audiogami.com)

---

**Built with ❤️ for Audiogami** | **Powered by React + Vite + Tailwind CSS**
