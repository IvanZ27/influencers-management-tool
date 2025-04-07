import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InfluencersListPage from "./InfluencersListPage";
import * as api from "../../../services/api";
import { MemoryRouter } from "react-router-dom";
import { Influencer } from "../../types";

const sampleInfluencers: Influencer[] = [
	{
		id: "11111111-1111-1111-1111-111111111111",
		firstName: "Assa",
		lastName: "Bassa",
		accounts: [
			{ platform: "Instagram", username: "Assa1" },
			{ platform: "Instagram", username: "Assa2" },
			{ platform: "TikTok", username: "AssaTik" },
		],
	},
	{
		id: "22222222-2222-2222-2222-222222222222",
		firstName: "Kassa",
		lastName: "Vassa",
		accounts: [{ platform: "TikTok", username: "Kassatok" }],
	},
];

describe("InfluencersListPage", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("loads and displays a list of influencers", async () => {
		jest.spyOn(api, "getInfluencers").mockResolvedValue(sampleInfluencers);
		render(
			<MemoryRouter>
				<InfluencersListPage />
			</MemoryRouter>
		);
		// The SearchComponent will call getInfluencers with "" on mount
		await waitFor(() => {
			expect(api.getInfluencers).toHaveBeenCalledWith("");
		});
		expect(await screen.findByText("Assa")).toBeInTheDocument();
		expect(screen.getByText("Bassa")).toBeInTheDocument();
		expect(screen.getByText("Kassa")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.queryByText("1")).toBeNull();
	});

	it("filters influencers by name via search input", async () => {
		const getSpy = jest.spyOn(api, "getInfluencers").mockResolvedValue([sampleInfluencers[0]]);
		render(
			<MemoryRouter>
				<InfluencersListPage />
			</MemoryRouter>
		);
		// Initially called with ""
		await waitFor(() => expect(getSpy).toHaveBeenCalledWith(""));
		// Type a search term of 3+ characters
		const searchInput = screen.getByPlaceholderText(/Search by name/i);
		fireEvent.change(searchInput, { target: { value: "Ali" } });
		// Wait for debounce (300ms) and API call
		await waitFor(() => {
			expect(getSpy).toHaveBeenLastCalledWith("Ali");
		});
		// After filtering, ensure only Assa is shown (Kassa should be filtered out)
		expect(screen.queryByText("Kassa")).toBeNull();
		expect(screen.getByText("Assa")).toBeInTheDocument();
	});

	it('displays "No Results Found" when filter yields none', async () => {
		jest.spyOn(api, "getInfluencers").mockResolvedValueOnce(sampleInfluencers).mockResolvedValueOnce([]);
		render(
			<MemoryRouter>
				<InfluencersListPage />
			</MemoryRouter>
		);
		await screen.findByText("Assa");
		// Perform a search that returns no results
		fireEvent.change(screen.getByPlaceholderText(/Search by name/i), { target: { value: "XYZ" } });
		await waitFor(() => {
			// "No Results Found" should appear
			expect(screen.getByText("No Results Found")).toBeInTheDocument();
		});
	});

	it("handles deletion of an influencer from the list", async () => {
		jest.spyOn(api, "getInfluencers").mockResolvedValue(sampleInfluencers);
		const deleteSpy = jest.spyOn(api, "deleteInfluencer").mockResolvedValue();
		render(
			<MemoryRouter>
				<InfluencersListPage />
			</MemoryRouter>
		);
		// Wait for initial list to load
		await screen.findByText("Assa");
		// Click delete for Assa
		fireEvent.click(screen.getAllByText("🗑 Delete")[0]);
		expect(deleteSpy).toHaveBeenCalledWith("11111111-1111-1111-1111-111111111111");
		await waitFor(() => {
			expect(screen.queryByText("Assa")).toBeNull();
		});
		// Kassa remains in the list
		expect(screen.getByText("Kassa")).toBeInTheDocument();
	});
});
