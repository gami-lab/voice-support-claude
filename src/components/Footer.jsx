import { useLanguage } from '../hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-off-white border-t border-light-gray py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm font-body text-slate">{t('poweredBy')}</p>
      </div>
    </footer>
  );
};

export default Footer;
