import { createContext, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  // ---------------- STATE ----------------
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- toggleLoading (same name) ----------------
  const toggleLoading = () => {
    setLoading((prev) => !prev);
  };

  // ---------------- getAllProducts (same name) ----------------
  const getAllProducts = async () => {
    toggleLoading();
    setError("");

    try {
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(query(productsRef));

      const productsData = productsSnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      toggleLoading();
    }
  };

  // ---------------- filterProducts (same name) ----------------
  const filterProducts = (filterObj) => {
    const {
      searchQuery,
      priceRange,
      categories: { mensFashion, womensFashion, jewelery, electronics },
    } = filterObj;

    let filtered = products;

    // Search by title
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filtering
    if (mensFashion || womensFashion || jewelery || electronics) {
      filtered = filtered.filter((p) => {
        if (mensFashion && p.category === "men's clothing") return true;
        if (womensFashion && p.category === "women's clothing") return true;
        if (electronics && p.category === "electronics") return true;
        if (jewelery && p.category === "jewelery") return true;
        return false;
      });
    }

    // Price filter
    if (priceRange) {
      filtered = filtered.filter((p) => p.price < priceRange);
    }

    setFilteredProducts(filtered);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        cartProducts,
        loading,
        error,

        // SAME function names
        getAllProducts,
        filterProducts,
        setProducts,
        setFilteredProducts,
        setCartProducts,
        setError,
        toggleLoading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
