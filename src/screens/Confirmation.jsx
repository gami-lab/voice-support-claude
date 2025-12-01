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
      [Priority.CRITICAL]: 'bg-red-100 text-red-800 border-red-200',
      [Priority.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
      [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [Priority.LOW]: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (ticketId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('ticketCreated')}
          </h2>
          <p className="text-gray-600 mb-2">Ticket ID: <span className="font-mono font-semibold">{ticketId}</span></p>
          {email && (
            <p className="text-gray-600 mb-6">
              A confirmation email has been sent to <span className="font-semibold">{email}</span>
            </p>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
            >
              Create Another Ticket
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              {t('viewAllTickets')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
      >
        ← Back
      </button>

      {/* Ticket Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <span>{config.icon}</span>
          {t('ticketSummary')}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-600">{t('category')}</span>
            <div className="font-semibold text-gray-800">{t(ticketData.category)}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">{t('priority')}</span>
            <div>
              <span className={`inline-block px-3 py-1 rounded-lg border font-semibold ${getPriorityColor(ticketData.priority)}`}>
                {t(ticketData.priority)}
              </span>
            </div>
          </div>
        </div>

        {ticketData.tags && ticketData.tags.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-600 block mb-2">{t('tags')}</span>
            <div className="flex flex-wrap gap-2">
              {ticketData.tags.map(tag => (
                <span key={tag} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium">
                  {t(tag)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Show key fields */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          {Object.entries(ticketData)
            .filter(([key]) => !['use_case', 'status', 'priority', 'category', 'tags', 'language', 'raw_transcript'].includes(key))
            .filter(([, value]) => value)
            .slice(0, 5)
            .map(([key, value]) => (
              <div key={key} className="mb-3">
                <span className="text-sm font-semibold text-gray-700">{t(key)}:</span>
                <p className="text-gray-600">{Array.isArray(value) ? value.join(', ') : value}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Available Agents */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('availableAgents')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent, idx) => (
            <div
              key={agent.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                idx === 0 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{agent.avatar}</div>
                <div className="font-semibold text-gray-800">{agent.name}</div>
                <div className="text-sm text-gray-600">{agent.specialty[language]}</div>
              </div>
              {idx === 0 && (
                <div className="text-center">
                  <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    {t('estimatedTime')}: {estimatedTime} {t('minutes')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Useful Articles */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('usefulArticles')}</h3>
        <div className="space-y-3">
          {config.knowledgeBase[language].map((article, idx) => (
            <a
              key={idx}
              href="#"
              className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <span className="text-gray-700 hover:text-indigo-600">{article}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Email and Send */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('emailOptional')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        <div className="flex gap-4">
          <button
            onClick={() => handleSend(false)}
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            {t('send')}
          </button>
          {email && (
            <button
              onClick={() => handleSend(true)}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              {t('sendWithEmail')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
