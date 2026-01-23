import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import {
  fetchProducts,
  createNewProduct,
  updateExistingProduct,
  restockProductStock,
  deductStock,
  toggleStatus,
  softRemoveProduct,
} from "../store/productSlice";
import BusinessSidebar from "../components/BusinessSidebar";
import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const { businessId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  // Filter products
  const activeProducts = products.filter((product) => !product.isDeleted);
  const filteredProducts = activeProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && product.isActive) ||
      (filterStatus === "inactive" && !product.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleOpenProductModal = (product = null) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (formData) => {
    try {
      if (editingProduct) {
        await dispatch(
          updateExistingProduct({
            businessId,
            productId: editingProduct.id,
            productData: formData,
          }),
        ).unwrap();

        Swal.fire({
          title: "Success!",
          text: "Product updated successfully",
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 2000,
        });
      } else {
        await dispatch(
          createNewProduct({
            businessId,
            productData: formData,
          }),
        ).unwrap();

        Swal.fire({
          title: "Success!",
          text: "Product created successfully",
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 2000,
        });
      }

      handleCloseProductModal();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error || "Failed to save product",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(softRemoveProduct({ businessId, productId })).unwrap();

        Swal.fire({
          title: "Deleted!",
          text: "Product has been deleted",
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error || "Failed to delete product",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

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
        Swal.fire({
          title: "Error!",
          text: error || "Failed to update product status",
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
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
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
            <button
              onClick={() => handleOpenProductModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Search and Filter Bar */}
          {activeProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("active")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === "active"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterStatus("inactive")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === "inactive"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          )}

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
              <button
                onClick={() => handleOpenProductModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                Add Your First Product
              </button>
            </div>
          )}

          {/* No Results State */}
          {activeProducts.length > 0 && filteredProducts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleOpenProductModal(product)}
                  onDelete={() => handleDeleteProduct(product.id, product.name)}
                  onRestock={handleRestock}
                  onDeduct={handleDeduct}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <ProductFormModal product={editingProduct} onClose={handleCloseProductModal} onSubmit={handleSubmitProduct} />
      )}
    </div>
  );
}

// Product Form Modal Component
function ProductFormModal({ product, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    imageUrl: product?.imageUrl || "",
    description: product?.description || "",
    stockKeepingUnit: product?.stockKeepingUnit || "",
    basePrice: product?.basePrice || "",
    sellingPrice: product?.sellingPrice || "",
    stock: product?.stock || 0,
    isActive: product?.isActive ?? true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.stockKeepingUnit.trim()) {
      newErrors.stockKeepingUnit = "SKU is required";
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = "Base price must be greater than 0";
    }

    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = "Selling price must be greater than 0";
    }

    if (parseFloat(formData.sellingPrice) < parseFloat(formData.basePrice)) {
      newErrors.sellingPrice = "Selling price should be greater than or equal to base price";
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        stock: parseInt(formData.stock, 10),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="stockKeepingUnit"
              value={formData.stockKeepingUnit}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.stockKeepingUnit ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., PRD-001"
            />
            {errors.stockKeepingUnit && <p className="text-red-500 text-sm mt-1">{errors.stockKeepingUnit}</p>}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Price (Cost) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.basePrice ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.sellingPrice ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Initial Stock {!product && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.stock ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Set product as active (available for sale)
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
