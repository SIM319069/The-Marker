import React from "react";

const StatisticBox = ({ title, value, percentage, positive }) => {
	return (
		<div className="statistic-box bg-statisticboxcolor p-4 rounded shadow-md w-[500px]">
			<h3 className="text-gray-500">{title}</h3>
			<p className="text-2xl font-bold">{value}</p>
			{percentage !== null && (
				<p
					className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>
					{percentage}% {positive ? "▲" : "▼"}
				</p>
			)}
		</div>
	);
};

export default StatisticBox;
