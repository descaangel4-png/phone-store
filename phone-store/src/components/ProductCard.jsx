import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="product-card">
      <img
        src={product.thumbnail}
        alt={product.title}
      />

      <div className="product-info">
        <h3>{product.title}</h3>
        <p>{product.brand || "Smartphone"}</p>

        <h2>${product.price}</h2>

        <p>⭐ {product.rating}</p>

        <button
          className="favorite-btn"
          onClick={() => toggleFavorite(product)}
        >
          {isFavorite(product.id)
            ? "❤️ Saved"
            : "🤍 Add Favorite"}
        </button>

        <Link
          className="details-btn"
          to={`/product/${product.id}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}