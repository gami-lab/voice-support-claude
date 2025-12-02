// Storage utility with Supabase + localStorage fallback
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'audiogami_tickets';
const USE_SUPABASE = isSupabaseConfigured();

// ============================================
// SUPABASE OPERATIONS
// ============================================

const supabaseStorage = {
  // Get all tickets
  getTickets: async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tickets from Supabase:', error);
      return [];
    }
  },

  // Get a single ticket by ID
  getTicket: async (id) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching ticket from Supabase:', error);
      return null;
    }
  },

  // Save a new ticket
  saveTicket: async (ticket) => {
    try {
      const newTicket = {
        ...ticket,
        id: ticket.id || `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: ticket.created_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert([newTicket])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving ticket to Supabase:', error);
      throw error;
    }
  },

  // Update an existing ticket
  updateTicket: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating ticket in Supabase:', error);
      return null;
    }
  },

  // Delete a ticket
  deleteTicket: async (id) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting ticket from Supabase:', error);
      return false;
    }
  },

  // Clear all tickets (dangerous - use with caution)
  clearTickets: async () => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .neq('id', ''); // Delete all

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing tickets from Supabase:', error);
      return false;
    }
  },
};

// ============================================
// LOCALSTORAGE OPERATIONS (FALLBACK)
// ============================================

const localStorageStorage = {
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
    const tickets = localStorageStorage.getTickets();
    return tickets.find(ticket => ticket.id === id);
  },

  // Save a new ticket
  saveTicket: (ticket) => {
    const tickets = localStorageStorage.getTickets();
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
    const tickets = localStorageStorage.getTickets();
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
    const tickets = localStorageStorage.getTickets();
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

// ============================================
// UNIFIED STORAGE INTERFACE
// ============================================

export const storage = USE_SUPABASE ? supabaseStorage : localStorageStorage;

// Export storage type for debugging
export const storageType = USE_SUPABASE ? 'supabase' : 'localStorage';

console.log(`[Storage] Using ${storageType} for data persistence`);

// ============================================
// SEED DATA GENERATOR
// ============================================

export const generateSeedTickets = () => {
  return [
    {
      id: 'seed_1',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
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
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
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
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
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
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
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
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
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
      created_at: new Date(Date.now() - 3600000).toISOString(),
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

