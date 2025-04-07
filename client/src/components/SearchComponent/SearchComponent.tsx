import React, { useState, useEffect } from "react";
import "./SearchComponent.css";

interface Props {
	onSearch: (searchTerm: string) => void;
}

const SearchComponent: React.FC<Props> = ({ onSearch }) => {
	const [input, setInput] = useState("");
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (input.length >= 3) {
			if (timer) clearTimeout(timer);
			const newTimer = setTimeout(() => onSearch(input), 300);
			setTimer(newTimer);
		} else if (input.length === 0) {
			if (timer) clearTimeout(timer);
			onSearch("");
		}
	}, [input]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(input);
	};

	return (
		<div className="search-input">
			<form onSubmit={handleSubmit}>
				<input
					id="search-component-box"
					value={input}
					type="text"
					placeholder="Search by name..."
					onChange={(e) => setInput(e.target.value)}
				/>
				<input id="search-component-btn" value="Go" type="submit" />
			</form>
		</div>
	);
};

export default SearchComponent;
