// import API from './api';

// export const customerService = {
//   createSupplier : data => API.post('/customer/supplier', data),
//   createItem     : data => API.post('/customer/item', data),
//   createBatch    : data => API.post('/customer/batch', data),
//   listBatches    : code => API.get(`/customer/batches/${code}`)
// };

// frontend/src/services/customerService.js

import API from './api';

export const customerService = {
  /* Supplier & product master */
  getSuppliers : () => API.get('/data/suppliers'),
  // after getSuppliers
  getSupplierProducts : (supplierId)=>API.get(`/data/supplier/${supplierId}/products`),
  createSupplier: data => API.post('/importer/supplier', data),
  createItem    : data => API.post('/importer/item', data),

  /* Batches */
  createBatch : data => API.post('/importer/batch', data),
  listBatches : itemCode => API.get(`/importer/batches/${itemCode}`),

  /* Risk analysis */
  runRisk      : () => API.post('/importer/run-risk')
};