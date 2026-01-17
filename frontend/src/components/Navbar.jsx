import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearToken, getAccessToken } from "../utils/auth";

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const isLoggedIn = !!getAccessToken();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 tracking-wide"
        >
          ShopEasy
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Auth Links */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium transition"
            >
              Logout
            </button>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center text-gray-700 hover:text-green-600 transition"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
