import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Investment & Expense Plan Helpers
export const createExpensePlan = (startupId, rows) => api.post(`/startups/${startupId}/expense-plan`, { rows });
export const getExpensePlan = (startupId) => api.get(`/startups/${startupId}/expense-plan`);
export const updateActualExpense = (startupId, planId, actualAmount) => api.put(`/startups/${startupId}/expense-plan/${planId}`, { actualAmount });
export const getFundingProgress = (startupId) => api.get(`/startups/${startupId}/funding-progress`);
export const expressInterestWithAmount = (connectionId, amount) => api.put(`/connections/${connectionId}`, { interestedAmount: amount });

export default api;
