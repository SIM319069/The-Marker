import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaInfoCircle, FaCalendarAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import logo from '../Images/marker_logo.png';

function NavBar() {
    const [isOpen, setIsOpen] = useState(true);
    let navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={`fixed top-0 left-0 h-screen opacity-50 ${isOpen ? 'w-40' : 'w-16'} bg-white text-gray-800 shadow-lg transition-all duration-300`}>
            <div className="flex flex-col items-center py-4">
                <button
                    onClick={toggleSidebar}
                    className="absolute top-2 right-1 p-2 text-gray-800 hover:text-blue-500 focus:outline-none"
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                {isOpen && (
                    <div className="flex flex-col items-center mt-6">
                        <Link to="/" className="flex flex-col items-center text-gray-800 text-2xl font-bold">
                            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full mb-3" />
                            <span className="text-sm">BOtMAPs</span>
                        </Link>
                    </div>
                )}
                <ul className="w-full mt-6">
                    {isOpen ? (
                        <>
                            <li className="group flex items-center py-4 px-6 hover:bg-gray-100 transition cursor-pointer" onClick={() => navigateTo('/about')}>
                                <FaInfoCircle className="text-lg mr-3 group-hover:text-blue-500 transition" />
                                <span className="text-base group-hover:text-blue-500 transition">About</span>
                            </li>
                            <li className="group flex items-center py-4 px-6 hover:bg-gray-100 transition cursor-pointer" onClick={() => navigateTo('/events')}>
                                <FaCalendarAlt className="text-lg mr-3 group-hover:text-blue-500 transition" />
                                <span className="text-base group-hover:text-blue-500 transition">Events</span>
                            </li>
                            <li className="group flex items-center py-4 px-6 hover:bg-gray-100 transition cursor-pointer" onClick={() => navigateTo('/contact')}>
                                <FaEnvelope className="text-lg mr-3 group-hover:text-blue-500 transition" />
                                <span className="text-base group-hover:text-blue-500 transition">Contact</span>
                            </li>
                        </>
                    ) : (
                        <li>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
