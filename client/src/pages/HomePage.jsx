import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchMyBusinesses, removeBusiness, selectBusiness } from "../store/businessSlice";
import { clearTransactions } from "../store/transactionSlice";
import { clearInsights } from "../store/aiInsightSlice";
import { clearAnalytics } from "../store/analyticsSlice";
import Navbar from "../components/Navbar";
import BusinessCard from "../components/BusinessCard";
import AlertMessage from "../components/AlertMessage";
import Swal from "sweetalert2";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { businesses, loading, error } = useSelector((state) => state.business);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(selectBusiness(null));
    dispatch(clearTransactions());
    dispatch(clearInsights());
    dispatch(clearAnalytics());
    dispatch(fetchMyBusinesses());
  }, [dispatch, isAuthenticated, navigate]);

  const handleBusinessClick = (businessId) => {
    navigate(`/business/${businessId}`);
  };

  const handleCreateBusiness = () => {
    navigate("/business/create");
  };

  const handleEditBusiness = (businessId) => {
    navigate(`/business/${businessId}/edit`);
  };

  const handleDeleteBusiness = async (businessId, businessName) => {
    const result = await Swal.fire({
      title: "Delete Business?",
      html: `Are you sure you want to delete <strong>"${businessName}"</strong>?<br><br>This action cannot be undone. All associated data will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(removeBusiness(businessId)).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `"${businessName}" has been deleted successfully.`,
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 2000,
        });
      } catch (error) {
        console.error("Failed to delete business:", error);
        Swal.fire({
          title: "Error!",
          text: error || "Failed to delete business. Please try again.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Businesses</h1>
          <p className="text-gray-600">Manage and monitor all your warung businesses in one place</p>
        </div>

        {/* Error Message */}
        <AlertMessage type="error" message={error} />

        {/* Empty State */}
        {businesses.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No businesses yet</h2>
            <p className="text-gray-600 mb-8">Get started by creating your first business</p>
            <button
              onClick={handleCreateBusiness}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
            >
              Create Your First Business
            </button>
          </div>
        )}

        {/* Business Grid */}
        {businesses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                You have {businesses.length} business{businesses.length > 1 ? "es" : ""}
                {businesses.length >= 3 && " (maximum reached)"}
              </p>
              {businesses.length < 3 && (
                <button
                  onClick={handleCreateBusiness}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Business
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onClick={handleBusinessClick}
                  onEdit={handleEditBusiness}
                  onDelete={handleDeleteBusiness}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
