import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupDatabase from "./setupDb";
import influencerRoutes from "./routes/influencerRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1337;

const corsOptions = {
	origin: [process.env.CLIENT_ORIGIN || "http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(influencerRoutes);

(async () => {
	try {
		await setupDatabase();
		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (err) {
		console.error("Failed to setup database and start server:", err);
		process.exit(1);
	}
})();
