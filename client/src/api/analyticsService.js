import http from "../helpers/http";

/**
 * Get complete dashboard overview
 * @returns { business, summary, topProducts, inventory, recentTransactions }
 */
export const dashboardAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/dashboard`);
  return data;
};

// ============ FINANCIAL ANALYTICS ============

/**
 * Get financial summary with date filters
 * @returns { totalIncome, totalExpense, netProfit, profitMargin, incomeCount, expenseCount, paymentMethods }
 */
export const financialAnalytics = async (businessId, startDate, endDate) => {
  const { data } = await http.get(
    `/businesses/${businessId}/analytics/financial?startDate=${startDate}&endDate=${endDate}`,
  );
  return data;
};

/**
 * Get overall profitability metrics
 * @returns { totalRevenue, totalCost, totalProfit, profitMargin }
 */
export const profitabilityAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/profitability`);
  return data;
};

/**
 * Get payment method breakdown
 * @returns [{ paymentMethod, transactionCount, totalAmount, averageAmount }]
 */
export const paymentMethodAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/payment-methods`);
  return data;
};

/**
 * Get expense transactions list
 * @returns [{ id, totalAmount, paymentMethod, notes, createdAt }]
 */
export const expensesAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/expenses`);
  return data;
};

// ============ PRODUCT ANALYTICS ============

/**
 * Get top selling products
 * @returns [{ ProductId, totalQuantitySold, totalRevenue, Product: {...} }]
 */
export const topSellingProductsAnalytics = async (businessId, limit) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/top-products?limit=${limit}`);
  return data;
};

/**
 * Get profitability per product
 * @returns [{ product: {...}, totalSold, totalRevenue, totalCost, totalProfit, profitMargin }]
 */
export const productProfitabilityAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/product-profitability`);
  return data;
};

/**
 * Get product performance metrics
 * @returns { topPerformers: [...], lowPerformers: [...] }
 */
export const productPerformanceAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/product-performance`);
  return data;
};

/**
 * Get inventory status and alerts
 * @returns { lowStock: [...], outOfStock: [...], inStock: [...], totalProducts, lowStockCount, outOfStockCount }
 */
export const inventoryAnalytics = async (businessId, threshold) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/inventory?threshold=${threshold}`);
  return data;
};

// ============ TRENDS ============

/**
 * Get sales trends over time
 * @param period - 'daily' | 'weekly' | 'monthly'
 * @returns [{ period, totalSales, transactionCount, averageTransaction }]
 */
export const salesTrendsAnalytics = async (businessId, period, startDate, endDate) => {
  const { data } = await http.get(
    `/businesses/${businessId}/analytics/sales-trends?period=${period}&startDate=${startDate}&endDate=${endDate}`,
  );
  return data;
};
