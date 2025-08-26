// import React, { useState, useEffect } from 'react';

// import { useSearchParams } from 'react-router-dom';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Tab,
//   Tabs,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   CheckCircle as ApproveIcon,
//   Cancel as RejectIcon,
//   Check as CheckIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { requestService } from '../services/requestService';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';
// import RespondToRequestModal from '../components/RespondToRequestModal';

// const Requests = () => {
//   const navigate = useNavigate();
//   const { isSupplier, isCustomer } = useAuth();
//   // const [tabValue, setTabValue] = useState(0);
//   const [search] = useSearchParams();
//   const initialTab =
//     search.get('status') === 'pending'   ? 0 :
//     search.get('status') === 'completed' ? 1 : 2;           // all
//   const [tabValue, setTabValue] = useState(initialTab);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);
//   const [newRequest, setNewRequest] = useState({
//     supplierId: '',
//     requestType: '',
//     message: '',
//     requestedProducts: []
//   });
//   const [shareDialog, setShareDialog] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [selectedPlots, setSelectedPlots] = useState([]);
//   const [availablePlots, setAvailablePlots] = useState([
//     // Mock data - will come from ERPNext
//     { id: 'PLOT001', name: 'Coffee Farm Plot A', country: 'Brazil', commodities: ['Coffee'] },
//     { id: 'PLOT002', name: 'Cocoa Farm Plot B', country: 'Ghana', commodities: ['Cocoa'] }
//   ]);

//   useEffect(() => {
//     fetchRequests();
//     if (isCustomer) {
//       fetchSuppliers();
//     }
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       let response;
//       if (isSupplier) {
//         response = await requestService.getSupplierRequests();
//       } else {
//         response = await requestService.getCustomerRequests();
//       }
//       setRequests(response.data.requests);
//     } catch (error) {
//       console.error('Failed to fetch requests:', error);
//       toast.error('Failed to fetch requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const response = await dataService.getSuppliers();
//       setSuppliers(response.data.suppliers);
//     } catch (error) {
//       console.error('Failed to fetch suppliers:', error);
//     }
//   };

//   const handleCreateRequest = async () => {
//     try {
//       await requestService.createRequest(newRequest);
//       toast.success('Request created successfully');
//       setCreateDialogOpen(false);
//       fetchRequests();
//       setNewRequest({
//         supplierId: '',
//         requestType: '',
//         message: '',
//         requestedProducts: []
//       });
//     } catch (error) {
//       toast.error('Failed to create request');
//     }
//   };

//   const handleRespondToRequest = async (requestId, action) => {
//     try {
//       await requestService.respondToRequest(requestId, { action });
//       toast.success(`Request ${action}ed successfully`);
//       fetchRequests();
//     } catch (error) {
//       toast.error(`Failed to ${action} request`);
//     }
//   };

//   const handleRespond = async ({ message, status }) => {
//     try {
//       await requestService.respondToRequest(selectedRequest._id, { message, status });
//       setModalOpen(false);
//       setSelectedRequest(null);
//       // Refresh requests or update UI
//       fetchRequests();
//     } catch (error) {
//       console.error('Failed to respond to request:', error);
//     }
//   };

//   const handleSharePlots = (request) => {
//     setSelectedRequest(request);
//     setShareDialog(true);
//     setSelectedPlots([]);
//   };

//   const confirmSharePlots = async () => {
//     try {
//       // In real app, this would call API to share plots
//       await requestService.respondToRequest(selectedRequest._id, {
//         action: 'accept',
//         sharedPlots: selectedPlots
//       });
      
//       toast.success(`Shared ${selectedPlots.length} plot(s) with customer`);
//       setShareDialog(false);
//       fetchRequests();
//     } catch (error) {
//       toast.error('Failed to share plots');
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'warning';
//       case 'completed': return 'success';
//       case 'rejected': return 'error';
//       default: return 'default';
//     }
//   };

