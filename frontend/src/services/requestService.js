import API from './api';

export const requestService = {
  // For customers
  createRequest: (data) => API.post('/requests/create', data),
  getCustomerRequests: () => API.get('/requests/customer'),
  
  // For suppliers
  getSupplierRequests: (params) => API.get('/requests/supplier', { params }),
  respondToRequest: (requestId, data) => API.post(`/requests/${requestId}/respond`, data),
  
  // Shared
  getRequestDetails: (requestId) => API.get(`/requests/${requestId}`),
};