import { validateInfluencerInput } from "./validateInfluencerInput";
import { Account, InfluencerInput } from "../types";

describe("validateInfluencerInput", () => {
	const baseValidInput: InfluencerInput = {
		firstName: "Assa",
		lastName: "Bassa",
		accounts: [{ platform: "Instagram", username: "assa.bassa" }],
	};

	it("accepts a valid input", () => {
		const result = validateInfluencerInput(baseValidInput);
		expect(result).toBeNull();
	});

	it("requires first and last name", () => {
		const input = { ...baseValidInput, firstName: " ", lastName: "" };
		const error = validateInfluencerInput(input);
		expect(error).not.toBeNull();
		expect(error!.status).toBe(400);
		expect(error!.message).toMatch(/First name is required/i);
	});

	it("limits name length to 50 characters", () => {
		const longName = "A".repeat(51);
		const input = { ...baseValidInput, firstName: longName, lastName: "Valid" };
		const error = validateInfluencerInput(input);
		expect(error).not.toBeNull();
		expect(error!.status).toBe(400);
		expect(error!.message).toMatch(/at most 50 characters/);
	});

	it("requires at least one account", () => {
		const input = { ...baseValidInput, accounts: [] };
		const error = validateInfluencerInput(input);
		expect(error).not.toBeNull();
		expect(error!.message).toMatch(/at least one account is required/i);
	});

	it("rejects accounts missing platform or username", () => {
		const input: InfluencerInput = { ...baseValidInput, accounts: [{ platform: "Instagram", username: " " }] };
		const error = validateInfluencerInput(input);
		expect(error).not.toBeNull();
		expect(error!.message).toMatch(/must have platform and username/);
	});

	it("rejects unsupported platform", () => {
		// @ts-expect-error (testing invalid platform)
		const input: InfluencerInput = { ...baseValidInput, accounts: [{ platform: "Twitter", username: "john" }] };
		const error = validateInfluencerInput(input);
		expect(error).not.toBeNull();
		expect(error!.message).toMatch(/Unsupported platform: Twitter/);
	});

	it("detects duplicate accounts in input (same platform & username)", () => {
		const accounts: Account[] = [
			{ platform: "Instagram", username: "john" },
			{ platform: "Instagram", username: "JOHN" },
		];
		const input: InfluencerInput = { ...baseValidInput, accounts };
		const error = validateInfluencerInput(input);
		expect(error).not.toBeNull();
		expect(error!.message).toMatch(/Duplicate account: Instagram - john/i);
	});
});
