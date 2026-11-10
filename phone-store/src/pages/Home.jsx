import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_URL =
  "https://dummyjson.com/products/category/smartphones";

export default function Home() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  useEffect(() => {
    let ignore = false;

    async function fetchPhones() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch smartphones.");
        }

        const data = await response.json();

        if (!ignore) {
          setPhones(data.products || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchPhones();

    return () => {
      ignore = true;
    };
  }, [retry]);

  useEffect(() => {
    setPage(1);
  }, [search, brand, sort]);

  const brands = [
    ...new Set(phones.map((phone) => phone.brand).filter(Boolean))
  ].sort();

  let filtered = phones.filter((phone) => {
    const matchesSearch =
      phone.title.toLowerCase().includes(search.toLowerCase()) ||
      (phone.brand || "").toLowerCase().includes(search.toLowerCase());

    const matchesBrand =
      brand === "all" || phone.brand === brand;

    return matchesSearch && matchesBrand;
  });

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const totalPages = Math.ceil(filtered.length / pageSize);

  const displayedPhones = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <>
      <section className="hero">
        <h1>Find Your Perfect Smartphone</h1>
        <p>Explore our smartphone collection.</p>
      </section>

      <section className="catalog">
        <h2>Our Smartphones</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="all">All Brands</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        {loading && (
          <h3 className="status">Loading smartphones...</h3>
        )}

        {error && (
          <div className="status error">
            <p>{error}</p>
            <button onClick={() => setRetry((n) => n + 1)}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="status">No smartphones found.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p>Showing {displayedPhones.length} of {filtered.length} phones</p>

            <div className="product-grid">
              {displayedPhones.map((phone) => (
                <ProductCard key={phone.id} product={phone} />
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}