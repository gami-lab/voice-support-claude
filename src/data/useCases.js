import { UseCases, Categories } from './enums';

// Use case configurations
export const useCaseConfig = {
  [UseCases.IT_SUPPORT]: {
    id: UseCases.IT_SUPPORT,
    icon: '🖥️',
    name: {
      fr: 'PC Expert Support',
      en: 'PC Expert Support',
    },
    context: {
      fr: 'Vendeur de PC gaming',
      en: 'Gaming PC retailer',
    },
    questions: {
      fr: [
        'Quel appareil ou composant pose problème ?',
        'Que se passe-t-il exactement ?',
        'Depuis quand et à quelle fréquence ?',
      ],
      en: [
        'Which device or component is having issues?',
        'What exactly is happening?',
        'Since when and how often?',
      ],
    },
    // Map question index to field names
    questionFieldMapping: [
      ['device'],
      ['symptoms', 'impact'],
      ['frequency', 'environment', 'actions_tried'],
    ],
    fields: [
      { name: 'device', required: true, type: 'text' },
      { name: 'symptoms', required: true, type: 'text' },
      { name: 'frequency', required: true, type: 'text' },
      { name: 'environment', required: false, type: 'text' },
      { name: 'actions_tried', required: false, type: 'text' },
      { name: 'impact', required: false, type: 'text' },
      { name: 'category', required: false, type: 'enum', auto: true },
      { name: 'priority', required: false, type: 'enum', auto: true },
    ],
    categories: Categories.it_support,
    knowledgeBase: {
      fr: [
        'Comment mettre à jour vos drivers graphiques',
        'Résoudre les problèmes de périphériques Bluetooth',
        'Diagnostic réseau : guide pas à pas',
      ],
      en: [
        'How to update your graphics drivers',
        'Troubleshoot Bluetooth peripherals',
        'Network diagnosis: step-by-step guide',
      ],
    },
  },
  [UseCases.ECOMMERCE]: {
    id: UseCases.ECOMMERCE,
    icon: '👟',
    name: {
      fr: 'ShoeShop Support',
      en: 'ShoeShop Support',
    },
    context: {
      fr: 'Magasin chaussures en ligne',
      en: 'Online shoe store',
    },
    questions: {
      fr: [
        'Quel est votre numéro de commande ?',
        'Quel problème rencontrez-vous ?',
        'Avez-vous déjà contacté le transporteur ?',
      ],
      en: [
        'What is your order number?',
        'What problem are you experiencing?',
        'Have you already contacted the carrier?',
      ],
    },
    // Map question index to field names
    questionFieldMapping: [
      ['order_number', 'purchase_date'],
      ['problem_type', 'product_description', 'desired_resolution'],
      ['delivery_status', 'actions_tried'],
    ],
    fields: [
      { name: 'order_number', required: true, type: 'text' },
      { name: 'problem_type', required: true, type: 'text' },
      { name: 'product_description', required: true, type: 'text' },
      { name: 'delivery_status', required: false, type: 'text' },
      { name: 'actions_tried', required: false, type: 'text' },
      { name: 'desired_resolution', required: false, type: 'text' },
      { name: 'purchase_date', required: false, type: 'text' },
      { name: 'category', required: false, type: 'enum', auto: true },
      { name: 'priority', required: false, type: 'enum', auto: true },
    ],
    categories: Categories.ecommerce,
    knowledgeBase: {
      fr: [
        'Suivre ma commande et signaler un problème de livraison',
        'Procédure de retour et échange',
        'Demander un remboursement',
      ],
      en: [
        'Track my order and report a delivery problem',
        'Return and exchange procedure',
        'Request a refund',
      ],
    },
  },
  [UseCases.SAAS]: {
    id: UseCases.SAAS,
    icon: '📊',
    name: {
      fr: 'CRM Helper',
      en: 'CRM Helper',
    },
    context: {
      fr: 'Support logiciel CRM',
      en: 'CRM software support',
    },
    questions: {
      fr: [
        'Quelle fonctionnalité est concernée ?',
        'Décrivez le comportement inattendu',
        'Quel est l\'impact sur votre travail ?',
      ],
      en: [
        'Which feature is affected?',
        'Describe the unexpected behavior',
        'What is the impact on your work?',
      ],
    },
    // Map question index to field names
    questionFieldMapping: [
      ['feature'],
      ['symptoms', 'steps_to_reproduce', 'frequency'],
      ['impact', 'environment'],
    ],
    fields: [
      { name: 'feature', required: true, type: 'text' },
      { name: 'symptoms', required: true, type: 'text' },
      { name: 'impact', required: true, type: 'text' },
      { name: 'environment', required: false, type: 'text' },
      { name: 'steps_to_reproduce', required: false, type: 'text' },
      { name: 'frequency', required: false, type: 'text' },
      { name: 'category', required: false, type: 'enum', auto: true },
      { name: 'priority', required: false, type: 'enum', auto: true },
    ],
    categories: Categories.saas,
    knowledgeBase: {
      fr: [
        'Résoudre les problèmes d\'export PDF',
        'Gestion des accès utilisateurs',
        'Optimiser les performances du CRM',
      ],
      en: [
        'Troubleshoot PDF export issues',
        'User access management',
        'Optimize CRM performance',
      ],
    },
  },
  [UseCases.DEV_PORTAL]: {
    id: UseCases.DEV_PORTAL,
    icon: '💻',
    name: {
      fr: 'DevPortal Feedback',
      en: 'DevPortal Feedback',
    },
    context: {
      fr: 'Portail client custom',
      en: 'Custom client portal',
    },
    questions: {
      fr: [
        'S\'agit-il d\'un bug, d\'une idée ou d\'une question ?',
        'Décrivez précisément la situation',
        'Quelle est l\'urgence pour vous ?',
      ],
      en: [
        'Is it a bug, an idea, or a question?',
        'Describe the situation precisely',
        'What is the urgency for you?',
      ],
    },
    // Map question index to field names
    questionFieldMapping: [
      ['request_type'],
      ['description', 'context', 'expected_behavior', 'ideas_needs'],
      ['urgency'],
    ],
    fields: [
      { name: 'request_type', required: true, type: 'text' },
      { name: 'description', required: true, type: 'text' },
      { name: 'urgency', required: true, type: 'text' },
      { name: 'context', required: false, type: 'text' },
      { name: 'expected_behavior', required: false, type: 'text' },
      { name: 'ideas_needs', required: false, type: 'text' },
      { name: 'category', required: false, type: 'enum', auto: true },
      { name: 'priority', required: false, type: 'enum', auto: true },
    ],
    categories: Categories.dev_portal,
    knowledgeBase: {
      fr: [
        'Guide de démarrage API',
        'Bonnes pratiques pour signaler un bug',
        'Roadmap et demandes de fonctionnalités',
      ],
      en: [
        'API getting started guide',
        'Best practices for reporting a bug',
        'Roadmap and feature requests',
      ],
    },
  },
};

// Agents data
export const agents = [
  {
    id: 'sophie',
    name: 'Sophie M.',
    specialty: {
      fr: 'Support général',
      en: 'General support',
    },
    avatar: '👩‍💼',
  },
  {
    id: 'thomas',
    name: 'Thomas R.',
    specialty: {
      fr: 'Technique',
      en: 'Technical',
    },
    avatar: '👨‍💻',
  },
  {
    id: 'julie',
    name: 'Julie L.',
    specialty: {
      fr: 'Escalade',
      en: 'Escalation',
    },
    avatar: '👩‍🔧',
  },
];
