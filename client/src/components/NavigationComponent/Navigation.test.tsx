import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "./Navigation";

describe("Navigation", () => {
	it("renders logo and navigation links", () => {
		render(
			<MemoryRouter>
				<Navigation />
			</MemoryRouter>
		);

		expect(screen.getByRole("link", { name: /list/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /create/i })).toBeInTheDocument();
	});

	it("toggles menu visibility when toggle is clicked", () => {
		render(
			<MemoryRouter>
				<Navigation />
			</MemoryRouter>
		);

		const menu = screen.getByRole("navigation").querySelector("#menu")!;
		const toggle = screen.getByRole("navigation").querySelector("#toggle")!;

		expect(menu.classList.contains("show")).toBe(false);
		fireEvent.click(toggle);
		expect(menu.classList.contains("show")).toBe(true);
		fireEvent.click(toggle);
		expect(menu.classList.contains("show")).toBe(false);
	});
});
