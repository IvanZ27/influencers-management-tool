import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import Logo from "../../assets/AdcashLogo.tsx";

const Navigation = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLDivElement>(null);

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			if (
				menuRef.current &&
				toggleRef.current &&
				!menuRef.current.contains(target) &&
				!toggleRef.current.contains(target)
			) {
				setMenuOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<nav className="nav">
			<div className="logo">
				<Link to="/">
					<Logo />
				</Link>
			</div>

			<div ref={menuRef} className={`menu ${menuOpen ? "show" : ""}`} id="menu">
				<Link to="/">List</Link>
				<Link to="/create">Create</Link>
			</div>

			<div ref={toggleRef} className={`toggle ${menuOpen ? "open" : ""}`} id="toggle" onClick={toggleMenu}>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</nav>
	);
};

export default Navigation;
