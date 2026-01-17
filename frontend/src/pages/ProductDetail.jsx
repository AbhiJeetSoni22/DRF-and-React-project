import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/auth";

const ProductDetail = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  const handleBuyNow = async () => {
    const token = getAccessToken();

    if (!token) {
      navigate("/login");
      return;
    }

    // Add product to cart first
    await addToCart(product);

    // Go directly to checkout
    navigate("/checkout");
  };

  const handleAddToCart = () => {
    const token = getAccessToken();

    if (!token) {
      // 🔐 User not logged in → redirect to login
      navigate("/login");
      return;
    }

    addToCart(product);
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASEURL}/api/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Product is loading");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, BASEURL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-blue-500 font-medium text-lg">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 font-medium text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-gray-500 mt-20">Product not found</div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* 🔙 Back Button */}
        <div className="flex justify-end mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow text-gray-700 hover:text-green-600 hover:shadow-md transition"
          >
            ← Back
          </Link>
        </div>

        {/* Product Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl p-8">
          {/* Image */}
          <div className="flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[420px] object-cover rounded-xl shadow"
              />
            ) : (
              <div className="w-full h-[420px] bg-gray-200 flex items-center justify-center rounded-xl">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              <p className="text-3xl font-bold text-green-600 mb-8">
                ₹ {product.price}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl text-lg font-medium hover:bg-gray-200 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
