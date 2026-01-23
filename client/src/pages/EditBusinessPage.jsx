import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchBusinessById, updateExistingBusiness, clearError } from "../store/businessSlice";
import Navbar from "../components/Navbar";
import BusinessForm from "../components/BusinessForm";
import AlertMessage from "../components/AlertMessage";
import { extractFieldErrors, getMainErrorMessage } from "../helpers/errorHelpers";
import Swal from "sweetalert2";

export default function EditBusinessPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { loading, selectedBusiness, error } = useSelector((state) => state.business);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    imageUrl: "",
    description: "",
    address: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch business data
    dispatch(fetchBusinessById(businessId));
  }, [isAuthenticated, businessId, dispatch, navigate]);

  useEffect(() => {
    // Populate form with existing business data
    const form = () => {
      if (selectedBusiness) {
        setFormData({
          name: selectedBusiness.name || "",
          type: selectedBusiness.type || "",
          imageUrl: selectedBusiness.imageUrl || "",
          description: selectedBusiness.description || "",
          address: selectedBusiness.address || "",
        });
      }
    };
    form();
  }, [selectedBusiness]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Extract field errors when error changes
  useEffect(() => {
    if (error) {
      setFieldErrors(extractFieldErrors(error));
    } else {
      setFieldErrors({});
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(updateExistingBusiness({ businessId, businessData: formData })).unwrap();

      await Swal.fire({
        title: "Success!",
        text: "Business updated successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        timer: 2000,
      });

      navigate(`/business/${businessId}`);
    } catch (error) {
      console.error("Failed to update business:", error);
      Swal.fire({
        title: "Error!",
        text: error || "Failed to update business. Please try again.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  if (loading && !selectedBusiness) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/business/${businessId}`)}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Business
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Business</h1>
          <p className="text-gray-600">Update your business information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Error Message - Only show if there's a general error (not field-specific) */}
          <AlertMessage type="error" message={getMainErrorMessage(error)} className="mb-6" />

          <BusinessForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            submitButtonText="Update Business"
            errors={fieldErrors}
          />
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-blue-800">
              Changes will be saved immediately. Make sure all information is correct before submitting.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
