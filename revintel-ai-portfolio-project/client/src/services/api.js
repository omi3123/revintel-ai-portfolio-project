import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

export const fetchDashboardSummary = async () => (await api.get('/dashboard/summary')).data;
export const fetchRevenueTrend = async () => (await api.get('/dashboard/revenue-trend')).data;
export const fetchProfitTrend = async () => (await api.get('/dashboard/profit-trend')).data;
export const fetchTopProducts = async () => (await api.get('/dashboard/top-products')).data;
export const fetchRegionSummary = async () => (await api.get('/dashboard/regions')).data;
export const fetchDataHealth = async () => (await api.get('/dashboard/data-health')).data;
export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return (await api.post('/dashboard/upload-csv', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
};

export const fetchCategoryPerformance = async () => (await api.get('/products/performance')).data;
export const fetchProductSummary = async () => (await api.get('/products/summary')).data;
export const fetchTopProductTable = async () => (await api.get('/products/top')).data;
export const fetchLowProducts = async () => (await api.get('/products/low-performing')).data;

export const fetchRegionsPerformance = async () => (await api.get('/regions/performance')).data;
export const fetchRegionsHeatmap = async () => (await api.get('/regions/heatmap')).data;

export const fetchForecastMetrics = async () => (await api.get('/forecast/model-metrics')).data;
export const fetchForecastOverall = async (horizon = 30) => (await api.get(`/forecast/overall?horizon=${horizon}`)).data;

export const fetchAnomalies = async () => (await api.get('/anomalies')).data;
export const fetchAnomaliesSummary = async () => (await api.get('/anomalies/summary')).data;
export const fetchAnomaliesTimeline = async () => (await api.get('/anomalies/timeline')).data;

export const runScenario = async (payload) => (await api.post('/scenario/run', payload)).data;
export const fetchScenarioHistory = async () => (await api.get('/scenario/history')).data;
export const fetchReportLibrary = async () => (await api.get('/reports/library')).data;

export default api;
