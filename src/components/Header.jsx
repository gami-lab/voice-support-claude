import { useLanguage } from '../hooks/useLanguage';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎙️</div>
          <h1 className="text-2xl font-bold">{t('voiceSupportDemo')}</h1>
        </div>

        <button
          onClick={toggleLanguage}
          className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <span className="text-lg">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
          <span>{language === 'fr' ? 'FR' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
