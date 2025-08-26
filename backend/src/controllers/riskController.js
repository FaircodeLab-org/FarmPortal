/* backend/src/controllers/riskController.js
   Placeholder that you can wire to GIS / compliance checks later.
*/

exports.runRiskAnalysis = async (_req, res) => {
  try {
    // TODO: implement your actual risk logic (spatial, questionnaire, etc.)
    // For now just respond OK.
    res.json({ success: true, message: 'Risk analysis completed (stub).' });
  } catch (e) {
    res.status(500).json({ error: 'Risk analysis failed', detail: e.message });
  }
};
// pseudo-code
const axios = require('axios');
exports.runRiskAnalysis = async (req,res)=>{
  const products = await Product.find().populate('landPlots');
  for (const p of products){
      for (const plot of p.landPlots){
          if (plot.geojson){
             const rsp = await axios.post('https://api.globalforestwatch.org/v1/deforestation',
                                          { geojson: plot.geojson });
             plot.deforestationStatus = rsp.data.risk;   // high / low
             await plot.save();
          }
      }
  }
  res.json({ success:true });
};