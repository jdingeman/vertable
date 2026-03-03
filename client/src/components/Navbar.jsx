import { Link, NavLink } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Vertable</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li className="navbar-hamburger-divider">
          <button className="navbar-hamburger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
