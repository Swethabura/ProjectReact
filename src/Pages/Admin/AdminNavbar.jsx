import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        <h2>DevConnect Admin</h2>
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/posts">Posts</Link>
          <Link to="/admin/questions">Questions</Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
