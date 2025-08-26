// frontend/src/pages/LandPlotForm.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { supplierService } from '../services/supplierService';
import { toast } from 'react-toastify';

const LandPlotForm = () => {
  const [plots, setPlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [formData, setFormData] = useState({
    plot_id: '',
    name: '',
    country: '',
    commodities: [],
    area: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const response = await supplierService.listLandPlots();
      setPlots(response.data.landPlots);
    } catch (error) {
      toast.error('Failed to fetch land plots');
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedPlot) {
        await supplierService.updateLandPlot(selectedPlot._id, formData);
        toast.success('Land plot updated successfully');
      } else {
        await supplierService.createLandPlot(formData);
        toast.success('Land plot created successfully');
      }
      setDialogOpen(false);
      fetchPlots();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this land plot?')) {
      try {
        await supplierService.deleteLandPlot(id);
        toast.success('Land plot deleted successfully');
        fetchPlots();
      } catch (error) {
        toast.error('Failed to delete land plot');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      plot_id: '',
      name: '',
      country: '',
      commodities: [],
      area: '',
      latitude: '',
      longitude: ''
    });
    setSelectedPlot(null);
  };

  const handleEdit = (plot) => {
    setSelectedPlot(plot);
    setFormData({
      plot_id: plot.plot_id,
      name: plot.name,
      country: plot.country,
      commodities: plot.commodities,
      area: plot.area,
      latitude: plot.latitude,
      longitude: plot.longitude
    });
    setDialogOpen(true);
  };

    const commodityOptions = ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Soy', 'Cattle'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Land Plots</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          Add Land Plot
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plot ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Commodities</TableCell>
              <TableCell>Area (ha)</TableCell>
              <TableCell>Coordinates</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plots.map((plot) => (
              <TableRow key={plot._id}>
                <TableCell>{plot.plot_id}</TableCell>
                <TableCell>{plot.name}</TableCell>
                <TableCell>{plot.country}</TableCell>
                <TableCell>{plot.commodities.join(', ')}</TableCell>
                <TableCell>{plot.area}</TableCell>
                <TableCell>
                  {plot.latitude}, {plot.longitude}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(plot)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(plot._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => {
          setDialogOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPlot ? 'Edit Land Plot' : 'Create New Land Plot'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Plot ID"
            value={formData.plot_id}
            onChange={(e) => setFormData({ ...formData, plot_id: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Commodities</InputLabel>
            <Select
              multiple
              value={formData.commodities}
              onChange={(e) => setFormData({ ...formData, commodities: e.target.value })}
            >
              {commodityOptions.map((commodity) => (
                <MenuItem key={commodity} value={commodity}>
                  {commodity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Area (hectares)"
            type="number"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            margin="normal"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Latitude"
              type="number"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Longitude"
              type="number"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedPlot ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LandPlotForm;