import http from "../helpers/http";

const BUSINESS_SERVICE_URL = "/businesses";

export const fetchTransactionsByBusiness = async (businessId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/transactions`);
  return data;
};

export const fetchTransactionStats = async (businessId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/transactions/stats`);
  return data;
};

export const createTransaction = async (businessId, transactionData) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/transactions`, transactionData);
  return data;
};

export const fetchTransactionById = async (businessId, transactionId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/transactions/${transactionId}`);
  return data;
};

export const updateTransaction = async (businessId, transactionId, transactionData) => {
  const { data } = await http.put(
    `${BUSINESS_SERVICE_URL}/${businessId}/transactions/${transactionId}`,
    transactionData,
  );
  return data;
};

export const deleteTransaction = async (businessId, transactionId) => {
  const { data } = await http.delete(`${BUSINESS_SERVICE_URL}/${businessId}/transactions/${transactionId}`);
  return data;
};
