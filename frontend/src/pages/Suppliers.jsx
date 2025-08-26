import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import api from '../services/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get('/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Failed to fetch suppliers', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleRequest = (supplier) => {
    setSelectedSupplier(supplier);
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await api.post('/suppliers/request', {
        supplierId: selectedSupplier._id,
        products,
        customerId: 'currentCustomerId', // Replace with actual customer ID
      });
      setOpen(false);
      setProducts('');
      alert('Request created successfully');
    } catch (error) {
      console.error('Failed to create request', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Suppliers
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier._id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleRequest(supplier)}
                  >
                    Create Request
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Request</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Products"
            value={products}
            onChange={(e) => setProducts(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Suppliers;
