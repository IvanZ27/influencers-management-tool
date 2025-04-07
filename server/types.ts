export interface Account {
	platform: "Instagram" | "TikTok";
	username: string;
}

export interface Influencer {
	id: string;
	firstName: string;
	lastName: string;
	accounts: Account[];
}

export interface InfluencerInput extends Omit<Influencer, "id"> {}
