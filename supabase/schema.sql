-- Audiogami Voice Support Tickets Database Schema

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Core fields
  use_case TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  raw_transcript TEXT,
  language TEXT NOT NULL DEFAULT 'fr',
  email TEXT,

  -- IT Support fields
  device TEXT,
  symptoms TEXT,
  frequency TEXT,
  environment TEXT,
  actions_tried TEXT,
  impact TEXT,

  -- E-commerce fields
  order_number TEXT,
  problem_type TEXT,
  product_description TEXT,
  delivery_status TEXT,
  desired_resolution TEXT,
  purchase_date TEXT,

  -- SaaS fields
  feature TEXT,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,

  -- Developer Portal fields
  request_type TEXT,
  description TEXT,
  urgency TEXT,
  context TEXT,
  ideas_needs TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_use_case ON tickets(use_case);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (adjust based on auth requirements)
CREATE POLICY "Allow all operations on tickets" ON tickets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert seed data (optional - comment out if not needed)
INSERT INTO tickets (id, created_at, use_case, status, priority, category, tags, raw_transcript, device, symptoms, frequency, environment, actions_tried, impact, language)
VALUES
  ('seed_1', NOW() - INTERVAL '2 days', 'it_support', 'in_progress', 'critical', 'hardware', ARRAY['urgent', 'recurring'], 'PC gaming avec écran noir au lancement de jeux...', 'PC gaming avec RTX', 'Écran noir au lancement de jeux, nécessite redémarrage', 'Systématique depuis hier, 100% des lancements', 'Windows 11, drivers mis à jour via GeForce Experience', 'Mise à jour drivers, test autre écran', 'Activité de streaming impossible', 'fr')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tickets (id, created_at, use_case, status, priority, category, tags, raw_transcript, device, symptoms, frequency, environment, actions_tried, impact, language)
VALUES
  ('seed_2', NOW() - INTERVAL '1 day', 'it_support', 'resolved', 'high', 'peripheral', ARRAY['urgent'], 'Clavier sans fil ne fonctionne plus...', 'Clavier sans fil (Logitech ou Microsoft, gris)', 'Touches ne répondent plus', 'Depuis ce matin, hier soir OK', 'PC fixe Windows', 'Remplacement des piles', 'Blocage pour le travail', 'fr')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tickets (id, created_at, use_case, status, priority, category, tags, raw_transcript, order_number, problem_type, product_description, delivery_status, actions_tried, desired_resolution, purchase_date, language)
VALUES
  ('seed_3', NOW() - INTERVAL '12 hours', 'ecommerce', 'new', 'high', 'delivery', ARRAY['escalation'], 'Baskets Nike non reçues malgré statut livré...', '78432', 'Colis non reçu malgré statut "livré"', 'Baskets Nike blanches (Air Max ou Air Force)', 'Marqué livré sur Colissimo', 'Vérifié voisins et local poubelle + Tentative appel Colissimo (abandonné)', 'Réexpédition prioritaire, sinon remboursement', 'Mi-novembre (15-16)', 'fr')
ON CONFLICT (id) DO NOTHING;
