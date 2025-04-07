import React from "react";
import "./InstagramIconWithBadge.css";
import InstagramLogo from "../../assets/InstagramLogo.tsx";

interface InstagramIconWithBadgeProps {
	count: number;
}

export const InstagramIconWithBadge: React.FC<InstagramIconWithBadgeProps> = ({ count }) => {
	return (
		<div className="icon-wrapper">
			<InstagramLogo />
			{count > 1 && <span className="instagram-badge">{count}</span>}
		</div>
	);
};
