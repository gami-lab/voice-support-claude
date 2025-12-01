import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { storage } from '../utils/storage';
import { Status, Priority, UseCases } from '../data/enums';
import { useCaseConfig } from '../data/useCases';

const Dashboard = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [useCaseFilter, setUseCaseFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter, useCaseFilter]);

  const loadTickets = () => {
    const allTickets = storage.getTickets();
    setTickets(allTickets);
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.id.toLowerCase().includes(searchLower) ||
          Object.values(ticket).some(value =>
            String(value).toLowerCase().includes(searchLower)
          )
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Use case filter
    if (useCaseFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.use_case === useCaseFilter);
    }

    // Sort by created_at desc
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredTickets(filtered);
  };

  const getStatusCounts = () => {
    const counts = {};
    Object.values(Status).forEach(status => {
      counts[status] = tickets.filter(t => t.status === status).length;
    });
    return counts;
  };

  const getCategoryCounts = () => {
    const counts = {};
    tickets.forEach(ticket => {
      const category = ticket.category || 'other';
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
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

  const getStatusColor = (status) => {
    const colors = {
      [Status.NEW]: 'bg-blue-100 text-blue-800',
      [Status.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [Status.WAITING_CUSTOMER]: 'bg-yellow-100 text-yellow-800',
      [Status.RESOLVED]: 'bg-green-100 text-green-800',
      [Status.CLOSED]: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const exportCSV = () => {
    const headers = ['ID', 'Created At', 'Use Case', 'Status', 'Priority', 'Category'];
    const rows = filteredTickets.map(ticket => [
      ticket.id,
      new Date(ticket.created_at).toLocaleString(),
      ticket.use_case,
      ticket.status,
      ticket.priority,
      ticket.category,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets_${Date.now()}.csv`;
    a.click();
  };

  const statusCounts = getStatusCounts();
  const categoryCounts = getCategoryCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('dashboard')}</h1>
          <p className="text-gray-600">{tickets.length} {t('allTickets')}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
        >
          + New Ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg shadow p-4">
            <div className={`text-sm font-semibold mb-1 ${getStatusColor(status)} inline-block px-2 py-1 rounded`}>
              {t(status)}
            </div>
            <div className="text-2xl font-bold text-gray-800">{count}</div>
          </div>
        ))}
      </div>

      {/* Category Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('byCategory')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="text-lg font-bold text-gray-800">{count}</div>
              <div className="text-sm text-gray-600">{t(category)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search')}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All</option>
              {Object.values(Status).map(status => (
                <option key={status} value={status}>{t(status)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Case
            </label>
            <select
              value={useCaseFilter}
              onChange={(e) => setUseCaseFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All</option>
              {Object.values(UseCases).map(useCase => (
                <option key={useCase} value={useCase}>
                  {useCaseConfig[useCase]?.name[language]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <button
              onClick={exportCSV}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              {t('exportCSV')}
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Use Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('priority')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('created_at')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {ticket.id.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{useCaseConfig[ticket.use_case]?.icon}</span>
                      <span className="text-sm text-gray-900">
                        {useCaseConfig[ticket.use_case]?.name[language]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(ticket.status)}`}>
                      {t(ticket.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${getPriorityColor(ticket.priority)}`}>
                      {t(ticket.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {t(ticket.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.created_at).toLocaleDateString()} {new Date(ticket.created_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tickets found
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Ticket Details
                  </h2>
                  <p className="text-sm text-gray-600 font-mono">{selectedTicket.id}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedTicket)
                  .filter(([key]) => !['id', 'raw_transcript'].includes(key))
                  .map(([key, value]) => {
                    if (!value) return null;

                    return (
                      <div key={key} className="border-b border-gray-200 pb-3">
                        <div className="text-sm font-semibold text-gray-700 mb-1">
                          {t(key)}
                        </div>
                        <div className="text-gray-600">
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-2">
                              {value.map((item, idx) => (
                                <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {t(item) || item}
                                </span>
                              ))}
                            </div>
                          ) : typeof value === 'string' && value.length > 50 ? (
                            <div className="whitespace-pre-wrap">{value}</div>
                          ) : (
                            <span>{t(value) || value}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
