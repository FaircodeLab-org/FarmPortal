import React, { useState, useEffect } from 'react';
import { Map as MapIcon } from '@mui/icons-material';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';
// Removed date-fns import

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const response = await requestService.getRequestDetails(id);
      setRequest(response.data.request);
    } catch (error) {
      console.error('Failed to fetch request details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!request) {
    return (
      <Box>
        <Typography>Request not found</Typography>
      </Box>
    );
  }

  // Helper to format date as string (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d)) return '-';
    return d.toLocaleDateString();
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/requests')}
        sx={{ mb: 3 }}
      >
        Back to Requests
      </Button>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Request Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Request Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Request ID
                  </Typography>
                  <Typography>{request._id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={request.status}
                    color={request.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Request Type
                  </Typography>
                  <Typography>{request.requestType.replace('_', ' ').toUpperCase()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography>
                    {format(new Date(request.createdAt), 'PPP')}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Message
              </Typography>
              <Typography variant="body2">
                {request.message || 'No message provided'}
              </Typography>

              {request.responseData && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Response Data
                  </Typography>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '16px', 
                    borderRadius: '8px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(request.responseData, null, 2)}
                  </pre>
                </>
              )}
              {request.responseData?.landPlots && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<MapIcon />}
                    onClick={() => navigate('/map', {
                      state: {
                        requestGeojson: request.responseData,
                        supplier: request.supplier
                      }
                    })}
                  >
                    View Land Plots on Map
                  </Button>
                </Box>
              )}
              {request.responseData?.geojson && (
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/map', {
                    state: {
                      product: { name: 'Request result', landPlots: [{ geojson: request.responseData.geojson }] },
                      supplier: request.supplier
                    }
                  })}
                >
                  View Map
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Company Name
              </Typography>
              <Typography gutterBottom>
                {request.customer?.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography gutterBottom>
                {request.customer?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Country
              </Typography>
              <Typography>
                {request.customer?.country}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Supplier Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Company Name
              </Typography>
              <Typography gutterBottom>
                {request.supplier?.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography gutterBottom>
                {request.supplier?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Country
              </Typography>
              <Typography>
                {request.supplier?.country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {request.requestType === 'product_data' && request.eudrCompliance && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            EUDR Compliance Assessment Results
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Deforestation Status
              </Typography>
              <Chip 
                label={request.eudrCompliance.deforestationFree === 'yes' ? 'Deforestation Free' : 'Not Verified'}
                color={request.eudrCompliance.deforestationFree === 'yes' ? 'success' : 'error'}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Legal Compliance
              </Typography>
              <Chip 
                label={request.eudrCompliance.legalCompliance}
                color={request.eudrCompliance.legalCompliance === 'compliant' ? 'success' : 'warning'}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Certifications
              </Typography>
              <Box sx={{ mt: 1 }}>
                {request.eudrCompliance.certifications?.map(cert => (
                  <Chip key={cert} label={cert} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Risk Assessment
              </Typography>
              <Typography>
                {request.eudrCompliance.riskAssessment === 'yes' 
                  ? 'EUDR-specific procedures implemented' 
                  : 'No EUDR-specific procedures'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Sustainability Measures
              </Typography>
              <Typography>
                {request.eudrCompliance.sustainabilityMeasures || 'Not provided'}
              </Typography>
            </Grid>
            
            {request.eudrCompliance.evidenceFile && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Evidence Document
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  href={`/api/uploads/eudr-evidence/${request.eudrCompliance.evidenceFile.filename}`}
                  target="_blank"
                >
                  Download Evidence ({request.eudrCompliance.evidenceFile.originalName})
                </Button>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Assessment Date
              </Typography>
              <Typography>
                {new Date(request.eudrCompliance.submittedAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default RequestDetails;