// Button variants
export const buttonVariants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700",
  warning: "bg-yellow-600 text-white hover:bg-yellow-700",
};

// Badge/Tag variants (example for other components)
export const badgeVariants = {
  primary: "bg-blue-100 text-blue-800 border-blue-200",
  secondary: "bg-gray-100 text-gray-800 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

// Alert variants (example for other components)
export const alertVariants = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  danger: "bg-red-50 border-red-200 text-red-800",
};

// Common base styles
export const baseStyles = {
  button: "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  input: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent",
  card: "bg-white rounded-lg shadow-xl p-8",
  badge: "px-2 py-1 rounded text-xs font-semibold border",
};

// Color palette (for custom styling)
export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    300: "#d1d5db",
    600: "#4b5563",
    700: "#374151",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    600: "#dc2626",
    700: "#b91c1c",
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    600: "#16a34a",
    700: "#15803d",
  },
};
