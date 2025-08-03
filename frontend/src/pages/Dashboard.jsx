import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Warning,
  Landscape,
  Inventory
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isSupplier, isCustomer } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    landPlots: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (isSupplier) {
        const response = await requestService.getSupplierRequests();
        const requests = response.data.requests;
        setStats({
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          completedRequests: requests.filter(r => r.status === 'completed').length,
          landPlots: 0,
          products: 0
        });
      } else {
        const response = await requestService.getCustomerRequests();
        const requests = response.data.requests;
        setStats({
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          completedRequests: requests.filter(r => r.status === 'completed').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: `${color}.light`, 
            borderRadius: 2, 
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Welcome back, {user?.companyName}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={<Assignment sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={<Warning sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Requests"
            value={stats.completedRequests}
            icon={<CheckCircle sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        {isSupplier && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Compliance Rate"
              value="95%"
              icon={<TrendingUp sx={{ color: 'info.main' }} />}
              color="info"
            />
          </Grid>
        )}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {isCustomer && (
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Assignment />}
                    onClick={() => navigate('/requests')}
                  >
                    Create New Request
                  </Button>
                </Grid>
              )}
              {isSupplier && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Assignment />}
                      onClick={() => navigate('/requests')}
                    >
                      View Pending Requests
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Landscape />}
                      onClick={() => navigate('/land-plots')}
                    >
                      Manage Land Plots
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Inventory />}
                      onClick={() => navigate('/products')}
                    >
                      Manage Products
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Account Type
              </Typography>
              <Chip 
                label={isSupplier ? 'Supplier' : 'Customer'} 
                color="primary" 
                size="small" 
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Country
              </Typography>
              <Typography>{user?.country}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Verification Status
              </Typography>
              <Chip 
                label={user?.verificationStatus || 'Pending'} 
                color={user?.verificationStatus === 'verified' ? 'success' : 'warning'} 
                size="small" 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;