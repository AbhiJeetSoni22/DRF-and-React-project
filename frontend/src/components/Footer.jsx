import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            ShopEasy
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your one-stop destination for quality products at the
            best prices. Shop smart, shop easy.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:text-green-500 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-green-500 transition"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-green-500 transition"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-green-500 transition"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-green-500 transition cursor-pointer">
              Contact Us
            </li>
            <li className="hover:text-green-500 transition cursor-pointer">
              FAQ
            </li>
            <li className="hover:text-green-500 transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-green-500 transition cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition"
            >
              🌐
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition"
            >
              🐦
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition"
            >
              📸
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} ShopEasy. All rights reserved.
          </p>
          <p className="mt-2 sm:mt-0">
            Made with ❤️ by Abhijeet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
