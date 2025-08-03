const axios = require('axios');

class ERPNextService {
  constructor() {
    this.baseURL = process.env.ERPNEXT_URL;
    this.apiKey = process.env.ERPNEXT_API_KEY;
    this.apiSecret = process.env.ERPNEXT_API_SECRET;
  }

  getHeaders() {
    return {
      'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
      'Content-Type': 'application/json'
    };
  }

  // ---------------- Land Plots -------------
async getLandPlotData(supplierName) {
  try {
    const response = await axios.get(
      `${this.baseURL}/api/resource/Land%20Plot`,
      {
        headers: this.getHeaders(),
        params: {
          filters: JSON.stringify([
            ["custom_supplier", "=", supplierName]
          ]),
          fields: JSON.stringify([
            "name",
            "plot_id",
            "country",
            "commodities",
            "area",
            "latitude",
            "longitude",
            "geojson",
            "survey_date",
            "deforestation_status"
          ]),
          limit_page_length: 1000
        }
      }
    );
    return response.data.data.map((doc) => ({
      id: doc.plot_id || doc.name,
      name: doc.name,
      country: doc.country,
      commodities: doc.commodities?.split(",") || [],
      area: doc.area,
      coordinates: doc.geojson               // keep raw – convert in frontend
        ? JSON.parse(doc.geojson)
        : [doc.longitude, doc.latitude],
      surveyDate: doc.survey_date,
      deforestationStatus: doc.deforestation_status || "unknown"
    }));
  } catch (err) {
    console.error(
      "ERPNext LandPlot error:",
      err?.response?.status,
      err?.response?.data?.exception || err?.response?.data
    );
    throw err;
  }
}

  // Get product data from Item doctype
  async getProductData(supplierName) {
    try {
      const response = await axios.get(`${this.baseURL}/api/resource/Item`, {
        headers: this.getHeaders(),
        params: {
          filters: JSON.stringify([
            ['custom_supplier', '=', supplierName],
            ['disabled', '=', 0]
          ]),
          fields: JSON.stringify([
            'item_code', 'item_name', 'item_group', 
            'description', 'stock_uom'
            // , 'custom_eudr_category'
          ]),
          limit_page_length: 1000
        }
      });

      const products = response.data.data;
      
      // Get batch data for each product
      for (let product of products) {
        product.batches = await this.getBatchData(product.item_code);
      }

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get batch data
  async getBatchData(itemCode) {
    try {
      const response = await axios.get(`${this.baseURL}/api/resource/Batch`, {
        headers: this.getHeaders(),
        params: {
          filters: JSON.stringify([
            ['item', '=', itemCode],
            ['disabled', '=', 0]
          ]),
          fields: JSON.stringify([
            'batch_id', 'manufacturing_date', 'expiry_date',
            'custom_land_plot', 'custom_harvest_date'
          ])
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching batch data:', error);
      return [];
    }
  }

  // Get purchase order data
  async getPurchaseOrders(supplierName, dateFrom = null) {
    try {
      const filters = [
        ['supplier', '=', supplierName],
        ['docstatus', '=', 1]
      ];

      if (dateFrom) {
        filters.push(['transaction_date', '>=', dateFrom]);
      }

      const response = await axios.get(`${this.baseURL}/api/resource/Purchase Order`, {
        headers: this.getHeaders(),
        params: {
          filters: JSON.stringify(filters),
          fields: JSON.stringify([
            'name', 'transaction_date', 'supplier',
            'total_qty', 'total', 'currency'
          ]),
          limit_page_length: 100
        }
      });

      // Get items for each PO
      for (let po of response.data.data) {
        po.items = await this.getPurchaseOrderItems(po.name);
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  // Get purchase order items
  async getPurchaseOrderItems(poName) {
    try {
      const response = await axios.get(`${this.baseURL}/api/resource/Purchase Order Item`, {
        headers: this.getHeaders(),
        params: {
          filters: JSON.stringify([['parent', '=', poName]]),
          fields: JSON.stringify([
            'item_code', 'item_name', 'qty', 'rate', 'amount'
          ])
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching PO items:', error);
      return [];
    }
  }
}

module.exports = new ERPNextService();