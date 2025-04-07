import { Request, Response } from "express";
import { InfluencerInput } from "../types";
import { deleteInfluencer, getInfluencers, getInfluencerById, insertInfluencer, updateInfluencer } from "../db/queries";
import { validateInfluencerInput } from "../utils/validateInfluencerInput";
import { handlePgError } from "../utils/handlePgError";

export const getAllInfluencersHandler = async (req: Request, res: Response) => {
	try {
		const search = req.query.search as string | undefined;
		const influencers = await getInfluencers(search);
		res.status(200).json(influencers);
	} catch (err) {
		console.error("Failed to get all influencers:", err);
		res.status(500).json({ message: "Failed to get all influencers" });
	}
};

export const createInfluencerHandler = async (req: Request<unknown, unknown, InfluencerInput>, res: Response) => {
	const validationError = validateInfluencerInput(req.body);
	if (validationError) {
		res.status(validationError.status).json({ message: validationError.message });
		return;
	}

	try {
		const newInfluencer = await insertInfluencer(req.body);
		res.status(201).json(newInfluencer);
	} catch (err) {
		handlePgError(err, res, "create");
	}
};

export const getInfluencerByIdHandler = async (req: Request, res: Response) => {
	try {
		const influencer = await getInfluencerById(req.params.id);
		if (!influencer) {
			res.status(404).json({ message: "Influencer not found" });
			return;
		}
		res.json(influencer);
	} catch (err) {
		console.error("Failed to find influencer by ID:", err);
		res.status(500).json({ message: "Failed to find influencer by ID" });
	}
};

export const updateInfluencerHandler = async (req: Request, res: Response) => {
	const validationError = validateInfluencerInput(req.body);
	if (validationError) {
		res.status(validationError.status).json({ message: validationError.message });
		return;
	}

	try {
		const id = req.params.id;
		await updateInfluencer(id, req.body);
		res.json({ ...req.body, id });
	} catch (err) {
		handlePgError(err, res, "create");
	}
};

export const deleteInfluencerHandler = async (req: Request, res: Response) => {
	try {
		await deleteInfluencer(req.params.id);
		res.status(204).send();
	} catch (err) {
		console.error("Failed to remove Influencer:", err);
		res.status(500).json({ message: "Server error" });
	}
};
