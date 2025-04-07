import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InfluencersListPage from "./pages/InfluencersListPage/InfluencersListPage.tsx";
import CreateInfluencerPage from "./pages/CreateInfluencerPage/CreateInfluencerPage.tsx";
import Navigation from "./components/NavigationComponent/Navigation.tsx";
import { ToastContainer } from "react-toastify";
import FooterComponent from "./components/FooterComponent/FooterComponent.tsx";

function App() {
	return (
		<BrowserRouter>
			<ToastContainer position="top-center" autoClose={1000} />
			<Navigation />
			<Routes>
				<Route path="/" element={<InfluencersListPage />} />
				<Route path="/create" element={<CreateInfluencerPage />} />
				<Route path="/edit/:id" element={<CreateInfluencerPage />} />
			</Routes>
			<FooterComponent />
		</BrowserRouter>
	);
}

export default App;
