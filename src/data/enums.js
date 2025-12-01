// Status enum
export const Status = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  WAITING_CUSTOMER: 'waiting_customer',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Priority enum
export const Priority = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Categories by use case
export const Categories = {
  it_support: {
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    NETWORK: 'network',
    PERIPHERAL: 'peripheral',
    OTHER: 'other',
  },
  ecommerce: {
    DELIVERY: 'delivery',
    PRODUCT_DEFECT: 'product_defect',
    WRONG_ITEM: 'wrong_item',
    REFUND: 'refund',
    OTHER: 'other',
  },
  saas: {
    BUG: 'bug',
    FEATURE_REQUEST: 'feature_request',
    ACCESS_ISSUE: 'access_issue',
    PERFORMANCE: 'performance',
    OTHER: 'other',
  },
  dev_portal: {
    BUG: 'bug',
    ENHANCEMENT: 'enhancement',
    NEW_FEATURE: 'new_feature',
    DOCUMENTATION: 'documentation',
    OTHER: 'other',
  },
};

// Common tags pool
export const Tags = {
  URGENT: 'urgent',
  RECURRING: 'recurring',
  FIRST_CONTACT: 'first_contact',
  ESCALATION: 'escalation',
  VIP_CUSTOMER: 'vip_customer',
  WORKAROUND_AVAILABLE: 'workaround_available',
};

// Use case IDs
export const UseCases = {
  IT_SUPPORT: 'it_support',
  ECOMMERCE: 'ecommerce',
  SAAS: 'saas',
  DEV_PORTAL: 'dev_portal',
};
