# Changelog

All notable changes to the Audiogami Voice Support Demo App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-02

### Added

#### Real-time Question-Answer Alignment
- **Question-to-Field Mapping**: Added `questionFieldMapping` to each use case configuration
  - Maps each question to its associated field names (e.g., Question 1 → `device`, Question 2 → `symptoms`, `impact`)
  - Enables intelligent grouping of detected answers with their corresponding questions

- **Inline Answer Display**: Answers now appear directly beneath their questions
  - Answered questions highlighted with blue border and checkmark
  - Unanswered questions remain gray
  - Clean, organized layout replacing separate questions/answers sections

- **Progressive Real-time Detection**: Answers populate dynamically during transcription
  - Field detection happens progressively as transcript text appears
  - Visual feedback with smooth fade-in animations
  - Users see information being extracted in real-time

- **Dynamic Question Reordering**: Questions automatically reorder based on answer status
  - Answered questions rise to the top
  - Unanswered questions stay at the bottom
  - Natural flow matches user's mental model

### Changed

#### True Single-Page Application Architecture
- **Removed React Router**: Eliminated `react-router-dom` dependency (191 packages instead of 195)
  - No more `BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`, or `useLocation`
  - Simpler codebase with fewer abstractions

- **State Machine Navigation**: Centralized navigation logic in `App.jsx`
  - Screen state: `'home' | 'recording' | 'validate' | 'confirmation' | 'dashboard'`
  - Session data managed in React state
  - Direct prop passing instead of router state

- **Component Refactoring**: All screens now use callbacks and props
  - `Home`: `onSelectUseCase`, `onGoToDashboard`
  - `Recording`: `useCaseId`, `onComplete`, `onBack`
  - `Validate`: `useCaseId`, `detectedFields`, `transcript`, `onValidate`, `onBack`
  - `Confirmation`: `useCaseId`, `ticketData`, `onCreateAnother`, `onViewAllTickets`, `onBack`
  - `Dashboard`: `onBack`

- **Single URL**: Application stays on `/` throughout entire user journey
  - No URL changes during navigation
  - No deep linking support (intentional for this demo)
  - No browser history entries (F5 always returns to home)

### Benefits

#### User Experience
- **Better Visual Hierarchy**: Questions and answers are visually paired, reducing cognitive load
- **Real-time Feedback**: Users see AI working in real-time as answers populate
- **Clear Progress**: Answered vs unanswered questions are immediately apparent
- **Natural Flow**: Answered questions naturally rise to prominence

#### Developer Experience
- **Simpler Architecture**: State machine is easier to understand than router configuration
- **Direct Data Flow**: Props and callbacks are more explicit than router state
- **Fewer Dependencies**: 4 fewer packages to maintain and update
- **Easier Debugging**: Navigation logic in one place instead of spread across routes

#### Technical
- **Reduced Bundle Size**: Smaller production build without router code
- **No Route Conflicts**: No URL parsing or matching logic
- **Embedded-Friendly**: Works better in iframes or as embedded widgets
- **Stateful Navigation**: Easy to preserve state across navigation

### Technical Details

#### Files Modified
- `src/App.jsx`: Added state machine for screen management
- `src/screens/Home.jsx`: Accepts `onSelectUseCase`, `onGoToDashboard` callbacks
- `src/screens/Recording.jsx`: Accepts `useCaseId`, `onComplete`, `onBack` props
- `src/screens/Validate.jsx`: Accepts `useCaseId`, `detectedFields`, `transcript`, `onValidate`, `onBack`
- `src/screens/Confirmation.jsx`: Accepts `useCaseId`, `ticketData`, `onCreateAnother`, `onViewAllTickets`, `onBack`
- `src/screens/Dashboard.jsx`: Accepts `onBack` callback
- `src/data/useCases.js`: Added `questionFieldMapping` to all use cases
- `package.json`: Removed `react-router-dom` dependency

#### Dependencies Removed
- `react-router-dom`: ^7.1.1 (and its sub-dependencies)

### Trade-offs

#### What We Gained
✅ Simpler architecture
✅ Better question-answer UX
✅ Real-time visual feedback
✅ Fewer dependencies
✅ Direct state management
✅ Embedded-friendly

