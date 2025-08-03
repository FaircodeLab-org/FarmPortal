import React, { useState } from 'react';
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
  Chip,
  Alert
} from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await dataService.syncProducts();
      setProducts(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to sync products from ERPNext');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<SyncIcon />}
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? 'Syncing...' : 'Sync from ERPNext'}
        </Button>
      </Box>

      {products.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No products found. Click "Sync from ERPNext" to import your product data from Item doctype.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Code</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Batches</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.item_code}>
                <TableCell>{product.item_code}</TableCell>
                <TableCell>{product.item_name}</TableCell>
                <TableCell>
                  <Chip label={product.item_group} size="small" color="primary" />
                </TableCell>
                <TableCell>{product.stock_uom}</TableCell>
                <TableCell>{product.batches?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;