import React from "react";

export default function Logo({ size = "medium", variant = "light" }) {
  const sizes = {
    small: {
      container: "w-8 h-8",
      text: "text-lg",
      title: "text-xl",
    },
    medium: {
      container: "w-10 h-10",
      text: "text-xl",
      title: "text-2xl",
    },
    large: {
      container: "w-12 h-12",
      text: "text-2xl",
      title: "text-3xl",
    },
  };

  const variants = {
    light: {
      container: "bg-blue-600",
      text: "text-white",
      title: "text-white",
    },
    dark: {
      container: "bg-white",
      text: "text-blue-600",
      title: "text-gray-900",
    },
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizes[size].container} ${variants[variant].container} rounded-xl flex items-center justify-center`}
      >
        <span className={`${sizes[size].text} ${variants[variant].text} font-bold`}>TW</span>
      </div>
      <h2 className={`${sizes[size].title} ${variants[variant].title} font-bold`}>TataWarung</h2>
    </div>
  );
}
