import { Response } from "express";

export function handlePgError(err: unknown, res: Response, context: "create" | "update"): Response | void {
	const error = err as { code?: string };

	if (error.code === "23505") {
		return res.status(409).json({ message: "Duplicate social network account" });
	}

	if (error.code === "22001") {
		return res.status(400).json({
			message: "First name and last name must be at most 50 characters.",
		});
	}

	console.error(`Failed to ${context} influencer:`, error);
	return res.status(500).json({ message: `Failed to ${context} influencer` });
}
