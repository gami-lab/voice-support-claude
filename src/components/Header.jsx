import { useLanguage } from '../hooks/useLanguage';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-white border-b border-light-gray shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎙️</div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">{t('voiceSupportDemo')}</h1>
        </div>

        <button
          onClick={toggleLanguage}
          className="bg-rockman-blue hover:bg-joust-blue transition-colors px-4 py-2 rounded-audiogami font-body font-semibold text-white flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
          <span>{language === 'fr' ? 'FR' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
