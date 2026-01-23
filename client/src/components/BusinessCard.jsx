import React from "react";

export default function BusinessCard({ business, onClick, onDelete, onEdit }) {
  // Function to get color based on business type
  const getTypeColor = (type) => {
    const typeColors = {
      retail: "bg-purple-100 text-purple-800",
      food: "bg-orange-100 text-orange-800",
      restaurant: "bg-red-100 text-red-800",
      cafe: "bg-amber-100 text-amber-800",
      grocery: "bg-green-100 text-green-800",
      market: "bg-teal-100 text-teal-800",
      warung: "bg-emerald-100 text-emerald-800",
      shop: "bg-cyan-100 text-cyan-800",
      store: "bg-sky-100 text-sky-800",
      general: "bg-blue-100 text-blue-800",
    };

    // Convert type to lowercase for matching
    const normalizedType = (type || "general").toLowerCase();

    // Return predefined color or generate one based on first character
    if (typeColors[normalizedType]) {
      return typeColors[normalizedType];
    }

    // Generate color based on first character of type for consistency
    const colors = [
      "bg-pink-100 text-pink-800",
      "bg-rose-100 text-rose-800",
      "bg-indigo-100 text-indigo-800",
      "bg-violet-100 text-violet-800",
      "bg-fuchsia-100 text-fuchsia-800",
      "bg-lime-100 text-lime-800",
    ];

    const index = normalizedType.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    onDelete(business.id, business.name);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent card click when clicking edit
    onEdit(business.id);
  };

  return (
    <div
      onClick={() => onClick(business.id)}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:scale-[1.02]"
    >
      {/* Business Image */}
      <div className="h-48 bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
        {business.imageUrl ? (
          <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-white text-6xl font-bold">{business.name.charAt(0).toUpperCase()}</div>
        )}
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors shadow-lg"
            title="Edit business"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-lg"
            title="Delete business"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Business Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{business.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{business.description || "No description"}</p>
        <div className="flex items-center justify-between">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(business.type)}`}>
            {business.type || "General"}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
