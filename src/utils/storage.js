// LocalStorage utility for ticket management
const STORAGE_KEY = 'audiogami_tickets';

export const storage = {
  // Get all tickets
  getTickets: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading tickets:', error);
      return [];
    }
  },

  // Get a single ticket by ID
  getTicket: (id) => {
    const tickets = storage.getTickets();
    return tickets.find(ticket => ticket.id === id);
  },

  // Save a new ticket
  saveTicket: (ticket) => {
    const tickets = storage.getTickets();
    const newTicket = {
      ...ticket,
      id: ticket.id || `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: ticket.created_at || new Date().toISOString(),
    };
    tickets.push(newTicket);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    return newTicket;
  },

  // Update an existing ticket
  updateTicket: (id, updates) => {
    const tickets = storage.getTickets();
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      return tickets[index];
    }
    return null;
  },

  // Delete a ticket
  deleteTicket: (id) => {
    const tickets = storage.getTickets();
    const filtered = tickets.filter(ticket => ticket.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Clear all tickets
  clearTickets: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Seed initial data
  seedData: (tickets) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  },
};

// Generate seed tickets
export const generateSeedTickets = () => {
  return [
    {
      id: 'seed_1',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
      use_case: 'it_support',
      status: 'in_progress',
      priority: 'critical',
      category: 'hardware',
      tags: ['urgent', 'recurring'],
      raw_transcript: 'PC gaming avec écran noir au lancement de jeux...',
      device: 'PC gaming avec RTX',
      symptoms: 'Écran noir au lancement de jeux, nécessite redémarrage',
      frequency: 'Systématique depuis hier, 100% des lancements',
      environment: 'Windows 11, drivers mis à jour via GeForce Experience',
      actions_tried: 'Mise à jour drivers, test autre écran',
      impact: 'Activité de streaming impossible',
      language: 'fr',
    },
    {
      id: 'seed_2',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      use_case: 'it_support',
      status: 'resolved',
      priority: 'high',
      category: 'peripheral',
      tags: ['urgent'],
      raw_transcript: 'Clavier sans fil ne fonctionne plus...',
      device: 'Clavier sans fil (Logitech ou Microsoft, gris)',
      symptoms: 'Touches ne répondent plus',
      frequency: 'Depuis ce matin, hier soir OK',
      environment: 'PC fixe Windows',
      actions_tried: 'Remplacement des piles',
      impact: 'Blocage pour le travail',
      language: 'fr',
    },
    {
      id: 'seed_3',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
      use_case: 'ecommerce',
      status: 'new',
      priority: 'high',
      category: 'delivery',
      tags: ['escalation'],
      raw_transcript: 'Baskets Nike non reçues malgré statut livré...',
      order_number: '78432',
      problem_type: 'Colis non reçu malgré statut "livré"',
      product_description: 'Baskets Nike blanches (Air Max ou Air Force)',
      delivery_status: 'Marqué livré sur Colissimo',
      actions_tried: 'Vérifié voisins et local poubelle + Tentative appel Colissimo (abandonné)',
      desired_resolution: 'Réexpédition prioritaire, sinon remboursement',
      purchase_date: 'Mi-novembre (15-16)',
      language: 'fr',
    },
    {
      id: 'seed_4',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
      use_case: 'ecommerce',
      status: 'in_progress',
      priority: 'critical',
      category: 'wrong_item',
      tags: ['urgent', 'vip_customer'],
      raw_transcript: 'Mauvaise taille de mocassins reçue...',
      order_number: '78501',
      problem_type: 'Mauvaise taille reçue (42 au lieu de 44)',
      product_description: 'Mocassins marron',
      delivery_status: 'Reçu lundi',
      desired_resolution: 'Échange taille 44, livraison avant samedi',
      impact: 'Nécessaire pour mariage ce week-end',
      language: 'fr',
    },
    {
      id: 'seed_5',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
      use_case: 'saas',
      status: 'waiting_customer',
      priority: 'critical',
      category: 'bug',
      tags: ['urgent', 'recurring'],
      raw_transcript: 'Export PDF des rapports plante...',
      feature: 'Export rapports PDF',
      symptoms: 'Plantage après chargement, erreur affichée',
      impact: 'Équipe commerciale bloquée, réunion direction demain',
      frequency: 'Quand plus de 100 lignes',
      environment: 'Chrome dernière version, Windows 11 (majoritaire)',
      steps_to_reproduce: 'Rapports → Ventes Q4 → Exporter PDF → timeout ~30s',
      language: 'fr',
    },
    {
      id: 'seed_6',
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      use_case: 'dev_portal',
      status: 'new',
      priority: 'critical',
      category: 'bug',
      tags: ['urgent'],
      raw_transcript: 'Double-clic sur Sauvegarder crée des doublons...',
      request_type: 'Bug',
      description: 'Double-clic Sauvegarder crée des doublons',
      context: 'Plusieurs fois cette semaine',
      urgency: 'Urgent (nettoyage manuel coûteux)',
      expected_behavior: 'Bouton grisé ou second clic ignoré',
      language: 'fr',
    },
  ];
};
