import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
import { useEffect } from 'react';
import { storage, generateSeedTickets } from './utils/storage';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './screens/Home';
import Recording from './screens/Recording';
import Validate from './screens/Validate';
import Confirmation from './screens/Confirmation';
import Dashboard from './screens/Dashboard';

function AppContent() {
  useEffect(() => {
    // Initialize seed data if no tickets exist
    const tickets = storage.getTickets();
    if (tickets.length === 0) {
      const seedTickets = generateSeedTickets();
      storage.seedData(seedTickets);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recording/:useCaseId" element={<Recording />} />
          <Route path="/validate/:useCaseId" element={<Validate />} />
          <Route path="/confirmation/:useCaseId" element={<Confirmation />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}

export default App;
