import pool from "./db";
import { Influencer, InfluencerInput } from "../types";
import { v4 as uuidv4 } from "uuid";

export async function getInfluencers(search?: string): Promise<Influencer[]> {
	let query = `
		SELECT
			i.id,
			i.first_name,
			i.last_name,
			COALESCE(json_agg(json_build_object('platform', s.platform, 'username', s.username))
				FILTER (WHERE s.id IS NOT NULL), '[]') AS accounts
		FROM influencers i
		LEFT JOIN social_accounts s ON s.influencer_id = i.id
	`;
	const params: any[] = [];

	if (search && search.length >= 3) {
		query += `
			WHERE LOWER(COALESCE(i.first_name, '') || ' ' || COALESCE(i.last_name, '')) LIKE $1
		`;
		params.push(`%${search.toLowerCase()}%`);
	}

	query += `
		GROUP BY i.id
		ORDER BY i.first_name
	`;

	const result = await pool.query(query, params);

	return result.rows.map((row) => ({
		id: row.id,
		firstName: row.first_name,
		lastName: row.last_name,
		accounts: row.accounts,
	}));
}

export async function insertInfluencer(input: InfluencerInput): Promise<Influencer> {
	const id = uuidv4();
	const { firstName, lastName, accounts } = input;

	await pool.query(`INSERT INTO influencers (id, first_name, last_name) VALUES ($1, $2, $3)`, [
		id,
		firstName.trim(),
		lastName.trim(),
	]);

	for (const acc of accounts) {
		await pool.query(`INSERT INTO social_accounts (influencer_id, platform, username) VALUES ($1, $2, $3)`, [
			id,
			acc.platform,
			acc.username.trim(),
		]);
	}

	return {
		id,
		firstName: firstName.trim(),
		lastName: lastName.trim(),
		accounts: accounts.map((a) => ({ platform: a.platform, username: a.username.trim() })),
	};
}

export async function getInfluencerById(id: string) {
	const influencer = await pool.query(`SELECT id, first_name, last_name FROM influencers WHERE id = $1`, [id]);

	if (influencer.rowCount === 0) return null;

	const accounts = await pool.query(`SELECT platform, username FROM social_accounts WHERE influencer_id = $1`, [id]);

	return {
		id,
		firstName: influencer.rows[0].first_name,
		lastName: influencer.rows[0].last_name,
		accounts: accounts.rows,
	};
}

export async function updateInfluencer(id: string, data: InfluencerInput) {
	await pool.query(`UPDATE influencers SET first_name = $1, last_name = $2 WHERE id = $3`, [
		data.firstName.trim(),
		data.lastName.trim(),
		id,
	]);

	await pool.query(`DELETE FROM social_accounts WHERE influencer_id = $1`, [id]);

	for (const acc of data.accounts) {
		await pool.query(`INSERT INTO social_accounts (influencer_id, platform, username) VALUES ($1, $2, $3)`, [
			id,
			acc.platform,
			acc.username.trim(),
		]);
	}
}

export async function deleteInfluencer(id: string) {
	await pool.query(`DELETE FROM social_accounts WHERE influencer_id = $1`, [id]);
	await pool.query(`DELETE FROM influencers WHERE id = $1`, [id]);
}
