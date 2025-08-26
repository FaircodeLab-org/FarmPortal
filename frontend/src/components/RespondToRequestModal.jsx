// // import React, { useState } from 'react';
// // import {
// //   Dialog, DialogTitle, DialogContent, DialogActions,
// //   TextField, Button, MenuItem
// // } from '@mui/material';

// // const RespondToRequestModal = ({ open, onClose, onSubmit }) => {
// //   const [message, setMessage] = useState('');
// //   const [status, setStatus] = useState('pending');

// //   const handleSubmit = () => {
// //     onSubmit({ message, status });
// //     setMessage('');
// //     setStatus('pending');
// //     onClose();
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
// //       <DialogTitle>Respond to Request</DialogTitle>
// //       <DialogContent>
// //         <TextField
// //           label="Message"
// //           fullWidth
// //           multiline
// //           rows={4}
// //           value={message}
// //           onChange={(e) => setMessage(e.target.value)}
// //           margin="normal"
// //         />
// //         <TextField
// //           label="Status"
// //           select
// //           fullWidth
// //           value={status}
// //           onChange={(e) => setStatus(e.target.value)}
// //           margin="normal"
// //         >
// //           <MenuItem value="pending">Pending</MenuItem>
// //           <MenuItem value="accepted">Accepted</MenuItem>
// //           <MenuItem value="rejected">Rejected</MenuItem>
// //         </TextField>
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={onClose}>Cancel</Button>
// //         <Button onClick={handleSubmit} variant="contained" color="primary">
// //           Submit
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default RespondToRequestModal;
// import React, { useState } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Button, MenuItem
// } from '@mui/material';

// const RespondToRequestModal = ({ open, onClose, onSubmit }) => {
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState('pending');
//   const [geojsonFile, setGeojsonFile] = useState(null); // State for GeoJSON file
//   const [coordinates, setCoordinates] = useState(''); // State for coordinates array

//   const handleFileChange = (e) => {
//     setGeojsonFile(e.target.files[0]);
//   };

//   const handleSubmit = () => {
//     const formData = new FormData();
//     formData.append('status', status);
//     formData.append('message', message);

//     if (geojsonFile) {
//       formData.append('geojson', geojsonFile);
//     } else if (coordinates) {
//       formData.append('coords', coordinates);
//     }

//     onSubmit(formData); // Pass FormData to the parent component
//     setMessage('');
//     setStatus('pending');
//     setGeojsonFile(null);
//     setCoordinates('');
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Respond to Request</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Message"
//           fullWidth
//           multiline
//           rows={4}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           label="Status"
//           select
//           fullWidth
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           margin="normal"
//         >
//           <MenuItem value="pending">Pending</MenuItem>
//           <MenuItem value="accepted">Accepted</MenuItem>
//           <MenuItem value="rejected">Rejected</MenuItem>
//         </TextField>
//         <TextField
//           label="Coordinates (JSON Array)"
//           fullWidth
//           multiline
//           rows={2}
//           value={coordinates}
//           onChange={(e) => setCoordinates(e.target.value)}
//           margin="normal"
//           helperText="Provide coordinates as a JSON array (e.g., [[lat, lng], [lat, lng]])"
//         />
//         <Button
//           variant="outlined"
//           component="label"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Upload GeoJSON File
//           <input
//             type="file"
//             accept=".geojson"
//             hidden
//             onChange={handleFileChange}
//           />
//         </Button>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Submit
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default RespondToRequestModal;
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControl, InputLabel,
  Select, Checkbox, ListItemText, Alert, Box,
  Typography, Divider, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import { supplierService } from '../services/supplierService';

// const RespondToRequestModal = ({ open, onClose, onSubmit, request }) => {
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState('completed');
//   const [landPlots, setLandPlots] = useState([]);
//   const [selectedLandPlots, setSelectedLandPlots] = useState([]);
//   const [eudrCompliance, setEudrCompliance] = useState({
//     deforestationFree: '',
//     legalCompliance: '',
//     certifications: [],
//     sustainabilityMeasures: ''
//   });

//   useEffect(() => {
//     if (open && request?.requestType === 'land_plot') {
//       fetchLandPlots();
//     }
//   }, [open, request]);
//     const fetchLandPlots = async () => {
//       try {
//         // Get from localStorage first
//         const storedPlots = localStorage.getItem('landPlots');
//         if (storedPlots) {
//           const allPlots = JSON.parse(storedPlots);
          
