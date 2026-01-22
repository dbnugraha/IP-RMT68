import http from "../helpers/http";

const BUSINESS_SERVICE_URL = "/businesses";

export const fetchProductsByBusiness = async (businessId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/products`);
  return data;
};

export const createProduct = async (businessId, productData) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/products`, productData);
  return data;
};

export const updateProduct = async (businessId, productId, productData) => {
  const { data } = await http.put(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}`, productData);
  return data;
};

export const deleteProduct = async (businessId, productId) => {
  const { data } = await http.delete(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}`);
  return data;
};

export const softDeleteProduct = async (businessId, productId) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}/soft-delete`);
  return data;
};

export const fetchProductById = async (businessId, productId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}`);
  return data;
};

export const restockProduct = async (businessId, productId, quantity) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}/restock`, { quantity });
  return data;
};

export const deductProductStock = async (businessId, productId, quantity) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}/deduct-stock`, {
    quantity,
  });
  return data;
};
export const toggleProductStatus = async (businessId, productId) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/products/${productId}/toggle-status`);
  return data;
};
