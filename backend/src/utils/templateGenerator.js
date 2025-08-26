const createLandPlotTemplate = () => {
  // In a real app, use a library like exceljs
  const template = {
    headers: ['Plot ID', 'Plot Name', 'Country', 'Products', 'Area (hectares)', 'Latitude', 'Longitude'],
    example: [
      ['PLOT001', 'Coffee Farm A', 'Brazil', 'Coffee Arabica', '50', '-15.7801', '-47.9292'],
      ['PLOT002', 'Cocoa Farm B', 'Ghana', 'Cocoa Beans', '30', '7.9465', '-1.0232']
    ]
  };
  return template;
};

module.exports = { createLandPlotTemplate };