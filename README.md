# Audiogami Demo App - Voice Support Tickets

A demonstration SPA showcasing how Audiogami transforms voice descriptions into structured support tickets with a Human-in-the-Loop (HITL) validation workflow.

## Features

- **4 Use Cases**: IT Support, E-commerce, SaaS, Developer Portal
- **Bilingual Support**: French and English (FR/EN)
- **Simulated Voice Processing**: Two-pass transcription with typewriter effect
- **HITL Validation**: Review and edit extracted information
- **Back-office Dashboard**: View, filter, and export tickets
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **LocalStorage** - Data persistence (no backend required)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Header.jsx
│   └── Footer.jsx
├── screens/          # Page components
│   ├── Home.jsx
│   ├── Recording.jsx
│   ├── Validate.jsx
│   ├── Confirmation.jsx
│   └── Dashboard.jsx
├── data/             # Data models and configurations
│   ├── enums.js
│   ├── transcriptions.js
│   ├── useCases.js
│   └── translations.js
├── hooks/            # Custom React hooks
│   └── useLanguage.jsx
├── utils/            # Utility functions
│   └── storage.js
└── App.jsx           # Main app component
```

## Use Cases

### 🖥️ IT Support - PC Expert Support
Gaming PC retailer support for hardware, software, and peripherals.

### 👟 E-commerce - ShoeShop Support
Online shoe store handling delivery, returns, and product issues.

### 📊 SaaS - CRM Helper
CRM software support for bugs, features, and performance issues.

### 💻 Dev Portal - DevPortal Feedback
Developer portal for bug reports, enhancements, and documentation.

## Workflow

1. **Select Use Case** - Choose from 4 different support scenarios
2. **Simulate Voice Input** - Two-pass transcription with progressive field extraction
3. **HITL Validation** - Review and complete extracted information
4. **Confirmation** - View summary, assign agent, and create ticket

## Data Persistence

The app uses localStorage for data persistence. Seed data is automatically generated on first load with 6 sample tickets.

## Language Support

Switch between French and English at any time using the language toggle in the header. All UI elements are translated, while ticket content remains in the original language.

## License

This is a demonstration project built for Audiogami.
