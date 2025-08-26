// frontend/src/pages/BatchForm.jsx

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { supplierService } from '../services/supplierService';
// Removed DatePicker and related imports
import { toast } from 'react-toastify';

const BatchForm = () => {
  const [batches, setBatches] = useState([]);
  const [landPlots, setLandPlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [formData, setFormData] = useState({
    batch_id: '',
    item_code: '',
    land_plot: '',
    manufacturing_date: null,
    expiry_date: null,
    harvest_date: null,
    quantity: '',
    unit: 'kg'
  });

  useEffect(() => {
    fetchBatches();
    fetchLandPlots();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await supplierService.listBatches();
      setBatches(response.data.batches);
    } catch (error) {
      toast.error('Failed to fetch batches');
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

  const handleSubmit = async () => {
    try {
      if (selectedBatch) {
        await supplierService.updateBatch(selectedBatch._id, formData);
        toast.success('Batch updated successfully');
      } else {
        await supplierService.createBatch(formData);
        toast.success('Batch created successfully');
      }
      setDialogOpen(false);
      fetchBatches();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await supplierService.deleteBatch(id);
        toast.success('Batch deleted successfully');
        fetchBatches();
      } catch (error) {
        toast.error('Failed to delete batch');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      batch_id: '',
      item_code: '',
      land_plot: '',
      manufacturing_date: null,
      expiry_date: null,
      harvest_date: null,
      quantity: '',
      unit: 'kg'
    });
    setSelectedBatch(null);
  };

  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      batch_id: batch.batch_id,
      item_code: batch.item_code,
      land_plot: batch.land_plot?._id || '',
      manufacturing_date: batch.manufacturing_date ? new Date(batch.manufacturing_date) : null,
      expiry_date: batch.expiry_date ? new Date(batch.expiry_date) : null,
      harvest_date: batch.harvest_date ? new Date(batch.harvest_date) : null,
      quantity: batch.quantity,
      unit: batch.unit
    });
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Batches</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          Add Batch
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Batch ID</TableCell>
              <TableCell>Item Code</TableCell>
              <TableCell>Land Plot</TableCell>
              <TableCell>Manufacturing Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch._id}>
                <TableCell>{batch.batch_id}</TableCell>
                <TableCell>{batch.item_code}</TableCell>
                <TableCell>{batch.land_plot?.name || '-'}</TableCell>
                <TableCell>
                  {batch.manufacturing_date ? new Date(batch.manufacturing_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{batch.quantity} {batch.unit}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(batch)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(batch._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          {selectedBatch ? 'Edit Batch' : 'Create New Batch'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Batch ID"
            value={formData.batch_id}
            onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Item Code"
            value={formData.item_code}
            onChange={(e) => setFormData({ ...formData, item_code: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Land Plot</InputLabel>
            <Select
              value={formData.land_plot}
              onChange={(e) => setFormData({ ...formData, land_plot: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {landPlots.map((plot) => (
                <MenuItem key={plot._id} value={plot._id}>
                  {plot.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Manufacturing Date (YYYY-MM-DD)"
            value={formData.manufacturing_date || ''}
            onChange={(e) => setFormData({ ...formData, manufacturing_date: e.target.value })}
            margin="normal"
            placeholder="YYYY-MM-DD"
          />
          <TextField
            fullWidth
            label="Expiry Date (YYYY-MM-DD)"
            value={formData.expiry_date || ''}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            margin="normal"
            placeholder="YYYY-MM-DD"
          />
          <TextField
            fullWidth
            label="Harvest Date (YYYY-MM-DD)"
            value={formData.harvest_date || ''}
            onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
            margin="normal"
            placeholder="YYYY-MM-DD"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              margin="normal"
              sx={{ flex: 2 }}
            />
            <FormControl sx={{ flex: 1 }} margin="normal">
              <InputLabel>Unit</InputLabel>
              <Select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="ton">ton</MenuItem>
                <MenuItem value="bags">bags</MenuItem>
              </Select>
            </FormControl>
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
            {selectedBatch ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BatchForm;