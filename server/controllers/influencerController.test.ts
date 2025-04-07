import * as queries from "../db/queries";
import {
	getAllInfluencersHandler,
	createInfluencerHandler,
	getInfluencerByIdHandler,
	updateInfluencerHandler,
	deleteInfluencerHandler,
} from "./influencerController";
import { Influencer } from "../types";

// Mock data for Express req/res
const createMockRes = () => {
	const res: any = {};
	res.status = jest.fn().mockImplementation((code: number) => {
		res.statusCode = code;
		return res;
	});
	res.json = jest.fn().mockImplementation((obj: any) => {
		res.body = obj;
		return res;
	});
	res.send = jest.fn().mockImplementation((obj: any) => {
		res.body = obj;
		return res;
	});
	return res;
};

const mockInfluencer: Influencer = {
	id: "11111111-1111-1111-1111-111111111111",
	firstName: "Assa",
	lastName: "Bassa",
	accounts: [
		{ platform: "Instagram", username: "Assa1" },
		{ platform: "Instagram", username: "Assa2" },
		{ platform: "TikTok", username: "AssaTik" },
	],
};
afterEach(() => {
	jest.restoreAllMocks();
});

describe("InfluencerController - getAllInfluencersHandler", () => {
	it("returns list of influencers (no search filter)", async () => {
		const sampleData: Influencer[] = [
			{
				id: "1",
				firstName: "Assa",
				lastName: "Bassa",
				accounts: [{ platform: "Instagram", username: "assa.bassa" }],
			},
		];
		jest.spyOn(queries, "getInfluencers").mockResolvedValue(sampleData);

		const req: any = { query: {} };
		const res = createMockRes();
		await getAllInfluencersHandler(req, res);

		expect(queries.getInfluencers).toHaveBeenCalledWith(undefined);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.body).toEqual(sampleData);
	});

	it("passes search query to getInfluencers", async () => {
		jest.spyOn(queries, "getInfluencers").mockResolvedValue([]);
		const req: any = { query: { search: "ali" } };
		const res = createMockRes();
		await getAllInfluencersHandler(req, res);
		expect(queries.getInfluencers).toHaveBeenCalledWith("ali");
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("handles errors by returning 500", async () => {
		jest.spyOn(queries, "getInfluencers").mockRejectedValue(new Error("DB error"));
		const req: any = { query: {} };
		const res = createMockRes();
		await getAllInfluencersHandler(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.body).toEqual({ message: "Failed to get all influencers" });
	});
});

describe("InfluencerController - createInfluencerHandler", () => {
	it("validates input and returns 400 on validation failure", async () => {
		const req: any = { body: { firstName: "", lastName: "", accounts: [] } };
		const res = createMockRes();
		await createInfluencerHandler(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.body).toHaveProperty("message");
		expect(res.body.message).toMatch(/required/); // For first or last name required message
		jest.spyOn(queries, "insertInfluencer").mockResolvedValue(mockInfluencer);
		expect(queries.insertInfluencer).not.toHaveBeenCalled();
	});

	it("creates influencer and returns 201 + data on success", async () => {
		const newInfluencer: Influencer = {
			id: "new-id-123",
			firstName: "Test",
			lastName: "User",
			accounts: [{ platform: "Instagram", username: "testuser" }],
		};
		jest.spyOn(queries, "insertInfluencer").mockResolvedValue(newInfluencer);

		const req: any = {
			body: { firstName: "Test", lastName: "User", accounts: [{ platform: "Instagram", username: "testuser" }] },
		};
		const res = createMockRes();
		await createInfluencerHandler(req, res);

		expect(queries.insertInfluencer).toHaveBeenCalledWith({
			firstName: "Test",
			lastName: "User",
			accounts: [{ platform: "Instagram", username: "testuser" }],
		});
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.body).toEqual(newInfluencer);
	});

	it("catches DB errors and returns conflict if duplicate", async () => {
		// Simulate insert throwing a duplicate key error
		const error = { code: "23505" };
		jest.spyOn(queries, "insertInfluencer").mockRejectedValue(error);

		const req: any = {
			body: { firstName: "John", lastName: "Doe", accounts: [{ platform: "Instagram", username: "john" }] },
		};
		const res = createMockRes();
		await createInfluencerHandler(req, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.body).toEqual({ message: "Duplicate social network account" });
	});
});

