import React from "react";

export default function AlertMessage({ type = "error", message, className = "" }) {
  const variants = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  if (!message) return null;

  // Handle both string messages and error objects with details
  const isErrorObject = typeof message === "object" && message !== null;
  const mainMessage = isErrorObject ? message.message : message;
  const details = isErrorObject ? message.details : null;

  return (
    <div className={`mb-6 p-4 border rounded-lg text-sm ${variants[type]} ${className}`}>
      <p className="font-medium">{mainMessage}</p>
      {details && details.length > 0 && (
        <ul className="mt-2 ml-4 list-disc space-y-1">
          {details.map((detail, index) => (
            <li key={index}>
              <span className="font-medium">{detail.field}:</span> {detail.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
