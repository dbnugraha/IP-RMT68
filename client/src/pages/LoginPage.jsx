/* global google */
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { loginWithGoogle, loginWithEmail, clearError } from "../store/authSlice";
import Logo from "../components/Logo";
import Input from "../components/Input";
import BrandingPanel from "../components/BrandingPanel";
import FormDivider from "../components/FormDivider";
import AlertMessage from "../components/AlertMessage";
import { extractFieldErrors, getMainErrorMessage } from "../helpers/errorHelpers";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleCredentialResponse = useCallback(
    async (response) => {
      try {
        await dispatch(loginWithGoogle(response.credential)).unwrap();
        // Wait a bit to ensure token is properly set
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate("/home");
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    [dispatch, navigate],
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear field error when user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: "",
      });
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginWithEmail(formData)).unwrap();
      // Wait a bit to ensure token is properly set
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/home");
    } catch (error) {
      console.error("Email login failed:", error);
    }
  };

  // Extract field errors when error changes
  useEffect(() => {
    if (error) {
      setFieldErrors(extractFieldErrors(error));
    } else {
      setFieldErrors({});
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
    });
  }, [handleCredentialResponse]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <BrandingPanel />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Logo size="medium" variant="dark" />
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>

            {/* Error Message - Only show if there's a general error (not field-specific) */}
            <AlertMessage type="error" message={getMainErrorMessage(error)} />

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={loading}
                error={fieldErrors.email}
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={loading}
                error={fieldErrors.password}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <FormDivider />

            {/* Google Login Button */}
            <div id="buttonDiv" className="w-full"></div>
          </div>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
