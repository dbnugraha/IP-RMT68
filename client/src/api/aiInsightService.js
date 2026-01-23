import http from "../helpers/http";

/**
 * Get latest insight summary (for UI cards)
 * @returns { insightId, type, generatedAt, summary: { insights: [...] } }
 */
export const aiLatestSummary = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/insights/summary`);
  return data;
};

/**
 * Get latest full insight
 * @returns { id, insightType, content, summary, generatedAt, metadata }
 */
export const aiLatestInsights = async (businessId) => {
  const { data } = await http.get(`/businesses/${businessId}/insights/latest`);
  return data;
};

/**
 * Generate new AI insight
 * @param params - { type: 'daily' | 'weekly' | 'monthly' | 'custom' }
 * @returns { message, insight: { id, insightType, content, generatedAt, metadata } }
 */
export const aiGenerateInsights = async (businessId, params) => {
  const { data } = await http.post(`/businesses/${businessId}/insights/generate`, params);
  return data;
};

/**
 * Send insight report via email
 * @returns { message, email, businessName }
 */
export const sendAIReportToEmail = async (businessId, id) => {
  const { data } = await http.post(`/businesses/${businessId}/insights/${id}/send-email`);
  return data;
};

/**
 * Delete insight
 * @returns { message, deletedId }
 */
export const deleteAIInsight = async (businessId, id) => {
  const { data } = await http.delete(`/businesses/${businessId}/insights/${id}`);
  return data;
};
