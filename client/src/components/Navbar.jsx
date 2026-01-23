import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import Logo from "./Logo";

export default function Navbar({ showLogout = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <Logo size="medium" variant="dark" />
          </div>
          {showLogout && (
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 font-medium">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
