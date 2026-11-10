import { NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Navbar() {
  const { favorites } = useFavorites();

  return (
    <nav className="navbar">
      <h2>📱 PhoneStore</h2>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/favorites">
          Favorites ({favorites.length})
        </NavLink>
      </div>
    </nav>
  );
}