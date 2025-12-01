import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCaseConfig } from '../data/useCases';
import { UseCases } from '../data/enums';

const Home = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const handleSelectUseCase = (useCaseId) => {
    navigate(`/recording/${useCaseId}`);
  };

  const useCases = Object.values(UseCases);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {t('voiceSupportDemo')}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t('subtitle')}
        </p>

        {/* Steps Indicator */}
        <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg px-8 py-4">
          <div className="text-lg font-semibold text-indigo-700 mb-2">
            {t('threeSteps')}
          </div>
          <div className="flex gap-8 justify-center">
            <div className="text-center">
              <div className="text-2xl mb-1">🎤</div>
              <div className="text-sm text-gray-700">{t('step1')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">✓</div>
              <div className="text-sm text-gray-700">{t('step2')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📤</div>
              <div className="text-sm text-gray-700">{t('step3')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {t('selectUseCase')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCaseId) => {
            const config = useCaseConfig[useCaseId];
            return (
              <button
                key={useCaseId}
                onClick={() => handleSelectUseCase(useCaseId)}
                className="bg-white border-2 border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 rounded-xl p-8 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform">
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {config.name[language]}
                    </h4>
                    <p className="text-gray-600">
                      {config.context[language]}
                    </p>
                  </div>
                  <div className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Link */}
      <div className="text-center mt-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
        >
          {t('viewAllTickets')}
        </button>
      </div>
    </div>
  );
};

export default Home;
