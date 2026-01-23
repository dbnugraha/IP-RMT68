import React from "react";
import Input from "./Input";

const BUSINESS_TYPES = [
  "Technology Services",
  "Food & Beverage",
  "Marketing & Advertising",
  "Retail",
  "Agriculture & Commodities",
  "Other",
];

export default function BusinessForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  submitButtonText = "Create Business",
  errors = {},
}) {
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        label="Business Name"
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="My Warung"
        disabled={loading}
        error={errors.name}
      />

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Business Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          disabled={loading}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 ${
            errors.type ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select a type</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
      </div>

      <Input
        label="Image URL"
        id="imageUrl"
        name="imageUrl"
        type="url"
        value={formData.imageUrl}
        onChange={handleInputChange}
        placeholder="https://example.com/image.jpg"
        disabled={loading}
        error={errors.imageUrl}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Tell us about your business..."
          disabled={loading}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <Input
        label="Address"
        id="address"
        name="address"
        type="text"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="123 Main St, City, Country"
        disabled={loading}
        error={errors.address}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (submitButtonText === "Update Business" ? "Updating..." : "Creating...") : submitButtonText}
      </button>
    </form>
  );
}
