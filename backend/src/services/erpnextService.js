const axios = require('axios');

/* --------------------------------------------------
   Credentials picker – choose ERP based on user role
---------------------------------------------------*/
function getErpCreds(role = 'supplier') {
  if (role === 'customer') {
    return {
      baseURL:   process.env.CUSTOMER_ERP_URL,
      apiKey:    process.env.CUSTOMER_ERP_API_KEY,
      apiSecret: process.env.CUSTOMER_ERP_API_SECRET
    };
  }
  // default → supplier ERP
  return {
    baseURL:   process.env.ERPNEXT_URL,
    apiKey:    process.env.ERPNEXT_API_KEY,
    apiSecret: process.env.ERPNEXT_API_SECRET
  };
}

function buildHeaders(apiKey, apiSecret) {
  return {
    Authorization: `token ${apiKey}:${apiSecret}`,
    'Content-Type': 'application/json'
  };
}

/* --------------------------------------------------
   Helper functions used mainly by the customer portal
---------------------------------------------------*/
async function createSupplier(body, role = 'customer') {
  const { baseURL, apiKey, apiSecret } = getErpCreds(role);
  const headers = buildHeaders(apiKey, apiSecret);

  const payload = {
    supplier_name : body.supplier_name,                // mandatory
    supplier_type : body.supplier_type || 'Company',   // mandatory
    supplier_group: 'All Supplier Groups'              // mandatory
  };

  try {
    const res = await axios.post(
      `${baseURL}/api/resource/Supplier`,
      payload,
      { headers }
    );
    return res.data.data;             // created successfully
  } catch (err) {
    /* Duplicate name → fetch the existing document and return it */
    const isDuplicate =
      err?.response?.data?.exception?.includes('DuplicateEntryError') ||
      err?.response?.data?._server_messages?.includes('Duplicate Name');

    if (!isDuplicate) throw err;

    const existing = await axios.get(
      `${baseURL}/api/resource/Supplier/${encodeURIComponent(body.supplier_name)}`,
      { headers }
    );
    return existing.data.data;
  }
}

/* Use this when you “just need the supplier, create if missing” */
async function ensureSupplier(body, role = 'customer') {
  try {
    return await axios.get(
      `${getErpCreds(role).baseURL}/api/resource/Supplier/${encodeURIComponent(
        body.supplier_name
      )}`,
      { headers: buildHeaders(...Object.values(getErpCreds(role)).slice(1)) }
    ).then(r => r.data.data);
  } catch (e) {
    if (e.response?.status !== 404) throw e;
    return createSupplier(body, role); // create if it didn’t exist
  }
}

async function createItem(body, role = 'customer') {
  const { baseURL, apiKey, apiSecret } = getErpCreds(role);
  const payload = {
    item_code : body.item_code,
    item_name : body.item_name,
    item_group: 'All Item Groups',
    stock_uom : body.stock_uom || 'Nos',
    custom_supplier: body.supplier_name
  };
  const res = await axios.post(
    `${baseURL}/api/resource/Item`,
    payload,
    { headers: buildHeaders(apiKey, apiSecret) }
  );
  return res.data.data;
}

async function createBatch(body, role = 'customer') {
  const { baseURL, apiKey, apiSecret } = getErpCreds(role);
  const payload = {
    batch_id           : body.batch_id,
    item               : body.item_code,
    manufacturing_date : body.manufacturing_date,
    expiry_date        : body.expiry_date
  };
  const res = await axios.post(
    `${baseURL}/api/resource/Batch`,
    payload,
    { headers: buildHeaders(apiKey, apiSecret) }
  );
  return res.data.data;
}

/* --------------------------------------------------
   Main service class (used by both roles)
---------------------------------------------------*/
class ERPNextService {
  /* ---------- Land Plots ---------- */
  async getLandPlotData(supplierName, role = 'supplier') {
    const { baseURL, apiKey, apiSecret } = getErpCreds(role);

    const response = await axios.get(
      `${baseURL}/api/resource/Land%20Plot`,
      {
        headers: buildHeaders(apiKey, apiSecret),
        params: {
          filters: JSON.stringify([
            ['custom_supplier', '=', supplierName]
          ]),
          fields: JSON.stringify([
            'name','plot_id','country','commodities','area',
            'latitude','longitude','geojson',
            'survey_date','deforestation_status'
          ]),
          limit_page_length: 1000
        }
      }
    );

    return response.data.data.map(doc => ({
      id:   doc.plot_id || doc.name,
      name: doc.name,
      country: doc.country,
      commodities: doc.commodities?.split(',') || [],
      area: doc.area,
      coordinates: doc.geojson
        ? JSON.parse(doc.geojson)
        : [doc.longitude, doc.latitude],
      surveyDate: doc.survey_date,
      deforestationStatus: doc.deforestation_status || 'unknown'
    }));
  }

  /* ---------- Products ---------- */
  async getProductData(supplierName, role = 'supplier') {
    const { baseURL, apiKey, apiSecret } = getErpCreds(role);

    const response = await axios.get(`${baseURL}/api/resource/Item`, {
      headers: buildHeaders(apiKey, apiSecret),
      params: {
        filters: JSON.stringify([
          ['custom_supplier', '=', supplierName],
          ['disabled', '=', 0]
        ]),
        fields: JSON.stringify([
          'item_code','item_name','item_group',
          'description','stock_uom'
        ]),
        limit_page_length: 1000
      }
    });

    const products = response.data.data;
    for (const p of products) {
      p.batches = await this.getBatchData(p.item_code, role);
    }
    return products;
  }

  /* ---------- Batches ---------- */
  async getBatchData(itemCode, role = 'supplier') {
    const { baseURL, apiKey, apiSecret } = getErpCreds(role);

    const response = await axios.get(`${baseURL}/api/resource/Batch`, {
      headers: buildHeaders(apiKey, apiSecret),
      params: {
        filters: JSON.stringify([
          ['item', '=', itemCode],
          ['disabled', '=', 0]
        ]),
        fields: JSON.stringify([
          'batch_id','manufacturing_date','expiry_date',
          'custom_land_plot','custom_harvest_date'
        ])
      }
    });
    return response.data.data;
  }
}

/* --------------------------------------------------
   Exports
---------------------------------------------------*/
module.exports = {
  createSupplier,
  ensureSupplier,
  createItem,
  createBatch,
  getErpCreds,
  buildHeaders
};