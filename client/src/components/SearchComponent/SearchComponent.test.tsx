import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchComponent from "./SearchComponent";

jest.useFakeTimers();

describe("SearchComponent", () => {
	it("calls onSearch with correct value after debounce", () => {
		const onSearchMock = jest.fn();
		render(<SearchComponent onSearch={onSearchMock} />);
		onSearchMock.mockClear();
		const input = screen.getByPlaceholderText(/Search by name/i);

		fireEvent.change(input, { target: { value: "Cha" } });
		act(() => jest.advanceTimersByTime(200));
		expect(onSearchMock).not.toHaveBeenCalled();

		act(() => jest.advanceTimersByTime(150));
		expect(onSearchMock).toHaveBeenCalledWith("Cha");

		fireEvent.change(input, { target: { value: "" } });
		expect(onSearchMock).toHaveBeenLastCalledWith("");
	});

	it("does not call onSearch for input shorter than 3 characters (unless cleared)", () => {
		const onSearchMock = jest.fn();
		render(<SearchComponent onSearch={onSearchMock} />);
		onSearchMock.mockClear();
		const input = screen.getByPlaceholderText(/Search by name/i);

		fireEvent.change(input, { target: { value: "Al" } });
		act(() => jest.advanceTimersByTime(500));
		expect(onSearchMock).not.toHaveBeenCalled();

		fireEvent.change(input, { target: { value: "" } });
		expect(onSearchMock).toHaveBeenCalledWith("");
	});
});
