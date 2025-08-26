import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const MapView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  
  const { product, supplier } = location.state || {};

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet map
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Replace initializeMap to support requestGeojson and product.landPlots
  const initializeMap = () => {
    const L = window.L;
    // Initialize map
    const newMap = L.map(mapRef.current).setView([0, 0], 2);
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    // Check if we have response data from a request
    const { requestGeojson } = location.state || {};

    if (requestGeojson && requestGeojson.landPlots) {
      // Display land plots from request response
      const bounds = [];
      requestGeojson.landPlots.forEach(plot => {
        if (plot.geojson) {
          // Handle GeoJSON polygon
          const geoJsonLayer = L.geoJSON(plot.geojson, {
            style: {
              color: '#2E7D32',
              fillColor: '#4CAF50',
              fillOpacity: 0.5
            }
          }).addTo(newMap);
          geoJsonLayer.bindPopup(`
            <div>
              <strong>${plot.name}</strong><br/>
              Plot ID: ${plot.plot_id}<br/>
              Area: ${plot.area} hectares<br/>
              Supplier: ${supplier?.companyName || 'Unknown'}
            </div>
          `);
          bounds.push(...geoJsonLayer.getBounds().toBounds());
        } else if (plot.coordinates) {
          // Handle coordinate array
          const polygon = L.polygon(plot.coordinates, {
            color: '#2E7D32',
            fillColor: '#4CAF50',
            fillOpacity: 0.5
          }).addTo(newMap);
          polygon.bindPopup(`
            <div>
              <strong>${plot.name}</strong><br/>
              Plot ID: ${plot.plot_id}<br/>
              Area: ${plot.area} hectares
            </div>
          `);
          bounds.push(...plot.coordinates);
        }
      });
      if (bounds.length > 0) {
        newMap.fitBounds(bounds, { padding: [50, 50] });
      }
    } else if (product && product.landPlots) {
      // Original product land plots display
      const bounds = [];
      product.landPlots.forEach(plot => {
        if (plot.geojson) {
          // Handle GeoJSON
          const geoJsonLayer = L.geoJSON(JSON.parse(plot.geojson), {
            style: {
              color: '#2E7D32',
              fillColor: '#4CAF50',
              fillOpacity: 0.5
            }
          }).addTo(newMap);
          geoJsonLayer.bindPopup(`
            <div>
              <strong>${plot.name}</strong><br/>
              Area: ${plot.area} hectares<br/>
              Product: ${product.name}<br/>
              Supplier: ${supplier?.companyName || 'Unknown'}
            </div>
          `);
          // Get bounds from GeoJSON
          const gjBounds = geoJsonLayer.getBounds();
          bounds.push([gjBounds.getSouth(), gjBounds.getWest()]);
          bounds.push([gjBounds.getNorth(), gjBounds.getEast()]);
        } else if (plot.latitude && plot.longitude) {
          // Handle single point
          const marker = L.marker([plot.latitude, plot.longitude])
            .addTo(newMap)
            .bindPopup(`
              <div>
                <strong>${plot.name}</strong><br/>
                Area: ${plot.area} hectares<br/>
                Product: ${product.name}<br/>
                Supplier: ${supplier?.companyName || 'Unknown'}
              </div>
            `);
          bounds.push([plot.latitude, plot.longitude]);
        }
      });
      // Fit map to show all features
      if (bounds.length > 0) {
        newMap.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    setMap(newMap);
  };

  if (!product) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography>No product data available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h5">
          Land Plot Locations
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{product.name}</Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={`Category: ${product.category}`} size="small" sx={{ mr: 1 }} />
          <Chip label={`Origin: ${product.origin}`} size="small" sx={{ mr: 1 }} />
          <Chip label={`Supplier: ${supplier?.companyName}`} size="small" />
        </Box>
      </Paper>

      <Paper sx={{ height: '600px', position: 'relative' }}>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </Paper>
    </Box>
  );
};

export default MapView;


// import React, { useEffect, useRef, useState } from 'react';
// import { Box, Paper, Typography, Button, Chip } from '@mui/material';
// import { ArrowBack } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';

// const MapView = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const mapRef = useRef(null);
//   const [map, setMap] = useState(null);
  
//   const { product, supplier } = location.state || {};

//   useEffect(() => {
//     if (!mapRef.current) return;

//     // Initialize Leaflet map
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//     document.head.appendChild(link);

//     const script = document.createElement('script');
//     script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//     script.onload = () => {
//       initializeMap();
//     };
//     document.head.appendChild(script);

//     return () => {
//       if (map) {
//         map.remove();
//       }
//     };
//   }, []);

//   const initializeMap = () => {
//     const L = window.L;
    
//     // Initialize map
//     const newMap = L.map(mapRef.current).setView([0, 0], 2);
    
//     // Add tile layer
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(newMap);

//     // Add markers for land plots
//     if (product && product.landPlots) {
//       const bounds = [];
      
//       product.landPlots.forEach(plot => {
//         const marker = L.marker([plot.coordinates.lat, plot.coordinates.lng])
//           .addTo(newMap)
//           .bindPopup(`
//             <div>
//               <strong>${plot.name}</strong><br/>
//               Area: ${plot.area}<br/>
//               Product: ${product.name}<br/>
//               Supplier: ${supplier?.companyName || 'Unknown'}
//             </div>
//           `);
        
//         bounds.push([plot.coordinates.lat, plot.coordinates.lng]);
//       });

//           // Fit map to show all markers
//       if (bounds.length > 0) {
//         newMap.fitBounds(bounds, { padding: [50, 50] });
//       }
//     }

//     setMap(newMap);
//   };

//   if (!product) {
//     return (
//       <Box>
//         <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
//           Back
//         </Button>
//         <Typography>No product data available</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
//           Back
//         </Button>
//         <Typography variant="h5">
//           Land Plot Locations
//         </Typography>
//       </Box>

//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Typography variant="h6">{product.name}</Typography>
//         <Box sx={{ mt: 1 }}>
//           <Chip label={`Category: ${product.category}`} size="small" sx={{ mr: 1 }} />
//           <Chip label={`Origin: ${product.origin}`} size="small" sx={{ mr: 1 }} />
//           <Chip label={`Supplier: ${supplier?.companyName}`} size="small" />
//         </Box>
//       </Paper>

//       <Paper sx={{ height: '600px', position: 'relative' }}>
//         <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
//       </Paper>
//     </Box>
//   );
// };

// export default MapView;