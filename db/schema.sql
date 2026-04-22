-- Run this in the Supabase SQL Editor to create the cards table.
--
-- Migration for existing databases (run once):
--   ALTER TABLE cards ADD COLUMN description TEXT DEFAULT '';
--   ALTER TABLE cards ADD COLUMN example TEXT DEFAULT '';
--   ALTER TABLE cards ADD COLUMN stumbles JSONB DEFAULT '[]';
--   ALTER TABLE cards ADD COLUMN completion_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  num INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(10) DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  example TEXT DEFAULT '',
  key_points JSONB DEFAULT '[]',
  complexity VARCHAR(255) DEFAULT '',
  follow_ups JSONB DEFAULT '[]',
  gotchas JSONB DEFAULT '[]',
  stumbles JSONB DEFAULT '[]',
  completion_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed TIMESTAMPTZ
);

CREATE INDEX idx_cards_num ON cards(num);
CREATE INDEX idx_cards_difficulty ON cards(difficulty);

-- Disable RLS (single-user app, no auth)
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON cards FOR ALL USING (true) WITH CHECK (true);
