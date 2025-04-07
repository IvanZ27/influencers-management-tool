import { render, screen } from "@testing-library/react";
import { InstagramIconWithBadge } from "./InstagramIconWithBadge";

describe("InstagramIconWithBadge", () => {
	it("renders without badge when count is 1", () => {
		render(<InstagramIconWithBadge count={1} />);
		const badge = screen.queryByText("1");
		expect(badge).toBeNull();
	});

	it("shows badge with count when count > 1", () => {
		render(<InstagramIconWithBadge count={3} />);
		expect(screen.getByText("3")).toBeInTheDocument();
	});
});
