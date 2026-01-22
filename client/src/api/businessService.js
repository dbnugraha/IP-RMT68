import http from "../helpers/http";

/**
 * Get current user's businesses
 * @returns [{ id, name, type, imageUrl, description }]
 */
export const fetchMyBusiness = async () => {
  const { data } = await http.get("/businesses/my");
  return data;
};

/**
 * Get business by ID
 * @returns { id, name, imageUrl, description, type, address, UserId }
 */
export const fetchBusinessById = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}`);
  return data;
};

/**
 * Update business information
 * @returns { id, name, imageUrl, description, type, address, UserId }
 */
export const updateBusiness = async (businessId, businessData) => {
  const { data } = await http.put(`/businesses/${businessId}`, businessData);
  return data;
};

/**
 * Create a new business (max 3 per user)
 * @returns { id, name, imageUrl, description, type, address, UserId, createdAt, updatedAt }
 */
export const createBusiness = async (businessData) => {
  const { data } = await http.post("/businesses", businessData);
  return data;
};

/**
 * Delete a business
 * @returns { message }
 */
export const deleteBusiness = async (businessId) => {
  const { data } = await http.delete(`/businesses/${businessId}`);
  return data;
};