#### What We Lost
❌ Deep linking (can't share direct URLs to specific screens)
❌ Browser back button (F5 always goes to home)
❌ URL-based bookmarking
❌ Analytics URL tracking

**Note**: For a demo/prototype application, the trade-offs heavily favor the SPA approach.

---

## [1.0.0] - 2025-12-01

### Added

#### Core Features
- Single-page application built with React + Vite
- Four distinct use cases with unique workflows:
  - IT Support (PC Expert Support) - Gaming PC retailer support
  - E-commerce (ShoeShop Support) - Online shoe store support
  - SaaS (CRM Helper) - CRM software support
  - Dev Portal (DevPortal Feedback) - Developer portal feedback system

#### Voice Simulation System
- Two-pass voice transcription simulation with typewriter effect (40ms per character)
- Progressive field extraction during transcription
- Automatic detection of missing fields after first pass
- Smart prompt generation for second pass based on missing data
- Smooth auto-transition to validation after completing both passes

#### Bilingual Support (FR/EN)
- Complete French and English translations for all UI elements
- Persistent language switcher in header
- Context-aware translations for enums and field labels
- Separate transcription datasets for both languages
- Original ticket content preserved in user's language

#### Data Models & Enums
- Status enum: `new`, `in_progress`, `waiting_customer`, `resolved`, `closed`
- Priority enum: `critical`, `high`, `medium`, `low`
- Use case-specific categories:
  - IT Support: hardware, software, network, peripheral, other
  - E-commerce: delivery, product_defect, wrong_item, refund, other
  - SaaS: bug, feature_request, access_issue, performance, other
  - Dev Portal: bug, enhancement, new_feature, documentation, other
- Common tags: urgent, recurring, first_contact, escalation, vip_customer, workaround_available

#### User Workflows

**Screen 1 - Home**
- Hero section with app description
- Visual 3-step process indicator (Speak → Verify → Send)
- 4 interactive use case cards with hover effects
- Direct link to dashboard

**Screen 2 - Recording Simulation**
- Use case header with icon and context
- Display of 3 key questions per use case
- Visual microphone button with pulsing animation
- Progressive transcription display with typewriter effect
- Real-time field extraction and display
- Missing fields indicator
- Contextual prompts for second pass

**Screen 3 - HITL Validation**
- Comprehensive editable form with all ticket fields
- Required vs optional field grouping
- Auto-detected fields (category, priority, status)
- Tag selection with chip-based UI
- Form completion status indicator
- Voice completion option (returns to recording)

**Screen 4 - Confirmation**
- Ticket summary with color-coded priority badges
- Available agents display with avatars
- Estimated response time (10-45 min based on priority)
- 3 relevant knowledge base article suggestions per use case
- Optional email notification
- Success state with ticket ID
- Quick navigation to create another ticket or view dashboard

#### Back-office Dashboard
- Real-time statistics cards by status
- Category breakdown visualization
- Advanced filtering:
  - Full-text search across all ticket fields
  - Status filter dropdown
  - Use case filter dropdown
- Sortable ticket table with columns:
  - Ticket ID (truncated with ellipsis)
  - Use case (with icon)
  - Status (color-coded badge)
  - Priority (color-coded badge)
  - Category
  - Created timestamp
- Click-to-expand ticket detail modal with full field display
- CSV export functionality for filtered results

#### Data Management
- LocalStorage-based persistence (no backend required)
- Automatic UUID generation for tickets
- ISO 8601 timestamp tracking
- 6 pre-seeded sample tickets covering all use cases:
  - 2 IT Support tickets (critical hardware, urgent peripheral)
  - 2 E-commerce tickets (delivery issue, wrong item)
  - 1 SaaS ticket (critical PDF export bug)
  - 1 Dev Portal ticket (critical duplicate save bug)
- Automatic seed data initialization on first load

#### Sample Transcriptions
- 2 complete examples per use case (8 total)
- Each example includes:
  - Pass 1 transcript with partial field mapping
  - List of missing required fields
  - Contextual prompt for pass 2 (bilingual)
  - Pass 2 transcript with complete field mapping
  - Priority upgrades based on urgency
  - Auto-assigned tags based on content

#### UI/UX Enhancements
- Gradient header (indigo to purple)
- Responsive design (mobile-first with Tailwind CSS)
- Custom animations:
  - Fade-in for detected fields
  - Pulse animation for recording state
  - Progress bar with color transitions (gray → yellow → green)
  - Smooth transitions for all interactive elements
- Color-coded priority badges:
  - Critical: Red
  - High: Orange
  - Medium: Yellow
  - Low: Green
- Custom scrollbar styling
- Professional color palette
- Accessible contrast ratios
- Hover states and focus indicators

#### Technical Implementation
- React Router for client-side navigation
- Custom language context hook
- Modular component architecture
- Separation of concerns (screens, components, data, utils)
- Production-optimized build with Vite
- PostCSS with Tailwind CSS v4
- ESLint configuration
- Hot Module Replacement (HMR) in development

### Technical Details

#### Dependencies
- react ^19.0.0
- react-dom ^19.0.0
- react-router-dom ^7.1.1
- @supabase/supabase-js ^2.48.1 (future backend integration)

#### Dev Dependencies
- vite ^7.2.6
- @vitejs/plugin-react ^4.3.4
- tailwindcss ^4.0.0
- @tailwindcss/postcss ^4.0.0
- postcss ^8.4.49
- autoprefixer ^10.4.20
- eslint ^9.17.0

#### Browser Support
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Responsive breakpoints: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)

