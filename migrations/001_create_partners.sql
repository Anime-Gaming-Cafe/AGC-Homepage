CREATE TABLE IF NOT EXISTS partners (
  id serial PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  logo_url text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  discord_invite_code text,
  sort_order integer NOT NULL DEFAULT 0
);
