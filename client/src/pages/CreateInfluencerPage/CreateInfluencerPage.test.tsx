import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateInfluencerPage from "./CreateInfluencerPage";
import * as api from "../../../services/api";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Influencer } from "../../types.ts";

describe("CreateInfluencerPage (Create mode)", () => {
	beforeEach(() => {
		jest.mock("react-toastify", () => ({
			toast: {
				success: jest.fn(),
				error: jest.fn(),
			},
		}));
	});

	it("renders the form and allows adding/removing account fields", () => {
		render(
			<MemoryRouter>
				<CreateInfluencerPage />
			</MemoryRouter>
		);
		expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
		fireEvent.click(screen.getByText("+ Add Account"));
		const usernameFields = screen.getAllByPlaceholderText(/Username/i);
		expect(usernameFields.length).toBe(2);
		fireEvent.click(screen.getAllByLabelText("Remove account")[0]);
		expect(screen.getAllByPlaceholderText(/Username/i).length).toBe(1);
	});

	it("shows validation errors for empty required fields", async () => {
		render(
			<MemoryRouter>
				<CreateInfluencerPage />
			</MemoryRouter>
		);
		expect(screen.queryByText(/required/i)).toBeNull();
		fireEvent.click(screen.getByText("Create"));
		expect(await screen.findByText(/First and last name are required/i)).toBeInTheDocument();
	});

	it("calls createInfluencer API on valid submit and navigates to list", async () => {
		const createSpy = jest.spyOn(api, "createInfluencer").mockResolvedValue({
			firstName: "Test",
			lastName: "User",
			accounts: [{ platform: "Instagram", username: "testuser" }],
		});
		render(
			<MemoryRouter initialEntries={["/create"]}>
				<Routes>
					<Route path="/create" element={<CreateInfluencerPage />} />
					<Route path="/" element={<p>List Page</p>} />
				</Routes>
			</MemoryRouter>
		);
		fireEvent.change(screen.getByPlaceholderText("John"), { target: { value: "Test" } });
		fireEvent.change(screen.getByPlaceholderText("Doe"), { target: { value: "User" } });
		fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "testuser" } });
		fireEvent.click(screen.getByText("Create"));
		await waitFor(() => {
			expect(createSpy).toHaveBeenCalledWith({
				firstName: "Test",
				lastName: "User",
				accounts: [{ platform: "Instagram", username: "testuser" }],
			});
		});
		expect(screen.getByText("List Page")).toBeInTheDocument();
	});
});

describe("CreateInfluencerPage (Edit mode)", () => {
	it("loads existing influencer data and updates on submit", async () => {
		const existing: Influencer = {
			id: "12345",
			firstName: "Assa",
			lastName: "Kassa",
			accounts: [{ platform: "Instagram", username: "assa.insta" }],
		};
		jest.spyOn(api, "getInfluencerById").mockResolvedValue(existing);
		const updateSpy = jest.spyOn(api, "updateInfluencer").mockResolvedValue({
			...existing,
			firstName: "Assa",
			lastName: "Bassa",
		});
		render(
			<MemoryRouter initialEntries={["/edit/12345"]}>
				<Routes>
					<Route path="/edit/:id" element={<CreateInfluencerPage />} />
					<Route path="/" element={<p>List Page</p>} />
				</Routes>
			</MemoryRouter>
		);
		expect(await screen.findByDisplayValue("Assa")).toBeInTheDocument();
		expect(screen.getByDisplayValue("Kassa")).toBeInTheDocument();
		fireEvent.change(screen.getByPlaceholderText("Doe"), { target: { value: "Bassa" } });
		fireEvent.click(screen.getByText("Update"));
		await waitFor(() => {
			expect(updateSpy).toHaveBeenCalledWith("12345", {
				firstName: "Assa",
				lastName: "Bassa",
				accounts: expect.any(Array),
			});
		});
		expect(screen.getByText("List Page")).toBeInTheDocument();
	});
});
