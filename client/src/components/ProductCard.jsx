import React from "react";

export default function ProductCard({ product, onRestock, onDeduct, onToggleStatus }) {
  const isInactive = !product.isActive;
  const isLowStock = product.stock <= (product.minStock || 10);

  const getStockStatus = () => {
    if (product.stock === 0) return { text: "Out of Stock", color: "text-red-600 bg-red-100" };
    if (isLowStock) return { text: "Low Stock", color: "text-orange-600 bg-orange-100" };
    return { text: "In Stock", color: "text-green-600 bg-green-100" };
  };

  const stockStatus = getStockStatus();

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all ${
        isInactive ? "opacity-50" : "hover:shadow-lg"
      }`}
    >
      {/* Product Image */}
      <div className="h-48 bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-white text-5xl font-bold">{product.name.charAt(0).toUpperCase()}</div>
        )}
        {isInactive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">Inactive</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Name and Status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* SKU */}
        {product.stockKeepingUnit && <p className="text-xs text-gray-500">SKU: {product.stockKeepingUnit}</p>}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Sell Price</p>
            <p className="text-lg font-bold text-blue-600">Rp {product.sellingPrice?.toLocaleString() || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Buy Price</p>
            <p className="text-sm font-semibold text-gray-700">Rp {product.basePrice?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Stock Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Stock</span>
            <span className="text-xl font-bold text-gray-900">{product.stock}</span>
          </div>
          {product.minStock && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Min Stock</span>
              <span>{product.minStock}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onRestock(product.id, product.name)}
            disabled={isInactive}
            className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Restock
          </button>
          <button
            onClick={() => onDeduct(product.id, product.name, product.stock)}
            disabled={isInactive || product.stock === 0}
            className="flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            Deduct
          </button>
        </div>

        {/* Toggle Status Button */}
        <button
          onClick={() => onToggleStatus(product.id, product.name, product.isActive)}
          className={`w-full font-semibold px-3 py-2 rounded-lg transition-colors text-sm ${
            isInactive ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
        >
          {isInactive ? "Activate Product" : "Deactivate Product"}
        </button>
      </div>
    </div>
  );
}
