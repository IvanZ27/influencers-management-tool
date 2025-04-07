import pool from "./db/db";

async function setupDatabase(): Promise<void> {
	if (process.env.SKIP_DB_SETUP === "true") {
		console.log("⚠️ Skipping database setup in Docker mode");
		return;
	}

	try {
		await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await pool.query(`
			CREATE TABLE IF NOT EXISTS influencers (
													   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
				first_name VARCHAR(50) NOT NULL,
				last_name VARCHAR(50) NOT NULL
				)
		`);

		await pool.query(`
			CREATE TABLE IF NOT EXISTS social_accounts (
														   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
				influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
				platform VARCHAR(70) NOT NULL,
				username VARCHAR(70) NOT NULL
				)
		`);

		await pool.query(`DELETE FROM social_accounts`);
		await pool.query(`DELETE FROM influencers`);

		await pool.query(`
			INSERT INTO influencers (id, first_name, last_name) VALUES
																	('11111111-1111-1111-1111-111111111111', 'Boris', 'The Blade Yurinov'),
																	('22222222-2222-2222-2222-222222222222', 'Mickey', 'O''Neil'),
																	('33333333-3333-3333-3333-333333333333', 'Tony', 'Bullet Tooth'),
																	('44444444-4444-4444-4444-444444444444', 'Franky', 'Four-Fingers');
		`);

		await pool.query(`
			INSERT INTO social_accounts (influencer_id, platform, username) VALUES
																				('11111111-1111-1111-1111-111111111111', 'Instagram', 'boris_blade'),
																				('11111111-1111-1111-1111-111111111111', 'Instagram', 'boris_blade.live'),
																				('11111111-1111-1111-1111-111111111111', 'TikTok', 'boris_blade'),

																				('22222222-2222-2222-2222-222222222222', 'TikTok', 'mickey_boxer'),

																				('33333333-3333-3333-3333-333333333333', 'Instagram', 'bullet_tooth'),
																				('33333333-3333-3333-3333-333333333333', 'TikTok', 'bullet_tooth'),

																				('44444444-4444-4444-4444-444444444444', 'Instagram', 'franky4fingers'),
																				('44444444-4444-4444-4444-444444444444', 'TikTok', 'franky4fingers'),
																				('44444444-4444-4444-4444-444444444444', 'TikTok', 'ifranky4fingers_live'),
																				('44444444-4444-4444-4444-444444444444', 'TikTok', 'franky_four_fingers_exclusive');
		`);

		await pool.query(
			`CREATE UNIQUE INDEX IF NOT EXISTS unique_account ON social_accounts (influencer_id, platform, username)`
		);

		console.log("Database is ready");
	} catch (err) {
		console.error("Failed to set up database:", err);
		process.exit(1);
	}
}

export default setupDatabase;
