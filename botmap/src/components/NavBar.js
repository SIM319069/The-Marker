import React from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css"; // Import the CSS file for the nav bar

function NavBar() {
	return (
		<nav className="w-[150px] bg-navbarcolor text-navbarcolor h-screen fixed ">
			<div className="text-center divide-y-4 divide-slate-400/25">
				<h2 className="pt-[10px] text-2xl font-bold bg-gray-200 shadow-sm hover:bg-gray-400 transition ">
					<Link to="/">BOtMAPs</Link>
				</h2>
				<ul className="list-none p-0 divide-y divide-navbarcolor">
					<li className="h-[30px] bg-gray-200 shadow-sm hover:bg-gray-400 transition ">
						<Link to="/about">About</Link>
					</li>
					<li className="h-[30px] bg-gray-200 shadow-sm hover:bg-gray-400 transition">
						<Link to="/events">Events</Link>
					</li>
					<li className="h-[30px] bg-gray-200 shadow-sm hover:bg-gray-400 transition rounded-b-[5px]">
						<Link to="/contact">Contact</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavBar;
