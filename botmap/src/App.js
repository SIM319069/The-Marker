import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Events from './components/Events';
import NavBar from './components/NavBar'; 
import Summary from './components/Summary';
import ContactUs from './components/Contact';

function App() {
    return (
        <Router>
            <div className="flex flex-col justify-center items-center">
                <NavBar />
                <div>
                    <Routes>
                        <Route path="/" element={<Summary />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/contact" element={<ContactUs />}/>
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
export default App;

