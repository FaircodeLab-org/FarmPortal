import API from './api';

export const dataService = {
  // Supplier data sync
  syncLandPlots: () => API.post('/data/sync/land-plots'),
  syncProducts: () => API.post('/data/sync/products'),
  
  // Get suppliers list
  getSuppliers: () => API.get('/data/suppliers'),
};