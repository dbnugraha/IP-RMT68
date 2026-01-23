import React from "react";
import Logo from "./Logo";

export default function BrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="mb-12">
          <Logo size="large" variant="dark" />
        </div>

        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          Manage Your Business
          <br />
          with Confidence
        </h1>
        <p className="text-xl text-blue-100">
          Streamline inventory, track sales, and grow your warung business with powerful analytics.
        </p>
      </div>

      <div className="relative z-10 text-blue-100 text-sm">© 2026 TataWarung. All rights reserved.</div>
    </div>
  );
}
