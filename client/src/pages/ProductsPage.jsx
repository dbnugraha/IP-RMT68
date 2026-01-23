import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { fetchProducts, restockProductStock, deductStock, toggleStatus } from "../store/productSlice";
import BusinessSidebar from "../components/BusinessSidebar";
import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const { businessId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { products, loading } = useSelector((state) => state.product);
  const { selectedBusiness } = useSelector((state) => state.business);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (businessId) {
      dispatch(fetchProducts(businessId));
    }
  }, [dispatch, businessId, isAuthenticated, navigate]);

  const handleRestock = async (productId, productName) => {
    const { value: formValues } = await Swal.fire({
      title: `Restock ${productName}`,
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity to Add</label>
            <input id="quantity" type="number" min="1" class="swal2-input" placeholder="Enter quantity">
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="createTransaction" class="w-4 h-4">
            <label for="createTransaction" class="text-sm text-gray-700">Generate transaction record</label>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Restock",
      preConfirm: () => {
        const quantityValue = document.getElementById("quantity").value;
        const quantity = parseInt(quantityValue, 10);
        const createTransaction = document.getElementById("createTransaction").checked;

        if (!quantityValue || isNaN(quantity) || quantity <= 0) {
          Swal.showValidationMessage("Please enter a valid positive quantity");
          return false;
        }

        return { quantity, createTransaction };
      },
    });

    if (formValues) {
      try {
        await dispatch(restockProductStock({ businessId, productId, quantity: formValues.quantity })).unwrap();

        Swal.fire({
          title: "Success!",
          text: `Stock updated successfully. ${formValues.createTransaction ? "Transaction recorded." : ""}`,
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error || "Failed to restock product",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const handleDeduct = async (productId, productName, currentStock) => {
    const { value: formValues } = await Swal.fire({
      title: `Deduct Stock - ${productName}`,
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity to Deduct</label>
            <input id="quantity" type="number" min="1" max="${currentStock}" class="swal2-input" placeholder="Enter quantity">
            <p class="text-xs text-gray-500 mt-1">Available: ${currentStock} units</p>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="createTransaction" class="w-4 h-4">
            <label for="createTransaction" class="text-sm text-gray-700">Generate transaction record</label>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Deduct",
      preConfirm: () => {
        const quantityValue = document.getElementById("quantity").value;
        const quantity = parseInt(quantityValue, 10);
        const createTransaction = document.getElementById("createTransaction").checked;

        if (!quantityValue || isNaN(quantity) || quantity <= 0) {
          Swal.showValidationMessage("Please enter a valid positive quantity");
          return false;
        }

        if (quantity > currentStock) {
          Swal.showValidationMessage(`Cannot deduct more than available stock (${currentStock})`);
          return false;
        }

        return { quantity, createTransaction };
      },
    });

    if (formValues) {
      try {
        await dispatch(deductStock({ businessId, productId, quantity: formValues.quantity })).unwrap();

        Swal.fire({
          title: "Success!",
          text: `Stock deducted successfully. ${formValues.createTransaction ? "Transaction recorded." : ""}`,
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error || "Failed to deduct stock",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const handleToggleStatus = async (productId, productName, currentStatus) => {
    const result = await Swal.fire({
      title: `${currentStatus ? "Deactivate" : "Activate"} Product?`,
      text: `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} "${productName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${currentStatus ? "deactivate" : "activate"} it`,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(toggleStatus({ businessId, productId })).unwrap();

        Swal.fire({
          title: "Success!",
          text: `Product ${currentStatus ? "deactivated" : "activated"} successfully`,
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 2000,
        });
      } catch (error) {
        console.log(error);

        Swal.fire({
          title: "Error!",
          text: error || "Failed to update product status",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  // Filter out deleted products
  const activeProducts = products.filter((product) => !product.isDeleted);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BusinessSidebar
        business={selectedBusiness}
        businessId={businessId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-sm text-gray-500">Manage your product inventory</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Empty State */}
          {activeProducts.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No products yet</h2>
              <p className="text-gray-600 mb-8">Get started by adding your first product</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm">
                Add Your First Product
              </button>
            </div>
          )}

          {/* Products Grid */}
          {activeProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRestock={handleRestock}
                  onDeduct={handleDeduct}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
