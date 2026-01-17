import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`product/${product.id}`}>
    <div className="border cursor-pointer rounded-lg p-4 hover:shadow-md transition bg-white">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}

      <h2 className="text-lg font-semibold text-gray-800">
        {product.name}
      </h2>

   

      <p className="text-green-600 font-bold mt-2">
        ₹ {product.price}
      </p>
    </div>
    </Link>
  );
}

export default ProductCard;
