import { useState, useEffect } from 'react';
import { LanguageProvider } from './hooks/useLanguage';
import { storage, generateSeedTickets } from './utils/storage';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './screens/Home';
import Recording from './screens/Recording';
import Validate from './screens/Validate';
import Confirmation from './screens/Confirmation';
import Dashboard from './screens/Dashboard';

function AppContent() {
  // State machine for screen navigation
  const [screen, setScreen] = useState('home'); // 'home', 'recording', 'validate', 'confirmation', 'dashboard'
  const [useCaseId, setUseCaseId] = useState(null);
  const [sessionData, setSessionData] = useState({
    detectedFields: {},
    transcript: '',
    ticketData: {},
  });

  useEffect(() => {
    // Initialize seed data if no tickets exist
    const tickets = storage.getTickets();
    if (tickets.length === 0) {
      const seedTickets = generateSeedTickets();
      storage.seedData(seedTickets);
    }
  }, []);

  // Navigation handlers
  const goToHome = () => {
    setScreen('home');
    setUseCaseId(null);
    setSessionData({ detectedFields: {}, transcript: '', ticketData: {} });
  };

  const goToRecording = (selectedUseCaseId) => {
    setScreen('recording');
    setUseCaseId(selectedUseCaseId);
    setSessionData({ detectedFields: {}, transcript: '', ticketData: {} });
  };

  const goToValidate = (detectedFields, transcript) => {
    setScreen('validate');
    setSessionData(prev => ({
      ...prev,
      detectedFields,
      transcript,
    }));
  };

  const goToConfirmation = (ticketData) => {
    setScreen('confirmation');
    setSessionData(prev => ({
      ...prev,
      ticketData,
    }));
  };

  const goToDashboard = () => {
    setScreen('dashboard');
  };

  const goBack = () => {
    if (screen === 'recording') {
      goToHome();
    } else if (screen === 'validate') {
      setScreen('recording');
    } else if (screen === 'confirmation') {
      setScreen('validate');
    } else if (screen === 'dashboard') {
      goToHome();
    }
  };

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <Home
            onSelectUseCase={goToRecording}
            onGoToDashboard={goToDashboard}
          />
        );

      case 'recording':
        return (
          <Recording
            useCaseId={useCaseId}
            onComplete={goToValidate}
            onBack={goToHome}
          />
        );

      case 'validate':
        return (
          <Validate
            useCaseId={useCaseId}
            detectedFields={sessionData.detectedFields}
            transcript={sessionData.transcript}
            onValidate={goToConfirmation}
            onBack={goBack}
          />
        );

      case 'confirmation':
        return (
          <Confirmation
            useCaseId={useCaseId}
            ticketData={sessionData.ticketData}
            onCreateAnother={goToHome}
            onViewAllTickets={goToDashboard}
            onBack={goBack}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            onBack={goToHome}
          />
        );

      default:
        return <Home onSelectUseCase={goToRecording} onGoToDashboard={goToDashboard} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {renderScreen()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
