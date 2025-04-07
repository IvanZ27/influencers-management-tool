import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InfluencersListPage from "./pages/InfluencersListPage/InfluencersListPage.tsx";
import CreateInfluencerPage from "./pages/CreateInfluencerPage/CreateInfluencerPage.tsx";
import Navigation from "./components/Navigation/Navigation.tsx";

function App() {
	return (
		<BrowserRouter>
			<Navigation />
			<Routes>
				<Route path="/" element={<InfluencersListPage />} />
				<Route path="/create" element={<CreateInfluencerPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
