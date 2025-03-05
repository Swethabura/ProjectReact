import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import "./Navbar.css";
import logoLight from "../../assets/devconnect (2).png";
import { Button } from "antd";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header>
      <div className="logoSec">
        <div className="logo">
          <img src={logoLight} alt="logo" width={65} height={60} />
        </div>
        <span className="logo-title">
          <strong>DevConnect</strong> Code. Connect. Collaborate
        </span>
      </div>

      {/* Hamburger Menu */}
      <div className="linkContainer">
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </div>
      <nav className={menuOpen ? "nav-active" : ""}>
        <ul>
          <li>
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="navlinks"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="features"
              smooth={true}
              duration={500}
              className="navlinks"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              to="community"
              smooth={true}
              duration={500}
              className="navlinks"
              onClick={() => setMenuOpen(false)}
            >
              Community
            </Link>
          </li>
          <li>
            <Link
              to="contact"
              smooth={true}
              duration={500}
              className="navlinks"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
        </ul>
        <Button onClick={() => setMenuOpen(false)} className="login-Btn">
          <RouterLink to="/login" className="log-in">
            Login
          </RouterLink>
        </Button>    
      </nav>
       {/* Theme Toggle Button */}
       <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? <FiMoon size={22} /> : <FiSun size={22} />}
      </button>
      </div>
    </header>
  );
}

export default Navbar;
