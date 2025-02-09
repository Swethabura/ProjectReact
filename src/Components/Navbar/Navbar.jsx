import { useState } from "react";
import { Link } from "react-scroll";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons
import "./Navbar.css";
import logo1 from "../../assets/logo_transparent2.png"; 

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="logoSec">
        <div className="logo">
          <img src={logo1} alt="logo" width={110} height={70} />
        </div>
        <span className="logo-title">
          <h1>DevConnect</h1>
          <p>Code. Connect. Collaborate</p>
        </span>
      </div>

      {/* Hamburger Menu (Visible Below 768px) */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </div>

      <nav className={menuOpen ? "nav-active" : ""}>
        <ul>
          <li><Link to="home" smooth={true} duration={500} className="navlinks" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="features" smooth={true} duration={500} className="navlinks" onClick={() => setMenuOpen(false)}>Features</Link></li>
          <li><Link to="community" smooth={true} duration={500} className="navlinks" onClick={() => setMenuOpen(false)}>Community</Link></li>
          <li><Link to="contact" smooth={true} duration={500} className="navlinks" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>
        <button onClick={() => setMenuOpen(false)}>Login</button>
      </nav>
    </header>
  );
}

export default Navbar;
