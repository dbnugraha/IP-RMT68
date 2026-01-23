import React from "react";

export default function AlertMessage({ type = "error", message, className = "" }) {
  const variants = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  if (!message) return null;

  return <div className={`mb-6 p-4 border rounded-lg text-sm ${variants[type]} ${className}`}>{message}</div>;
}
