import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCaseConfig, agents } from '../data/useCases';
import { storage } from '../utils/storage';
import { Priority } from '../data/enums';

const Confirmation = () => {
  const { useCaseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();

  const config = useCaseConfig[useCaseId];
  const ticketData = location.state?.ticketData || {};

  const [email, setEmail] = useState('');
  const [ticketId, setTicketId] = useState(null);

  // Calculate estimated time based on priority
  const getEstimatedTime = (priority) => {
    const times = {
      [Priority.CRITICAL]: [10, 20],
      [Priority.HIGH]: [20, 30],
      [Priority.MEDIUM]: [30, 40],
      [Priority.LOW]: [35, 45],
    };
    const range = times[priority] || [20, 40];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  };

  const estimatedTime = getEstimatedTime(ticketData.priority);

  const handleSend = (withEmail = false) => {
    const finalTicket = {
      ...ticketData,
      email: withEmail ? email : undefined,
    };

    const savedTicket = storage.saveTicket(finalTicket);
    setTicketId(savedTicket.id);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      [Priority.CRITICAL]: 'bg-primary text-white border-primary',
      [Priority.HIGH]: 'bg-chunky-bee text-charcoal border-chunky-bee',
      [Priority.MEDIUM]: 'bg-rockman-blue text-white border-rockman-blue',
      [Priority.LOW]: 'bg-off-white text-slate border-light-gray',
    };
    return colors[priority] || 'bg-off-white text-slate border-light-gray';
  };

  if (ticketId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-heading font-bold text-charcoal mb-4">
              {t('ticketCreated')}
            </h2>
            <p className="font-body text-slate mb-2">Ticket ID: <span className="font-mono font-semibold text-rockman-blue">{ticketId}</span></p>
            {email && (
              <p className="font-body text-slate mb-6">
                A confirmation email has been sent to <span className="font-semibold text-charcoal">{email}</span>
              </p>
            )}

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-primary hover:bg-chunky-bee text-white rounded-audiogami font-body font-semibold transition-colors shadow-sm"
              >
                Create Another Ticket
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-white border border-light-gray hover:border-rockman-blue text-slate rounded-audiogami font-body font-semibold transition-colors"
              >
                {t('viewAllTickets')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-rockman-blue hover:text-joust-blue flex items-center gap-2 font-body transition-colors"
        >
          ← Back
        </button>

        {/* Ticket Summary */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-4 flex items-center gap-3">
            <span>{config.icon}</span>
            {t('ticketSummary')}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-body text-slate">{t('category')}</span>
              <div className="font-body font-semibold text-charcoal">{t(ticketData.category)}</div>
            </div>
            <div>
              <span className="text-sm font-body text-slate">{t('priority')}</span>
              <div>
                <span className={`inline-block px-3 py-1 rounded-audiogami border font-body font-semibold ${getPriorityColor(ticketData.priority)}`}>
                  {t(ticketData.priority)}
                </span>
              </div>
            </div>
          </div>

          {ticketData.tags && ticketData.tags.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-body text-slate block mb-2">{t('tags')}</span>
              <div className="flex flex-wrap gap-2">
                {ticketData.tags.map(tag => (
                  <span key={tag} className="bg-rockman-blue text-white px-3 py-1 rounded-audiogami text-sm font-body font-medium">
                    {t(tag)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Show key fields */}
          <div className="mt-4 pt-4 border-t border-light-gray">
            {Object.entries(ticketData)
              .filter(([key]) => !['use_case', 'status', 'priority', 'category', 'tags', 'language', 'raw_transcript'].includes(key))
              .filter(([, value]) => value)
              .slice(0, 5)
              .map(([key, value]) => (
                <div key={key} className="mb-3">
                  <span className="text-sm font-body font-semibold text-charcoal">{t(key)}:</span>
                  <p className="font-body text-slate">{Array.isArray(value) ? value.join(', ') : value}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Available Agents */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <h3 className="text-xl font-heading font-bold text-charcoal mb-4">{t('availableAgents')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent, idx) => (
              <div
                key={agent.id}
                className={`border-2 rounded-audiogami p-4 transition-all ${
                  idx === 0 ? 'border-rockman-blue bg-white' : 'border-light-gray bg-white'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{agent.avatar}</div>
                  <div className="font-body font-semibold text-charcoal">{agent.name}</div>
                  <div className="text-sm font-body text-slate">{agent.specialty[language]}</div>
                </div>
                {idx === 0 && (
                  <div className="text-center">
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-audiogami text-sm font-body font-semibold">
                      {t('estimatedTime')}: {estimatedTime} {t('minutes')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Useful Articles */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <h3 className="text-xl font-heading font-bold text-charcoal mb-4">{t('usefulArticles')}</h3>
          <div className="space-y-3">
            {config.knowledgeBase[language].map((article, idx) => (
              <a
                key={idx}
                href="#"
                className="block p-3 bg-white border border-light-gray hover:border-rockman-blue rounded-audiogami transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <span className="font-body text-slate hover:text-rockman-blue">{article}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Email and Send */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6">
          <label className="block text-sm font-body font-medium text-slate mb-2">
            {t('emailOptional')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full border border-light-gray rounded-audiogami px-4 py-2 mb-4 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
          />

          <div className="flex gap-4">
            <button
              onClick={() => handleSend(false)}
              className="flex-1 px-6 py-3 bg-primary hover:bg-chunky-bee text-white rounded-audiogami font-body font-semibold transition-colors shadow-sm"
            >
              {t('send')}
            </button>
            {email && (
              <button
                onClick={() => handleSend(true)}
                className="flex-1 px-6 py-3 bg-rockman-blue hover:bg-joust-blue text-white rounded-audiogami font-body font-semibold transition-colors shadow-sm"
              >
                {t('sendWithEmail')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
