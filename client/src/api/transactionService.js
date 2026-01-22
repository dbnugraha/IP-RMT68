import http from "../helpers/http";

const BUSINESS_SERVICE_URL = "/businesses";

/**
 * Get all transactions for a business
 * @returns [{ id, BusinessId, type, totalAmount, paymentMethod, notes, createdAt }]
 */
export const fetchTransactionsByBusiness = async (businessId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/transactions`);
  return data;
};

/**
 * Get transaction statistics
 * @returns { totalIncome, totalExpense, netProfit, incomeCount, expenseCount }
 */
export const fetchTransactionStats = async (businessId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/transactions/stats`);
  return data;
};

/**
 * Create a new transaction
 * @returns { id, BusinessId, type, totalAmount, paymentMethod, notes, createdAt }
 */
export const createTransaction = async (businessId, transactionData) => {
  const { data } = await http.post(`${BUSINESS_SERVICE_URL}/${businessId}/transactions`, transactionData);
  return data;
};

/**
 * Get transaction by ID
 * @returns { id, BusinessId, type, totalAmount, paymentMethod, notes, Business }
 */
export const fetchTransactionById = async (businessId, transactionId) => {
  const { data } = await http.get(`${BUSINESS_SERVICE_URL}/${businessId}/transactions/${transactionId}`);
  return data;
};

/**
 * Update transaction
 * @returns { id, type, totalAmount, paymentMethod, notes }
 */
export const updateTransaction = async (businessId, transactionId, transactionData) => {
  const { data } = await http.put(
    `${BUSINESS_SERVICE_URL}/${businessId}/transactions/${transactionId}`,
    transactionData,
  );
  return data;
};

/**
 * Delete a transaction
 * @returns { message }
 */
export const deleteTransaction = async (businessId, transactionId) => {
  const { data } = await http.delete(`${BUSINESS_SERVICE_URL}/${businessId}/transactions/${transactionId}`);
  return data;
};