//           // Get product name from request
//           const requestedProductName = request?.requestedProducts?.[0]?.productId?.name || 
//                                       request?.requestedProducts?.[0]?.productName || '';
          
//           // Filter plots that contain the requested product
//           const filteredPlots = allPlots.filter(plot => {
//             const plotProducts = plot.products || plot.commodities || [];
//             return plotProducts.some(p => 
//               p.toLowerCase().includes(requestedProductName.toLowerCase())
//             );
//           });
          
//           setLandPlots(filteredPlots.length > 0 ? filteredPlots : allPlots);
//         }
//       } catch (error) {
//         console.error('Failed to fetch land plots:', error);
//         setLandPlots([]);
//       }
//     };
//   const handleSubmit = () => {
//     const payload = {
//       message,
//       status,
//     };

//     if (request?.requestType === 'land_plot') {
//       payload.selectedLandPlots = selectedLandPlots;
//     }

//     if (request?.requestType === 'product_data') {
//       payload.eudrCompliance = eudrCompliance;
//     }

//     onSubmit(payload);
//     resetForm();
//   };

//   const resetForm = () => {
//     setMessage('');
//     setStatus('completed');
//     setSelectedLandPlots([]);
//     setEudrCompliance({
//       deforestationFree: '',
//       legalCompliance: '',
//       certifications: [],
//       sustainabilityMeasures: ''
//     });
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//             <DialogTitle>
//         Respond to {request?.requestType?.replace('_', ' ').toUpperCase()} Request
//       </DialogTitle>
//       <DialogContent>
//         <Alert severity="info" sx={{ mb: 2 }}>
//           Request from {request?.customer?.companyName} for {request?.requestedProducts?.[0]?.productId?.name || 'Product'}
//         </Alert>

//         <TextField
//           label="Message"
//           fullWidth
//           multiline
//           rows={3}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           margin="normal"
//         />

//         {/* Land Plot Selection for land_plot requests */}
//         {request?.requestType === 'land_plot' && (
//           <>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="h6" gutterBottom>
//               Select Land Plots
//             </Typography>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Land Plots</InputLabel>
//               <Select
//                 multiple
//                 value={selectedLandPlots}
//                 onChange={(e) => setSelectedLandPlots(e.target.value)}
//                 renderValue={(selected) => `${selected.length} plots selected`}
//               >
//                 {landPlots.map((plot) => (
//                   <MenuItem key={plot._id} value={plot._id}>
//                     <Checkbox checked={selectedLandPlots.includes(plot._id)} />
//                     <ListItemText 
//                       primary={`${plot.plot_id} - ${plot.name}`}
//                       secondary={`${plot.area} ha | ${plot.country}`}
//                     />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
            
//             <Alert severity="warning" sx={{ mt: 1 }}>
//               Selected plots will share their geo-coordinates with the customer
//             </Alert>
//           </>
//         )}

//         {/* EUDR Questionnaire for product_data requests */}
//         {request?.requestType === 'product_data' && (
//           <>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="h6" gutterBottom>
//               EUDR Compliance Information
//             </Typography>
            
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 1. Is this product deforestation-free?
//               </Typography>
//               <RadioGroup
//                 value={eudrCompliance.deforestationFree}
//                 onChange={(e) => setEudrCompliance({...eudrCompliance, deforestationFree: e.target.value})}
//               >
//                 <FormControlLabel value="yes" control={<Radio />} label="Yes, verified deforestation-free since Dec 31, 2020" />
//                 <FormControlLabel value="no" control={<Radio />} label="No / Cannot verify" />
//               </RadioGroup>
//             </Box>

//             <Box sx={{ mt: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 2. Legal compliance status
//               </Typography>
//               <RadioGroup
//                 value={eudrCompliance.legalCompliance}
//                 onChange={(e) => setEudrCompliance({...eudrCompliance, legalCompliance: e.target.value})}
//               >
//                 <FormControlLabel value="compliant" control={<Radio />} label="Fully compliant with local laws" />
//                 <FormControlLabel value="partial" control={<Radio />} label="Partially compliant" />
//                 <FormControlLabel value="non-compliant" control={<Radio />} label="Non-compliant" />
//               </RadioGroup>
//             </Box>

