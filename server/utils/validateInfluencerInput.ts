import { InfluencerInput } from "../types";

export const validateInfluencerInput = (input: InfluencerInput): { status: number; message: string } | null => {
	const { firstName, lastName, accounts } = input;

	if (!firstName?.trim()) return { status: 400, message: "First name is required" };
	if (!lastName?.trim()) return { status: 400, message: "Last name is required" };

	const trimmedFirst = firstName.trim();
	const trimmedLast = lastName.trim();

	if (trimmedFirst.length > 50 || trimmedLast.length > 50) {
		return { status: 400, message: "First name and last name must be at most 50 characters." };
	}

	if (!Array.isArray(accounts) || accounts.length === 0) {
		return { status: 400, message: "At least one account is required" };
	}

	const allowedPlatforms = ["Instagram", "TikTok"];
	const seen = new Set();

	for (const acc of accounts) {
		if (!acc.platform?.trim() || !acc.username?.trim()) {
			return { status: 400, message: "All accounts must have platform and username" };
		}

		if (!allowedPlatforms.includes(acc.platform)) {
			return { status: 400, message: `Unsupported platform: ${acc.platform}` };
		}

		const key = `${acc.platform.toLowerCase()}:${acc.username.trim().toLowerCase()}`;
		if (seen.has(key)) {
			return { status: 400, message: `Duplicate account: ${acc.platform} - ${acc.username}` };
		}
		seen.add(key);
	}

	return null;
};
