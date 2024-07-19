import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';  // Import the CSS file for the nav bar

function NavBar() {
  return (
    <nav className="w-200 bg-navbarcolor text-white p-[20px] h-screen fixed">
      <h2 className='mb-[20px]'><Link to="/">Botmaps</Link></h2>
      <ul className='list-none p-0'>
        
        <li className='mb-[10px] no-underline hover:underline bg-red-200'><Link to="/about">About</Link></li>
        <li className='mb-[10px] no-underline hover:underline bg-red-200'><Link to="/events">Events</Link></li>
        <li className='mb-[10px] no-underline hover:underline bg-red-200'><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
