import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Details() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function getProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://dummyjson.com/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found.");
        }

        const data = await response.json();

        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    getProduct();

    return () => {
      ignore = true;
    };
  }, [id, retry]);

  if (loading) return <h2 className="status">Loading details...</h2>;

  if (error) {
    return (
      <div className="status error">
        <p>{error}</p>
        <button onClick={() => setRetry((n) => n + 1)}>
          Retry
        </button>
        <Link to="/">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <img src={product.thumbnail} alt={product.title} />

      <div>
        <h1>{product.title}</h1>
        <h3>Brand: {product.brand || "Unknown"}</h3>
        <h2>${product.price}</h2>

        <p>⭐ Rating: {product.rating}</p>
        <p>Stock: {product.stock}</p>
        <p>{product.description}</p>

        <button
          className="favorite-btn"
          onClick={() => toggleFavorite(product)}
        >
          {isFavorite(product.id)
            ? "❤️ Remove from Favorites"
            : "🤍 Add to Favorites"}
        </button>

        <br /><br />

        <Link to="/" className="details-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}