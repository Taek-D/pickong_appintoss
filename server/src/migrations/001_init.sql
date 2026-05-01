-- 픽콩 v1 init schema (PRD §13.1)

CREATE TABLE IF NOT EXISTS accounts (
  user_key            TEXT PRIMARY KEY,
  nickname            TEXT,
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  nickname_updated_at TIMESTAMPTZ,
  withdrawn_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);

CREATE TABLE IF NOT EXISTS monthly_cards (
  card_id            CHAR(8) PRIMARY KEY,                     -- [a-z0-9]{8}
  user_key           TEXT NOT NULL REFERENCES accounts(user_key) ON DELETE CASCADE,
  month              CHAR(7) NOT NULL,                        -- YYYY-MM
  total_count        INTEGER NOT NULL DEFAULT 0,
  total_amount       BIGINT NOT NULL DEFAULT 0,
  top_category       TEXT NOT NULL,
  category_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  character_type     TEXT NOT NULL,
  nickname_snapshot  TEXT NOT NULL,
  card_status        TEXT NOT NULL DEFAULT 'active' CHECK (card_status IN ('active', 'dirty', 'withdrawn')),
  share_status       TEXT NOT NULL DEFAULT 'active' CHECK (share_status IN ('active', 'expired')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_user_month UNIQUE (user_key, month)
);

CREATE INDEX IF NOT EXISTS idx_monthly_cards_user_month ON monthly_cards(user_key, month);
CREATE INDEX IF NOT EXISTS idx_monthly_cards_share_status ON monthly_cards(share_status, month);
