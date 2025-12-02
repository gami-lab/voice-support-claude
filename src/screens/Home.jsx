import { useLanguage } from '../hooks/useLanguage';
import { useCaseConfig } from '../data/useCases';
import { UseCases } from '../data/enums';

const Home = ({ onSelectUseCase, onGoToDashboard }) => {
  const { language, t } = useLanguage();

  const useCases = Object.values(UseCases);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-charcoal mb-4">
            {t('voiceSupportDemo')}
          </h2>
          <p className="text-xl font-body text-slate mb-8">
            {t('subtitle')}
          </p>

          {/* Steps Indicator */}
          <div className="inline-block bg-off-white border border-light-gray rounded-audiogami px-8 py-4 shadow-sm">
            <div className="text-lg font-heading font-semibold text-charcoal mb-2">
              {t('threeSteps')}
            </div>
            <div className="flex gap-8 justify-center">
              <div className="text-center">
                <div className="text-2xl mb-1">🎤</div>
                <div className="text-sm font-body text-slate">{t('step1')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✓</div>
                <div className="text-sm font-body text-slate">{t('step2')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📤</div>
                <div className="text-sm font-body text-slate">{t('step3')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-heading font-semibold text-charcoal mb-6 text-center">
            {t('selectUseCase')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCaseId) => {
              const config = useCaseConfig[useCaseId];
              return (
                <button
                  key={useCaseId}
                  onClick={() => onSelectUseCase(useCaseId)}
                  className="bg-off-white border-2 border-light-gray hover:border-rockman-blue hover:shadow-lg transition-all duration-300 rounded-audiogami p-8 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform">
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-heading font-bold text-charcoal mb-2 group-hover:text-rockman-blue transition-colors">
                        {config.name[language]}
                      </h4>
                      <p className="font-body text-slate">
                        {config.context[language]}
                      </p>
                    </div>
                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xl">
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
            onClick={onGoToDashboard}
            className="text-rockman-blue hover:text-joust-blue font-body font-semibold underline transition-colors"
          >
            {t('viewAllTickets')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
