import { useEffect, useState } from "react";
import "./InfluencersListPage.css";
import { InstagramIconWithBadge } from "../../components/InstagramIconWithBadge/InstagramIconWithBadge.tsx";
import { TikTokIconWithBadge } from "../../components/TikTokIconWithBadge/TikTokIconWithBadge.tsx";
import axios from "axios";

interface Account {
	platform: "Instagram" | "TikTok";
	username: string;
}

interface Influencer {
	id: string;
	firstName: string;
	lastName: string;
	accounts: Account[];
}

const baseURL = import.meta.env.VITE_API_URL;

function ListPage() {
	const [influencers, setInfluencers] = useState<Influencer[]>([]);

	useEffect(() => {
		const fetchInfluencers = async () => {
			try {
				const res = await axios.get(`${baseURL}/influencers`);
				setInfluencers(
					res.data.map((item: any) => ({
						id: item.id,
						firstName: item.first_name,
						lastName: item.last_name,
						accounts: item.accounts,
					}))
				);
			} catch (error) {
				console.error("❌ Error fetching influencers", error);
			}
		};

		fetchInfluencers();
	}, []);

	const handleDelete = (id: string) => {
		setInfluencers((prev) => prev.filter((i) => i.id !== id));
	};

	const handleEdit = (id: string) => {
		alert(`Edit influencer with ID ${id}`);
	};

	return (
		<div className="list-page">
			<header className="list-page__header">Influencers Management Tool</header>
			<main className="list-page__main">
				<h1 className="list-page__title">List Influencers</h1>

				<div className="list-page__table-wrapper">
					<table className="list-page__table">
						<thead className="list-page__thead">
							<tr className="list-page__row">
								<th>First Name</th>
								<th>Last Name</th>
								<th>Accounts</th>
								<th></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{influencers.map((influencer) => (
								<tr key={influencer.id} className="list-page__row">
									<td data-label="First Name">
										<span className="list-page__text-ellipsis" title={influencer.firstName}>
											{influencer.firstName}
										</span>
									</td>
									<td data-label="Last Name">
										<span className="list-page__text-ellipsis" title={influencer.lastName}>
											{influencer.lastName}
										</span>
									</td>
									<td data-label="Accounts">
										<div className="list-page__icons">
											{(() => {
												const count = influencer.accounts.filter(
													(acc) => acc.platform === "Instagram"
												).length;
												return count > 0 ? <InstagramIconWithBadge count={count} /> : null;
											})()}

											{(() => {
												const count = influencer.accounts.filter(
													(acc) => acc.platform === "TikTok"
												).length;
												return count > 0 ? <TikTokIconWithBadge count={count} /> : null;
											})()}
										</div>
									</td>

									<td>
										<button
											className="list-page__btn list-page__btn--edit"
											onClick={() => handleEdit(influencer.id)}
										>
											✏ Edit
										</button>
									</td>
									<td>
										<button
											className="list-page__btn list-page__btn--delete"
											onClick={() => handleDelete(influencer.id)}
										>
											🗑 Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
			<footer className="list-page__footer">© 2025 ISchoffa</footer>
		</div>
	);
}

export default ListPage;
