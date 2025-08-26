// frontend/src/pages/AnswerRequestForm.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  AttachFile as AttachIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { supplierService } from '../services/supplierService';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const AnswerRequestForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [landPlots, setLandPlots] = useState([]);
  const [selectedPlots, setSelectedPlots] = useState([]);
  const [formData, setFormData] = useState({
    message: '',
    attachments: [],
    status: 'completed'
  });

  useEffect(() => {
    fetchRequestDetails();
    fetchLandPlots();
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      // Assuming you have this endpoint
      const response = await supplierService.getRequestDetails(requestId);
      setRequest(response.data.request);
    } catch (error) {
      toast.error('Failed to fetch request details');
      navigate('/requests');
    }
  };

  const fetchLandPlots = async () => {
    try {
      const response = await supplierService.listLandPlots();
      setLandPlots(response.data.landPlots);
    } catch (error) {
      toast.error('Failed to fetch land plots');
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!selectedPlots.length && request?.requestType === 'land_plot') {
      toast.error('Please select at least one land plot');
      return;
    }

    try {
      setLoading(true);

      //
            // ... continuing from handleSubmit
      const formPayload = new FormData();
      formPayload.append('message', formData.message);
      formPayload.append('status', formData.status);
      formPayload.append('landPlots', JSON.stringify(selectedPlots));
      
      formData.attachments.forEach((file, index) => {
        formPayload.append(`attachment${index}`, file);
      });

      await supplierService.answerRequest(requestId, formPayload);
      toast.success('Response submitted successfully');
      navigate('/requests');

    } catch (error) {
      toast.error('Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  if (!request) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Answer Request
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Request Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Request Type
            </Typography>
            <Typography>
              {request.requestType?.replace('_', ' ').toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Customer
            </Typography>
            <Typography>
              {request.customer?.companyName}
                          </Typography>
          </Grid>
          {request.requestType === 'land_plot' && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Select Land Plots
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Select the land plots relevant to this request
              </Alert>
              <List>
                {landPlots.map((plot) => (
                  <ListItem key={plot._id} divider>
                    <ListItemText
                      primary={plot.name}
                      secondary={`${plot.area} hectares • ${plot.commodities?.join(', ')}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={selectedPlots.includes(plot._id) ? 'Selected' : 'Select'}
                        color={selectedPlots.includes(plot._id) ? 'primary' : 'default'}
                        onClick={() => {
                          if (selectedPlots.includes(plot._id)) {
                            setSelectedPlots(selectedPlots.filter(id => id !== plot._id));
                          } else {
                            setSelectedPlots([...selectedPlots, plot._id]);
                          }
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Response
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<AttachIcon />}
          >
            Attach Files
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileUpload}
            />
          </Button>

          <List>
            {formData.attachments.map((file, index) => (
              <ListItem key={index}>
                                <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeFile(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            onClick={() => navigate('/requests')}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Response'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AnswerRequestForm;