### Project Structure
```
voice-support-claude/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.jsx    # App header with language switcher
│   │   └── Footer.jsx    # App footer with branding
│   ├── screens/          # Page-level components
│   │   ├── Home.jsx      # Use case selection screen
│   │   ├── Recording.jsx # Voice simulation screen
│   │   ├── Validate.jsx  # HITL validation form
│   │   ├── Confirmation.jsx  # Ticket confirmation & submission
│   │   └── Dashboard.jsx # Back-office ticket management
│   ├── data/             # Static data and configurations
│   │   ├── enums.js      # Status, priority, category, tag enums
│   │   ├── transcriptions.js  # Sample voice transcripts (FR/EN)
│   │   ├── useCases.js   # Use case configs, questions, KB articles
│   │   └── translations.js    # UI translation strings (FR/EN)
│   ├── hooks/            # Custom React hooks
│   │   └── useLanguage.jsx    # Language context and switcher
│   ├── utils/            # Utility functions
│   │   └── storage.js    # LocalStorage wrapper and seed data
│   ├── App.jsx           # Main app with routing
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles and animations
├── public/               # Static assets
├── dist/                 # Production build output
├── README.md             # Project documentation
├── CHANGELOG.md          # This file
├── package.json          # NPM dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── eslint.config.js      # ESLint rules

```

### Performance Optimizations
- Vite for fast builds and HMR
- Code splitting by route
- Lazy loading of components
- Optimized bundle size (~90KB gzipped)
- Minimal re-renders with proper React hooks usage
- LocalStorage for instant data access

### Known Limitations
- Phase 1: No real SDK integration (simulation only)
- No actual voice recording (uses pre-recorded transcripts)
- No backend API (localStorage only)
- No authentication/authorization
- No real-time updates
- Limited to 2 examples per use case
- CSV export downloads locally (no server-side processing)

### Future Enhancements (Planned for Phase 2)
- Real Audiogami SDK integration
- Actual voice recording and processing
- Supabase backend integration
- User authentication
- Real-time collaboration
- Email notifications
- Webhook integrations
- Analytics dashboard
- Multi-language support (beyond FR/EN)
- Mobile app version
- Embeddable widget for third-party sites

---

## Development Notes

### Build Information
- Build tool: Vite v7.2.6
- React version: 19.0.0
- Target: ES2020
- Output format: ESM
- CSS processing: Tailwind CSS v4 + PostCSS

### Testing Coverage
- All 4 use cases tested with 2 examples each
- Both languages (FR/EN) validated
- All screens and navigation paths verified
- Responsive design tested on multiple viewports
- CSV export functionality verified
- LocalStorage persistence confirmed

### Git Information
- Repository: gami-lab/voice-support-claude
- Branch: claude/audiogami-demo-app-01KVzDDRoRpw7YrS8iYQXJsP
- Initial commit: 018039e
- Release date: 2025-12-01

---

**Built with ❤️ for Audiogami**
