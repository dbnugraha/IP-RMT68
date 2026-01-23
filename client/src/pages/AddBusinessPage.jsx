import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createNewBusiness, clearError } from "../store/businessSlice";
import Navbar from "../components/Navbar";
import BusinessForm from "../components/BusinessForm";

export default function AddBusinessPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, businesses } = useSelector((state) => state.business);
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log(error);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    imageUrl: "",
    description: "",
    address: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user already has 3 businesses
    if (businesses.length >= 3) {
      navigate("/home");
    }
  }, [isAuthenticated, businesses, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(createNewBusiness(formData)).unwrap();
      // Navigate to the newly created business page
      navigate(`/business/${result.id}`);
    } catch (error) {
      console.error("Failed to create business:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Business</h1>
          <p className="text-gray-600">Add a new warung business to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <BusinessForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-blue-900 font-semibold mb-1">Business Limit</h3>
              <p className="text-blue-800 text-sm">
                You can manage up to 3 businesses per account. You currently have {businesses.length} business
                {businesses.length !== 1 ? "es" : ""}.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