//             <FormControl fullWidth margin="normal">
//               <InputLabel>Certifications</InputLabel>
//               <Select
//                 multiple
//                 value={eudrCompliance.certifications}
//                 onChange={(e) => setEudrCompliance({...eudrCompliance, certifications: e.target.value})}
//                 renderValue={(selected) => selected.join(', ')}
//               >
//                 {['Rainforest Alliance', 'Fair Trade', 'Organic', 'UTZ', 'RSPO', 'FSC'].map((cert) => (
//                   <MenuItem key={cert} value={cert}>
//                     <Checkbox checked={eudrCompliance.certifications.includes(cert)} />
//                     <ListItemText primary={cert} />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               label="Sustainability Measures"
//               value={eudrCompliance.sustainabilityMeasures}
//               onChange={(e) => setEudrCompliance({...eudrCompliance, sustainabilityMeasures: e.target.value})}
//               margin="normal"
//               placeholder="Describe your sustainability practices..."
//             />
//           </>
//         )}

//         <FormControl fullWidth margin="normal">
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             <MenuItem value="completed">Completed</MenuItem>
//             <MenuItem value="rejected">Rejected</MenuItem>
//           </Select>
//         </FormControl>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained" 
//           color="primary"
//           disabled={
//             (request?.requestType === 'land_plot' && selectedLandPlots.length === 0) ||
//             (request?.requestType === 'product_data' && !eudrCompliance.deforestationFree)
//           }
//         >
//           Submit Response
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default RespondToRequestModal;

const RespondToRequestModal = ({ open, onClose, onSubmit, request }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('completed');
  const [landPlots, setLandPlots] = useState([]);
  const [selectedLandPlots, setSelectedLandPlots] = useState([]);

  useEffect(() => {
    if (open && request?.requestType === 'land_plot') {
      fetchLandPlots();
    }
  }, [open, request]);

  const fetchLandPlots = async () => {
    try {
      const storedPlots = localStorage.getItem('landPlots');
      if (storedPlots) {
        const allPlots = JSON.parse(storedPlots);
        const requestedProductName = request?.requestedProducts?.[0]?.productId?.name || '';
        const filteredPlots = allPlots.filter(plot => {
          const plotProducts = plot.products || plot.commodities || [];
          return plotProducts.some(p => 
            p.toLowerCase().includes(requestedProductName.toLowerCase())
          );
        });
        setLandPlots(filteredPlots.length > 0 ? filteredPlots : allPlots);
      }
    } catch (error) {
      console.error('Failed to fetch land plots:', error);
      setLandPlots([]);
    }
  };

  const handleSubmit = () => {
    const payload = {
      message,
      status,
    };

    if (request?.requestType === 'land_plot') {
      payload.selectedLandPlots = selectedLandPlots;
    }

    // For product_data requests, redirect to questionnaires
    if (request?.requestType === 'product_data') {
      toast.info('Please complete the EUDR assessment in the Questionnaires tab');
      onClose();
      return;
    }

    onSubmit(payload);
    resetForm();
  };

  const resetForm = () => {
    setMessage('');
    setStatus('completed');
    setSelectedLandPlots([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Respond to {request?.requestType?.replace('_', ' ').toUpperCase()} Request
      </DialogTitle>
      <DialogContent>
        {request?.requestType === 'product_data' ? (
          <Alert severity="info">
            This is an EUDR compliance request. Please go to the Questionnaires tab to complete the assessment.
          </Alert>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              Request from {request?.customer?.companyName} for {request?.requestedProducts?.[0]?.productId?.name || 'Product'}
            </Alert>

            <TextField
              label="Message"
              fullWidth
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
            />

            {request?.requestType === 'land_plot' && (
              <>
                 <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select Land Plots
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Land Plots</InputLabel>
                  <Select
                    multiple
                    value={selectedLandPlots}
                    onChange={(e) => setSelectedLandPlots(e.target.value)}
                    renderValue={(selected) => `${selected.length} plots selected`}
                  >
                    {landPlots.map((plot) => (
                      <MenuItem key={plot._id || plot.id} value={plot._id || plot.id}>
                        <Checkbox checked={selectedLandPlots.includes(plot._id || plot.id)} />
                        <ListItemText 
                          primary={`${plot.plot_id || plot.id} - ${plot.name}`}
                          secondary={`${plot.area} ha | ${plot.country}`}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Selected plots will share their geo-coordinates with the customer
                </Alert>
              </>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {request?.requestType === 'product_data' ? (
          <Button 
            onClick={() => {
              window.location.href = '/questionnaires';
              onClose();
            }} 
            variant="contained" 
            color="primary"
          >
            Go to Questionnaires
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={request?.requestType === 'land_plot' && selectedLandPlots.length === 0}
          >
            Submit Response
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RespondToRequestModal;