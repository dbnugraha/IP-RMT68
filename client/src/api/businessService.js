import http from "../helpers/http";

export const fetchMyBusiness = async () => {
  const { data } = await http.get("/businesses/my");
  return data;
};

export const fetchBusinessById = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}`);
  return data;
};

export const updateBusiness = async (businessId, businessData) => {
  const { data } = await http.put(`/businesses/${businessId}`, businessData);
  return data;
};

export const createBusiness = async (businessData) => {
  const { data } = await http.post("/businesses", businessData);
  return data;
};

export const deleteBusiness = async (businessId) => {
  const { data } = await http.delete(`/businesses/${businessId}`);
  return data;
};
