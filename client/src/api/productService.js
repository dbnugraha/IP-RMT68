import http from "../helpers/http";

const BUSINESS_SERVICE_URL = "/businesses";

/**
 * Get all products for a business
 * @returns [{ id, name, stockKeepingUnit, basePrice, sellingPrice, stock, isActive, imageUrl, Business }]
 */
export const fetchProductsByBusiness = async (businessId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/products`);
  return data;
};

/**
 * Create a new product
 * @returns { id, BusinessId, name, imageUrl, description, stockKeepingUnit, basePrice, sellingPrice, stock, isActive }
 */
export const createProduct = async (businessId, productData) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/products`, productData);
  return data;
};

/**
 * Update product information
 * @returns { id, name, basePrice, sellingPrice, stock, ... }
 */
export const updateProduct = async (businessId, productId, productData) => {
  const { data } = await http.put(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}`, productData);
  return data;
};

/**
 * Permanently delete a product
 * @returns { message }
 */
export const deleteProduct = async (businessId, productId) => {
  const { data } = await http.delete(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}`);
  return data;
};

/**
 * Get product by ID
 * @returns { id, name, stockKeepingUnit, basePrice, sellingPrice, stock, isActive, description, Business }
 */
export const fetchProductById = async (businessId, productId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}`);
  return data;
};

/**
 * Increase product stock
 * @returns { product, transactionGenerated }
 */
export const restockProduct = async (businessId, productId, quantity, generateTransaction = false) => {
  const { data } = await http.patch(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}/restock`, {
    quantity,
    generateTransaction,
  });
  return data;
};

/**
 * Decrease product stock
 * @returns { product, transactionGenerated }
 */
export const deductProductStock = async (businessId, productId, quantity, generateTransaction = false) => {
  const { data } = await http.patch(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}/deduct-stock`, {
    quantity,
    generateTransaction,
  });
  return data;
};

/**
 * Toggle product active status
 * @returns { id, name, isActive }
 */
export const toggleProductStatus = async (businessId, productId) => {
  const { data } = await http.patch(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}/toggle-status`);
  return data;
};
