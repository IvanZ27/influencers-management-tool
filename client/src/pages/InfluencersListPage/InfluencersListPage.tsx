import { useState } from "react";
import "./InfluencersListPage.css";
import { InstagramIconWithBadge } from "../../components/InstagramIconWithBadgeComponent/InstagramIconWithBadge.tsx";
import { TikTokIconWithBadge } from "../../components/TikTokIconWithBadgeComponent/TikTokIconWithBadge.tsx";
import { deleteInfluencer, getInfluencers } from "../../../services/api.ts";
import { Influencer } from "../../types.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../../components/SearchComponent/SearchComponent.tsx";

function ListPage() {
	const [influencers, setInfluencers] = useState<Influencer[]>([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const loadInfluencers = async (search = "") => {
		// let loadingTimeout: NodeJS.Timeout | null = null;
		let loadingTimeout: NodeJS.Timeout | null;

		loadingTimeout = setTimeout(() => setLoading(true), 400);
		try {
			const data = await getInfluencers(search);
			setInfluencers(data);
		} catch (e) {
			toast.error("Failed to fetch influencers.");
		} finally {
			if (loadingTimeout) clearTimeout(loadingTimeout);
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteInfluencer(id);
			toast.success("Influencer deleted");
			setInfluencers((prev) => prev.filter((i) => i.id !== id));
		} catch {
			toast.error("Failed to delete influencer");
		}
	};

	const handleEdit = (id: string) => {
		navigate(`/edit/${id}`);
	};

	return (
		<div className="list-page">
			<div className="list-page__header-container">
				<header className="list-page__header">Influencers Management Tool</header>
				<SearchComponent onSearch={loadInfluencers} />
			</div>

			<main className="list-page__main">
				<h1 className="list-page__title">List Influencers</h1>

				<div className="list-page__table-wrapper">
					{loading ? (
						<p className="list-page__status-message">Loading...</p>
					) : (
						<>
							{influencers.length === 0 ? (
								<p className="list-page__status-message">No Results Found</p>
							) : (
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
													<span
														className="list-page__text-ellipsis"
														title={influencer.firstName}
													>
														{influencer.firstName}
													</span>
												</td>
												<td data-label="Last Name">
													<span
														className="list-page__text-ellipsis"
														title={influencer.lastName}
													>
														{influencer.lastName}
													</span>
												</td>
												<td data-label="Accounts">
													<div className="list-page__icons">
														{(() => {
															const count = influencer.accounts.filter(
																(acc) => acc.platform === "Instagram"
															).length;
															return count > 0 ? (
																<InstagramIconWithBadge count={count} />
															) : null;
														})()}

														{(() => {
															const count = influencer.accounts.filter(
																(acc) => acc.platform === "TikTok"
															).length;
															return count > 0 ? (
																<TikTokIconWithBadge count={count} />
															) : null;
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
							)}
						</>
					)}
				</div>
			</main>
			<footer className="list-page__footer">© 2025 ISchoffa</footer>
		</div>
	);
}

export default ListPage;
