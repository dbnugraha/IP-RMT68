import http from "../helpers/http";

export const aiLatestSummary = async (businessId) => {
  const { data } = await http.get(`/bussineses/${businessId}/insights/latest-summary`);
  return data;
};

export const aiLatestInsights = async (businessId) => {
  const { data } = await http.get(`/bussineses/${businessId}/insights/latest-insights`);
  return data;
};

export const aiGenerateInsights = async (businessId, params) => {
  const { data } = await http.post(`/bussineses/${businessId}/insights/generate`, params);
  return data;
};

export const sendAIReportToEmail = async (businessId, id) => {
  const { data } = await http.post(`/bussineses/${businessId}/insights/${id}/send-email`);
  return data;
};

export const deleteAIInsight = async (businessId, id) => {
  const { data } = await http.delete(`/bussineses/${businessId}/insights/${id}`);
  return data;
};
