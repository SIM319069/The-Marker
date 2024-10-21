import React from "react";

// StatisticBox component to display a statistic with a title, value, and optional percentage change
const StatisticBox = ({ title, value, percentage, positive }) => {
	return (
		<div className="bg-statisticboxcolor p-4 rounded shadow-md w-[500px]">
			<h3 className="text-gray-500">{title}</h3>
			<p className="text-2xl font-bold">{value}</p>
			{percentage !== null && (
				<p
					className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>
					{percentage}% {positive ? "▲" : "▼"} {/* Arrow indicator for change */}
				</p>
			)}
		</div>
	);
};

export default StatisticBox;
