import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';  // Import the CSS file for the nav bar

function NavBar() {
  return (
    <nav className="NavBar">
      <h2><Link to="/">Botmaps</Link></h2>
      <ul>
        
        <li><Link to="/about">About</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
