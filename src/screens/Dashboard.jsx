import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { storage } from '../utils/storage';
import { Status, Priority, UseCases } from '../data/enums';
import { useCaseConfig } from '../data/useCases';

const Dashboard = ({ onBack }) => {
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
      [Priority.CRITICAL]: 'bg-primary text-white border-primary',
      [Priority.HIGH]: 'bg-chunky-bee text-charcoal border-chunky-bee',
      [Priority.MEDIUM]: 'bg-rockman-blue text-white border-rockman-blue',
      [Priority.LOW]: 'bg-off-white text-slate border-light-gray',
    };
    return colors[priority] || 'bg-off-white text-slate border-light-gray';
  };

  const getStatusColor = (status) => {
    const colors = {
      [Status.NEW]: 'bg-rockman-blue text-white',
      [Status.IN_PROGRESS]: 'bg-joust-blue text-white',
      [Status.WAITING_CUSTOMER]: 'bg-chunky-bee text-charcoal',
      [Status.RESOLVED]: 'bg-primary text-white',
      [Status.CLOSED]: 'bg-off-white text-slate',
    };
    return colors[status] || 'bg-off-white text-slate';
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">{t('dashboard')}</h1>
            <p className="font-body text-slate">{tickets.length} {t('allTickets')}</p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary hover:bg-chunky-bee text-white rounded-audiogami font-body font-semibold transition-colors shadow-sm"
          >
            + New Ticket
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4">
              <div className={`text-sm font-body font-semibold mb-1 ${getStatusColor(status)} inline-block px-2 py-1 rounded-audiogami`}>
                {t(status)}
              </div>
              <div className="text-2xl font-heading font-bold text-charcoal">{count}</div>
            </div>
          ))}
        </div>

        {/* Category Chart */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <h3 className="text-xl font-heading font-bold text-charcoal mb-4">{t('byCategory')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="bg-white border border-light-gray rounded-audiogami p-4">
                <div className="text-lg font-heading font-bold text-charcoal">{count}</div>
                <div className="text-sm font-body text-slate">{t(category)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-slate mb-2">
                {t('search')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search')}
                className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-slate mb-2">
                {t('status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
              >
                <option value="all">All</option>
                {Object.values(Status).map(status => (
                  <option key={status} value={status}>{t(status)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-slate mb-2">
                Use Case
              </label>
              <select
                value={useCaseFilter}
                onChange={(e) => setUseCaseFilter(e.target.value)}
                className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
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
              <label className="block text-sm font-body font-medium text-slate mb-2">
                Actions
              </label>
              <button
                onClick={exportCSV}
                className="w-full px-4 py-2 bg-white border border-light-gray hover:border-rockman-blue text-slate rounded-audiogami font-body font-semibold transition-colors"
              >
                {t('exportCSV')}
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-light-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-slate uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-slate uppercase tracking-wider">
                    Use Case
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-slate uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-slate uppercase tracking-wider">
                    {t('priority')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-slate uppercase tracking-wider">
                    {t('category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-slate uppercase tracking-wider">
                    {t('created_at')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-light-gray">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-off-white cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-body text-charcoal">
                      {ticket.id.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{useCaseConfig[ticket.use_case]?.icon}</span>
                        <span className="text-sm font-body text-charcoal">
                          {useCaseConfig[ticket.use_case]?.name[language]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-body font-semibold rounded-audiogami ${getStatusColor(ticket.status)}`}>
                        {t(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-body font-semibold rounded-audiogami border ${getPriorityColor(ticket.priority)}`}>
                        {t(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-body text-charcoal">
                      {t(ticket.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-body text-slate">
                      {new Date(ticket.created_at).toLocaleDateString()} {new Date(ticket.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12 font-body text-slate">
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
            className="bg-white border border-light-gray rounded-audiogami shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">
                    Ticket Details
                  </h2>
                  <p className="text-sm font-body font-mono text-rockman-blue">{selectedTicket.id}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-slate hover:text-charcoal text-2xl"
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
                      <div key={key} className="border-b border-light-gray pb-3">
                        <div className="text-sm font-body font-semibold text-charcoal mb-1">
                          {t(key)}
                        </div>
                        <div className="font-body text-slate">
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-2">
                              {value.map((item, idx) => (
                                <span key={idx} className="bg-rockman-blue text-white px-2 py-1 rounded-audiogami text-sm">
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
    </div>
  );
};

export default Dashboard;
