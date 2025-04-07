import { handlePgError } from "./handlePgError";

describe("handlePgError", () => {
	// It's fake Response object with status and json for check
	const createFakeRes = () => {
		let statusCode = 0;
		const res: any = {
			status: (code: number) => {
				statusCode = code;
				return res;
			},
			json: jest.fn().mockImplementation((obj) => {
				// In real life it sends response, but here we return value for convenience
				return { status: statusCode, body: obj };
			}),
		};
		return { res, getStatus: () => statusCode };
	};

	it("returns 409 for unique constraint violation (code 23505)", () => {
		const { res } = createFakeRes();
		const err = { code: "23505" }; // duplicate key error code
		const result = handlePgError(err, res, "create");
		// The handler should respond with 409 Conflict and a relevant message
		expect(result).toEqual({ status: 409, body: { message: "Duplicate social network account" } });
	});

	it("returns 400 for data too long (code 22001)", () => {
		const { res } = createFakeRes();
		const err = { code: "22001" }; // string data right truncation (max 50 characters)
		const result = handlePgError(err, res, "update");
		expect(result).toEqual({
			status: 400,
			body: { message: "First name and last name must be at most 50 characters." },
		});
	});

	it("returns 500 for other errors with context in message", () => {
		const { res } = createFakeRes();
		const err = { code: "99999", detail: "Some unexpected DB error" };
		const result = handlePgError(err, res, "create");
		// For unknown errors, it should log and return 500 with a generic message
		expect(result).toEqual({ status: 500, body: { message: "Failed to create influencer" } });
	});
});
