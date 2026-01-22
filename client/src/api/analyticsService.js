import http from "../helpers/http";

export const dashboardAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/dashboard`);
  return data;
};

//financial analytics
export const financialAnalytics = async (businessId, startDate, endDate) => {
  const { data } = await http.get(
    `/businesses/${businessId}/analytics/financial?startDate=${startDate}&endDate=${endDate}`,
  );
  return data;
};
export const profitabilityAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/profitability`);
  return data;
};

export const paymentMethodAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/payment-methods`);
  return data;
};

export const expensesAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/expenses`);
  return data;
};

//Product analytics
export const topSellingProductsAnalytics = async (businessId, limit) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/top-products?limit=${limit}`);
  return data;
};

export const productProfitabilityAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/product-profitability`);
  return data;
};

export const productPerformanceAnalytics = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/product-performance`);
  return data;
};

export const inventoryAnalytics = async (businessId, threshold) => {
  const { data } = await http.get(`/businesses/${businessId}/analytics/inventory?threshold=${threshold}`);
  return data;
};

//Trends
export const salesTrendsAnalytics = async (businessId, period, startDate, endDate) => {
  const { data } = await http.get(
    `/businesses/${businessId}/analytics/sales-trends?period=${period}&startDate=${startDate}&endDate=${endDate}`,
  );
  return data;
};