//   const filteredRequests = requests.filter(request => {
//     if (tabValue === 0) return request.status === 'pending';
//     if (tabValue === 1) return request.status === 'completed';
//     return true;
//   });

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Requests
//         </Typography>
//         {isCustomer && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setCreateDialogOpen(true)}
//           >
//             Create New Request
//           </Button>
//         )}
//       </Box>

//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
//           <Tab label="Pending" />
//           <Tab label="Completed" />
//           <Tab label="All" />
//         </Tabs>
//       </Paper>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Request ID</TableCell>
//               <TableCell>{isSupplier ? 'Customer' : 'Supplier'}</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredRequests.map((request) => (
//               <TableRow key={request._id}>
//                 <TableCell>{request._id.slice(-8)}</TableCell>
//                 <TableCell>
//                   {isSupplier ? request.customer?.companyName : request.supplier?.companyName}
//                 </TableCell>
//                 <TableCell>{request.requestType.replace('_', ' ').toUpperCase()}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={request.status}
//                     color={getStatusColor(request.status)}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
//                 <TableCell>
//                   <IconButton
//                     size="small"
//                     onClick={() => navigate(`/requests/${request._id}`)}
//                   >
//                     <ViewIcon />
//                   </IconButton>
//                   {isSupplier && request.status === 'pending' && (
//                     <Button
//                       size="small"
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         setSelectedRequest(request);
//                         setModalOpen(true);
//                       }}
//                     >
//                       Respond
//                     </Button>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Create Request Dialog */}
//       <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Create New Request</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Supplier</InputLabel>
//             <Select
//               value={newRequest.supplierId}
//               onChange={(e) => setNewRequest({ ...newRequest, supplierId: e.target.value })}
//             >
//               {suppliers.map((supplier) => (
//                 <MenuItem key={supplier._id} value={supplier._id}>
//                   {supplier.companyName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Request Type</InputLabel>
//             <Select
//               value={newRequest.requestType}
//               onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
//             >
//               <MenuItem value="land_plot">Land Plot Data</MenuItem>
//               <MenuItem value="product_data">Product Data</MenuItem>
//               <MenuItem value="purchase_order">Purchase Order</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Message"
//             value={newRequest.message}
//             onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleCreateRequest} variant="contained">Create</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Share Plots Dialog */}
//       <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Share Land Plot Data</DialogTitle>
//         <DialogContent>
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Select land plots to share with {selectedRequest?.customer?.companyName}
//           </Alert>
//           <List>
//             {availablePlots.map((plot) => (
//               <ListItem key={plot.id}>
//                 <Checkbox
//                   checked={selectedPlots.includes(plot.id)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedPlots([...selectedPlots, plot.id]);
//                     } else {
//                       setSelectedPlots(selectedPlots.filter(id => id !== plot.id));
//                     }
//                   }}
//                 />
//                 <ListItemText
//                   primary={plot.name}
//                   secondary={`${plot.country} - ${plot.commodities.join(', ')}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShareDialog(false)}>Cancel</Button>
//           <Button 
//             variant="contained" 
//             onClick={confirmSharePlots}
//             disabled={selectedPlots.length === 0}
//           >
//             Share {selectedPlots.length} Plot(s)
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Respond To Request Modal */}
//       <RespondToRequestModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleRespond}
//       />
//     </Box>
//   );
// };

// export default Requests;



