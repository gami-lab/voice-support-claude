import { useLanguage } from '../hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
        <p className="text-sm">{t('poweredBy')}</p>
      </div>
    </footer>
  );
};

export default Footer;
