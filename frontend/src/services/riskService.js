// frontend/src/services/riskService.js
import API from './api';

export const riskService = {
  trigger : () => API.post('/importer/run-risk'),
  // extend later with endpoints that return detailed results
};