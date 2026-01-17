import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const { cartItems, total, clearCart, removeFromCart, updateQuantity } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <p className="text-xl text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white shadow rounded-lg"
            >
              {/* Image */}
              {item.image && (
                <img
                  src={`${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
              )}

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>

                <p className="text-gray-500">₹ {item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    −
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white shadow rounded-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2 text-gray-700">
            <span>Subtotal</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-4 text-gray-700">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between text-lg font-bold border-t pt-4">
            <span>Total</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="block w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-center hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </Link>
          <button
            onClick={clearCart}
            className="w-full mt-3 border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
