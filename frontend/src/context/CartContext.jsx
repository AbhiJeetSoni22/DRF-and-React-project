import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../utils/auth"; // ✅ auth helper

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // ✅ Axios instance (token-aware)
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // 🔐 Attach token if available
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const recalcTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  // ✅ Fetch cart (session based)
  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart/");
      setCartItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Fetch cart failed", err);
    }
  };

  // 🔄 App load
  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      let updated;

      if (existing) {
        updated = prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }

      recalcTotal(updated);
      return updated;
    });

    try {
      await api.post("/api/cart/add/", {
        product_id: product.id,
        quantity: 1,
      });
    } catch (err) {
      console.error("Add sync failed", err);
      fetchCart();
    }
  };

  // ✅ UPDATE QUANTITY
  const updateQuantity = async (id, qty) => {
    setCartItems((prev) => {
      const updated =
        qty <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) =>
              i.id === id ? { ...i, quantity: qty } : i
            );

      recalcTotal(updated);
      return updated;
    });

    try {
      await api.post("/api/cart/update/", {
        product_id: id,
        quantity: qty,
      });
    } catch (err) {
      console.error("Update sync failed", err);
      fetchCart();
    }
  };

  // ✅ REMOVE
  const removeFromCart = async (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      recalcTotal(updated);
      return updated;
    });

    try {
      await api.post("/api/cart/remove/", {
        product_id: id,
      });
    } catch (err) {
      console.error("Remove sync failed", err);
      fetchCart();
    }
  };

  // ✅ CLEAR (frontend only; backend already clear after order)
  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