import React, { useState, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { dataService } from '../services/dataService';
import { toast } from 'react-toastify';
import RespondToRequestModal from '../components/RespondToRequestModal';

const Requests = () => {
  const navigate = useNavigate();
  const { isSupplier, isCustomer } = useAuth();
  const [search] = useSearchParams();
  const initialTab =
    search.get('status') === 'pending'   ? 0 :
    search.get('status') === 'completed' ? 1 : 2;           // all
  const [tabValue, setTabValue] = useState(initialTab);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [newRequest, setNewRequest] = useState({
    supplierId: '',
    requestType: '',
    message: '',
    requestedProducts: []
  });
  const [shareDialog, setShareDialog] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPlots, setSelectedPlots] = useState([]);
  const [availablePlots, setAvailablePlots] = useState([
    { id: 'PLOT001', name: 'Coffee Farm Plot A', country: 'Brazil', commodities: ['Coffee'] },
    { id: 'PLOT002', name: 'Cocoa Farm Plot B', country: 'Ghana', commodities: ['Cocoa'] }
  ]);

  useEffect(() => {
    fetchRequests();
    if (isCustomer) {
      fetchSuppliers();
    }
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let response;
      if (isSupplier) {
        response = await requestService.getSupplierRequests();
      } else {
        response = await requestService.getCustomerRequests();
      }
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await dataService.getSuppliers();
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const handleCreateRequest = async () => {
    try {
      await requestService.createRequest(newRequest);
      toast.success('Request created successfully');
      setCreateDialogOpen(false);
      fetchRequests();
      setNewRequest({
        supplierId: '',
        requestType: '',
        message: '',
        requestedProducts: []
      });
    } catch (error) {
      toast.error('Failed to create request');
    }
  };

  const handleRespond = async ({ message, status }) => {
    try {
      await requestService.respondToRequest(selectedRequest._id, { message, status });
      setModalOpen(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error('Failed to respond to request:', error);
    }
  };

  const handleSharePlots = (request) => {
    setSelectedRequest(request);
    setShareDialog(true);
    setSelectedPlots([]);
  };

  const confirmSharePlots = async () => {
    try {
      await requestService.respondToRequest(selectedRequest._id, {
        action: 'accept',
        sharedPlots: selectedPlots
      });
      
      toast.success(`Shared ${selectedPlots.length} plot(s) with customer`);
      setShareDialog(false);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to share plots');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return request.status === 'pending';
    if (tabValue === 1) return request.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Requests
        </Typography>
        {isCustomer && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create New Request
          </Button>
        )}
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Pending" />
          <Tab label="Completed" />
          <Tab label="All" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>{isSupplier ? 'Customer' : 'Supplier'}</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request._id.slice(-8)}</TableCell>
                <TableCell>
                  {isSupplier ? request.customer?.companyName : request.supplier?.companyName}
                </TableCell>
                <TableCell>
                  {request.requestedProducts?.[0]?.productId?.name || 
                   request.requestedProducts?.[0]?.productName || 
                   '-'}
                </TableCell>
                <TableCell>{request.requestType.replace('_', ' ').toUpperCase()}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/requests/${request._id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  {/* {isSupplier && request.status === 'pending' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedRequest(request);
                        setModalOpen(true);
                      }}
                    >
                      Respond
                    </Button>
                  )} */}
                  {isSupplier && request.status === 'pending' && (
                    request.requestType === 'product_data' ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/questionnaires')}
                      >
                        Complete Assessment
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedRequest(request);
                          setModalOpen(true);
                        }}
                      >
                        Respond
                      </Button>
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Request Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Request</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Supplier</InputLabel>
            <Select
              value={newRequest.supplierId}
              onChange={(e) => setNewRequest({ ...newRequest, supplierId: e.target.value })}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Request Type</InputLabel>
            <Select
              value={newRequest.requestType}
              onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
            >
              <MenuItem value="land_plot">Land Plot Data</MenuItem>
              <MenuItem value="product_data">Product Data</MenuItem>
              <MenuItem value="purchase_order">Purchase Order</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={newRequest.message}
            onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRequest} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Share Plots Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Share Land Plot Data</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Select land plots to share with {selectedRequest?.customer?.companyName}
          </Alert>
          <List>
            {availablePlots.map((plot) => (
              <ListItem key={plot.id}>
                <Checkbox
                  checked={selectedPlots.includes(plot.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPlots([...selectedPlots, plot.id]);
                    } else {
                      setSelectedPlots(selectedPlots.filter(id => id !== plot.id));
                    }
                  }}
                />
                <ListItemText
                  primary={plot.name}
                  secondary={`${plot.country} - ${plot.commodities.join(', ')}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={confirmSharePlots}
            disabled={selectedPlots.length === 0}
          >
            Share {selectedPlots.length} Plot(s)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Respond To Request Modal */}
      <RespondToRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRespond}
        request={selectedRequest}
      />
    </Box>
  );
};

export default Requests;