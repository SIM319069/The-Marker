import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from "./components/Events";
import NavBar from "./components/NavBar";

const App = () => {
	return (
		<Router>
			<div className="">
				<NavBar />
				<Routes>
					<Route path="/about" element={<about />} />
					<Route path="/events" element={<Events />} />
					<Route path="/contact" element={<contact />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
