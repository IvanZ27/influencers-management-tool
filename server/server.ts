import express, { Request, RequestHandler, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { Influencer, ErrorResponse, InfluencerInput } from "./types";
import pool from "./db";
import setupDatabase from "./setupDb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1337;

const corsOptions = {
	origin: [process.env.CLIENT_ORIGIN || "http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/influencers", async (_req: Request, res: Response) => {
	try {
		const result = await pool.query(`
			SELECT
				i.id,
				i.first_name,
				i.last_name,
				COALESCE(json_agg(json_build_object('platform', s.platform, 'username', s.username))
					FILTER (WHERE s.id IS NOT NULL), '[]') AS accounts
			FROM influencers i
			LEFT JOIN social_accounts s ON s.influencer_id = i.id
			GROUP BY i.id
			ORDER BY i.first_name
		`);
		res.json(result.rows);
	} catch (err) {
		console.error("❌ Failed to fetch influencers:", err);
		res.status(500).send("Server error");
	}
});

const createInfluencerHandler: RequestHandler<unknown, Influencer | ErrorResponse, InfluencerInput> = async (
	req,
	res
) => {
	const { firstName, lastName, accounts } = req.body;

	if (!firstName || !firstName.trim()) {
		res.status(400).json({ message: "First name is required" });
		return;
	}
	if (!lastName || !lastName.trim()) {
		res.status(400).json({ message: "Last name is required" });
		return;
	}
	if (!Array.isArray(accounts) || accounts.length === 0) {
		res.status(400).json({ message: "At least one account is required" });
		return;
	}

	const seen = new Set<string>();

	for (const acc of accounts) {
		if (!acc || !acc.username.trim()) {
			res.status(400).json({ message: "Each account must have a platform and a username" });
			return;
		}

		const platform = acc.platform.toLowerCase();

		if (!["Instagram", "TikTok"].includes(platform)) {
			res.status(400).json({ message: `Unsupported platform: ${acc.platform}` });
			return;
		}

		const key = `${platform}:${acc.username.trim().toLowerCase()}`;
		if (seen.has(key)) {
			res.status(400).json({
				message: `Duplicate account on platform ${acc.platform}: ${acc.username}`,
			});
			return;
		}
		seen.add(key);
	}

	try {
		const id = uuidv4();
		await pool.query("INSERT INTO influencers (id, first_name, last_name) VALUES ($1, $2, $3)", [
			id,
			firstName.trim(),
			lastName.trim(),
		]);

		for (const acc of accounts) {
			await pool.query("INSERT INTO social_accounts (influencer_id, platform, username) VALUES ($1, $2, $3)", [
				id,
				acc.platform,
				acc.username.trim(),
			]);
		}

		const newInfluencer: Influencer = {
			id,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			accounts: accounts.map((acc) => ({
				platform: acc.platform,
				username: acc.username.trim(),
			})),
		};

		res.status(201).json(newInfluencer);
		return;
	} catch (err) {
		console.error("❌ Failed to create influencer:", err);
		res.status(500).json({ message: "Server error" });
		return;
	}
};

app.post("/influencer", createInfluencerHandler);

(async () => {
	try {
		await setupDatabase();
		app.listen(PORT, () => {
			console.log(`✅ Server started on port ${PORT}`);
		});
	} catch (err) {
		console.error("❌ Failed to setup database and start server:", err);
		process.exit(1);
	}
})();
