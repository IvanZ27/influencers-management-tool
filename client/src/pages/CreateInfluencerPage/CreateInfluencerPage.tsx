import { useEffect, useState } from "react";
import "./CreateInfluencerPage.css";

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

	const addAccount = () => {
		setAccounts([...accounts, { platform: "Instagram", username: "" }]);
	};

	//
	//
	// fake methods replace with RestAPI requests
	const removeAccount = (index: number) => {
		const newAccounts = [...accounts];
		newAccounts.splice(index, 1);
		setAccounts(newAccounts);
	};

	const updateAccount = (index: number, field: keyof Account, value: string) => {
		const newAccounts = [...accounts];
		newAccounts[index][field] = value as any;
		setAccounts(newAccounts);
	};

	const handleCreate = () => {
		if (!accounts[0].username.trim()) {
			setError("At least one account is required.");
			return;
		}
		setError("");
		alert("Created!");
	};
	// fake methods replace with RestAPI requests
	//
	//

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
										className="create-page__input"
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
						{error && <div className="create-page__error">{error}</div>}
						<button type="button" className="create-page__add-btn" onClick={addAccount}>
							+ Add Account
						</button>
					</div>

					<button type="button" className="create-page__create-btn" onClick={handleCreate}>
						Create
					</button>
				</form>
			</main>
			<footer className="create-page__footer">© 2025 ISchoffa</footer>
		</div>
	);
}

export default CreatePage;
