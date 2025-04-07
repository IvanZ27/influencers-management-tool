import { useEffect, useState } from "react";
import "./CreateInfluencerPage.css";
import { createInfluencer, getInfluencerById, updateInfluencer } from "../../../services/api.ts";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

type SocialMediaPlatform = "Instagram" | "TikTok";

interface Account {
	platform: SocialMediaPlatform;
	username: string;
}

function CreatePage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		setAccounts([{ platform: "Instagram", username: "" }]);
	}, []);

	const { id } = useParams();
	const isEditMode = Boolean(id);
	const navigate = useNavigate();

	useEffect(() => {
		if (!id) return;

		const fetchData = async () => {
			try {
				const influencer = await getInfluencerById(id);
				setFirstName(influencer.firstName);
				setLastName(influencer.lastName);
				setAccounts(influencer.accounts);
			} catch (err) {
				toast.error("Failed to load influencer data.");
			}
		};

		fetchData();
	}, [id]);

	const addAccount = () => {
		setAccounts([...accounts, { platform: "Instagram", username: "" }]);
	};

	const removeAccount = (index: number) => {
		const newAccounts = [...accounts];
		newAccounts.splice(index, 1);
		setAccounts(newAccounts);
	};

	const updateAccount = (index: number, field: keyof Account, value: string) => {
		const newAccounts = [...accounts];
		newAccounts[index][field] = value as SocialMediaPlatform;
		setAccounts(newAccounts);
	};

	const validateForm = (): string | null => {
		const trimmedFirstName = firstName.trim();
		const trimmedLastName = lastName.trim();

		const nameRegex = /^[\p{L}\p{M}'\- ]+$/u;
		const usernameRegex = /^[a-zA-Z0-9._]+$/;

		if (!trimmedFirstName || !trimmedLastName) {
			return "First and last name are required.";
		}
		if (trimmedFirstName.length > 50 || trimmedLastName.length > 50) {
			return "First name and last name must be at most 50 characters.";
		}
		if (!nameRegex.test(trimmedFirstName)) {
			return "First name contains invalid characters.";
		}
		if (!nameRegex.test(trimmedLastName)) {
			return "Last name contains invalid characters.";
		}

		if (accounts.length === 0 || !accounts[0].username.trim()) {
			return "At least one account is required.";
		}

		const seen = new Set();
		for (const account of accounts) {
			const platform = account.platform.trim();
			const username = account.username.trim();

			if (!platform || !username) {
				return "All accounts must have platform and username.";
			}

			if (!["Instagram", "TikTok"].includes(platform)) {
				return `Unsupported platform: ${platform}`;
			}

			if (!usernameRegex.test(username)) {
				return `Usernames can only contain English letters, numbers, dots or underscores: ${username}`;
			}

			const key = `${platform.toLowerCase()}:${username.toLowerCase()}`;
			if (seen.has(key)) {
				return `Duplicate account: ${platform} - ${username}`;
			}
			seen.add(key);
		}

		return null;
	};

	const handleCreate = async () => {
		const trimmedFirstName = firstName.trim();
		const trimmedLastName = lastName.trim();

		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			setError("");

			if (isEditMode) {
				await updateInfluencer(id!, {
					firstName: trimmedFirstName,
					lastName: trimmedLastName,
					accounts,
				});
				toast.success("Influencer updated!");
			} else {
				await createInfluencer({
					firstName: trimmedFirstName,
					lastName: trimmedLastName,
					accounts,
				});
				toast.success("Influencer created!");
			}

			navigate("/");
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const axiosErr = err as AxiosError<{ message: string }>;
				setError(axiosErr.response?.data?.message ?? "Unexpected error occurred.");
			} else {
				setError("Unexpected error occurred.");
			}
		}
	};

	return (
		<div className="create-page">
			<header className="create-page__header">Influencer Manager</header>
			<main className="create-page__main">
				<h1 className="create-page__title">Create a New Influencer</h1>
				<form className="create-page__form" onSubmit={(e) => e.preventDefault()}>
					<label className="create-page__label">
						First Name:
						<input
							maxLength={50}
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="John"
							className="create-page__input"
						/>
					</label>
					<label className="create-page__label">
						Last Name:
						<input
							maxLength={50}
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Doe"
							className="create-page__input"
						/>
					</label>

					<div className="create-page__accounts">
						<h3 className="create-page__accounts-title">Social Media Accounts</h3>
						{accounts.map((account, idx) => (
							<div key={idx} className="create-page__account">
								<select
									value={account.platform}
									onChange={(e) => updateAccount(idx, "platform", e.target.value)}
									className="create-page__select"
								>
									<option value="Instagram">Instagram</option>
									<option value="TikTok">TikTok</option>
								</select>

								<div className="create-page__input-remove-wrapper">
									<input
										type="text"
										value={account.username}
										placeholder="Username"
										onChange={(e) => updateAccount(idx, "username", e.target.value)}
										className="create-page__input-username"
									/>
									{idx > 0 && (
										<button
											type="button"
											className="create-page__remove-btn"
											onClick={() => removeAccount(idx)}
											aria-label="Remove account"
										>
											✕
										</button>
									)}
								</div>
							</div>
						))}
						<button type="button" className="create-page__add-btn" onClick={addAccount}>
							+ Add Account
						</button>
					</div>

					{error && <div className="create-page__error">{error}</div>}
					<button type="button" className="create-page__create-btn" onClick={handleCreate}>
						{isEditMode ? "Update" : "Create"}
					</button>
				</form>
			</main>
		</div>
	);
}

export default CreatePage;
