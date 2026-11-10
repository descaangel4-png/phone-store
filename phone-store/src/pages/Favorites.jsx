import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section className="catalog">
      <h1>❤️ My Favorite Phones</h1>

      {favorites.length === 0 ? (
        <div className="status">
          <h3>No favorite phones yet.</h3>
          <Link to="/" className="details-btn">
            Browse Smartphones
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map((phone) => (
            <ProductCard key={phone.id} product={phone} />
          ))}
        </div>
      )}
    </section>
  );
}