describe("InfluencerController - getInfluencerByIdHandler", () => {
	it("returns 404 if influencer not found", async () => {
		jest.spyOn(queries, "getInfluencerById").mockResolvedValue(null);
		const req: any = { params: { id: "nonexistent-id" } };
		const res = createMockRes();
		await getInfluencerByIdHandler(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.body).toEqual({ message: "Influencer not found" });
	});

	it("returns influencer data if found", async () => {
		const influencerData = {
			id: "abc123",
			firstName: "Alice",
			lastName: "Anderson",
			accounts: [{ platform: "Instagram", username: "alice" }],
		};
		jest.spyOn(queries, "getInfluencerById").mockResolvedValue(influencerData);

		const req: any = { params: { id: "abc123" } };
		const res = createMockRes();
		await getInfluencerByIdHandler(req, res);

		expect(res.status).not.toHaveBeenCalled();
		expect(res.body).toEqual(influencerData);
	});

	it("handles errors with 500 response", async () => {
		jest.spyOn(queries, "getInfluencerById").mockRejectedValue(new Error("DB fail"));
		const req: any = { params: { id: "x" } };
		const res = createMockRes();
		await getInfluencerByIdHandler(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.body).toEqual({ message: "Failed to find influencer by ID" });
	});
});

describe("InfluencerController - updateInfluencerHandler", () => {
	it("validates input before updating", async () => {
		const req: any = { params: { id: "123" }, body: { firstName: "", lastName: "", accounts: [] } };
		const res = createMockRes();
		await updateInfluencerHandler(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.body.message).toMatch(/required/);
	});

	it("updates influencer and returns updated data", async () => {
		jest.spyOn(queries, "updateInfluencer").mockResolvedValue(undefined);
		const reqBody = { firstName: "New", lastName: "Name", accounts: [{ platform: "TikTok", username: "newname" }] };
		const req: any = { params: { id: "abc123" }, body: reqBody };
		const res = createMockRes();
		await updateInfluencerHandler(req, res);
		expect(queries.updateInfluencer).toHaveBeenCalledWith("abc123", reqBody);
		expect(res.body).toEqual({ ...reqBody, id: "abc123" });
	});

	it("catches errors and returns appropriate response", async () => {
		jest.spyOn(queries, "updateInfluencer").mockRejectedValue({ code: "23505" });
		const req: any = {
			params: { id: "abc" },
			body: { firstName: "X", lastName: "Y", accounts: [{ platform: "Instagram", username: "x" }] },
		};
		const res = createMockRes();
		await updateInfluencerHandler(req, res);
		// Should be handled by handlePgError -> conflict
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.body).toEqual({ message: "Duplicate social network account" });
	});
});

describe("InfluencerController - deleteInfluencerHandler", () => {
	it("deletes influencer and returns 204", async () => {
		jest.spyOn(queries, "deleteInfluencer").mockResolvedValue(undefined);
		const req: any = { params: { id: "some-id" } };
		const res = createMockRes();
		await deleteInfluencerHandler(req, res);
		expect(queries.deleteInfluencer).toHaveBeenCalledWith("some-id");
		expect(res.status).toHaveBeenCalledWith(204);
	});

	it("returns 500 on error during delete", async () => {
		jest.spyOn(queries, "deleteInfluencer").mockRejectedValue(new Error("fail"));
		const req: any = { params: { id: "x" } };
		const res = createMockRes();
		await deleteInfluencerHandler(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.body).toEqual({ message: "Server error" });
	});
});
