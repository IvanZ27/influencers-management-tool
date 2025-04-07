import React from "react";
import "./TikTokIconWithBadge.css";
import TikTokLogo from "../../assets/TikTokLogo.tsx";

interface TikTokIconWithBadgeProps {
	count: number;
}

export const TikTokIconWithBadge: React.FC<TikTokIconWithBadgeProps> = ({ count }) => {
	return (
		<div className="icon-wrapper">
			<TikTokLogo />
			{count > 1 && <span className="tik-tok-badge">{count}</span>}
		</div>
	);
};
