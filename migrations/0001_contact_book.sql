-- Contact book entries.
-- `name` and `message` are shown publicly on /contact-book;
-- `contact` is only ever read by the site owner (via wrangler d1 execute).
CREATE TABLE IF NOT EXISTS entries (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	message TEXT NOT NULL,
	contact TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_entries_created ON entries (created_at DESC);
