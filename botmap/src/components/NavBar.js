import React from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css"; // Import the CSS file for the nav bar

function NavBar() {
	return (
		<nav className="w-[150px] bg-navbarcolor text-navbarcolor h-screen fixed ">
			<div className="text-center ">
				<div className=" text-2xl border-[0.5px] h-full border-navbarcolor font-bold bg-gray-200 shadow-sm hover:bg-gray-400 transition"><Link to="/"  >BOtMAPs</Link></div>
				

				<ul className="list-none ">
					<li className="h-6 border-[0.5px] border-navbarcolor bg-gray-200 shadow-sm hover:bg-gray-400 transition ">
						<Link to="/about">About</Link>
					</li>
					<li className="h-6 border-[0.5px] border-navbarcolor bg-gray-200 shadow-sm hover:bg-gray-400 transition">
						<Link to="/events">Events</Link>
					</li>
					<li className="h-6 border-[0.5px] border-navbarcolor bg-gray-200 shadow-sm hover:bg-gray-400 transition rounded-b-[5px]">
						<Link to="/contact">Contact</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavBar;
