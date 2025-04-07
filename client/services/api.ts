import axios from "axios";
import { Influencer, InfluencerInput } from "../src/types";

const api = axios.create({
	baseURL: "",
});

export default api;

export async function createInfluencer(data: InfluencerInput): Promise<InfluencerInput> {
	const response = await api.post("/influencer", data);
	return response.data;
}

export async function getInfluencers(search?: string): Promise<Influencer[]> {
	const response = await axios.get("/influencers", {
		params: search && search.length >= 3 ? { search } : {},
	});
	return response.data;
}

export async function deleteInfluencer(id: string): Promise<void> {
	await api.delete(`/influencer/${id}`);
}

export async function getInfluencerById(id: string): Promise<Influencer> {
	const response = await api.get(`/influencer/${id}`);
	console.log("assa1 getInfluencers() response:", response.data);

	return response.data;
}

export async function updateInfluencer(id: string, data: InfluencerInput): Promise<Influencer> {
	const response = await api.put(`/influencer/${id}`, data);
	return response.data;
}
