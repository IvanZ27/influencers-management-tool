import { Router } from "express";
import {
	getAllInfluencersHandler,
	createInfluencerHandler,
	getInfluencerByIdHandler,
	updateInfluencerHandler,
	deleteInfluencerHandler,
} from "../controllers/influencerController";

const router = Router();

router.get("/influencers", getAllInfluencersHandler);
router.post("/influencer", createInfluencerHandler);

router.get("/influencer/:id", getInfluencerByIdHandler);
router.put("/influencer/:id", updateInfluencerHandler);
router.delete("/influencer/:id", deleteInfluencerHandler);

export default router;
