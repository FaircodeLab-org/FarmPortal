// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Alert
// } from '@mui/material';
// import { Sync as SyncIcon } from '@mui/icons-material';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [syncing, setSyncing] = useState(false);

//   const handleSync = async () => {
//     try {
//       setSyncing(true);
//       const response = await dataService.syncProducts();
//       setProducts(response.data.data);
//       toast.success(response.data.message);
//     } catch (error) {
//       toast.error('Failed to sync products from ERPNext');
//     } finally {
//       setSyncing(false);
//     }
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Products
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<SyncIcon />}
//           onClick={handleSync}
//           disabled={syncing}
//         >
//           {syncing ? 'Syncing...' : 'Sync from ERPNext'}
//         </Button>
//       </Box>

//       {products.length === 0 && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           No products found. Click "Sync from ERPNext" to import your product data from Item doctype.
//         </Alert>
//       )}

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Product Code</TableCell>
//               <TableCell>Product Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Unit</TableCell>
//               <TableCell>Batches</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {products.map((product) => (
//               <TableRow key={product.item_code}>
//                 <TableCell>{product.item_code}</TableCell>
//                 <TableCell>{product.item_name}</TableCell>
//                 <TableCell>
//                   <Chip label={product.item_group} size="small" color="primary" />
//                 </TableCell>
//                 <TableCell>{product.stock_uom}</TableCell>
//                 <TableCell>{product.batches?.length || 0}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default Products;
// frontend/src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { Sync   as SyncIcon,
         Add    as AddIcon,
         Edit   as EditIcon,
         Delete as DeleteIcon } from '@mui/icons-material';

import { toast }          from 'react-toastify';
import { dataService }    from '../services/dataService';      // ERP sync
import { supplierService} from '../services/supplierService';  // manual CRUD

const Products = () => {
  /* ---------- state --------- */
  const [erpProducts,   setErpProducts]   = useState([]);
  const [manualProducts,setManual]       = useState([]);
  const [syncing,       setSyncing]      = useState(false);

  const [dialogOpen,setDialogOpen] = useState(false);
  const [selected,setSelected]     = useState(null);
  const emptyForm = { name:'', code:'', uom:'kg' };
  const [form,setForm] = useState(emptyForm);

  /* ---------- load on mount --------- */
  const loadManual = async()=>{
    const r = await supplierService.listProducts();
    setManual(r.data.products);
  };
  useEffect(()=>{ loadManual(); },[]);

  /* ---------- ERP sync ---------- */
  const handleSync = async () => {
    try {
      setSyncing(true);
      const r = await dataService.syncProducts();
      /* mark origin so UI can tag them */
      const mapped = r.data.data.map(p=>({
        id        : p.item_code,
        name      : p.item_name,
        code      : p.item_code,
        uom       : p.stock_uom,
        category  : p.item_group,
        origin    : 'erp',
        batches   : p.batches || []
      }));
      setErpProducts(mapped);
      toast.success(r.data.message);
    } catch (e) {
      toast.error('Failed to sync products from ERPNext');
    } finally { setSyncing(false); }
  };

  /* ---------- Dialog save ---------- */
  const saveProduct = async()=>{
    try{
      if(selected)
        await supplierService.updateProduct(selected._id,form);
      else
        await supplierService.createProduct(form);
      toast.success('Saved');
      setDialogOpen(false); setSelected(null); setForm(emptyForm);
      loadManual();
    }catch(e){ toast.error(e.response?.data?.error || 'Save failed'); }
  };

  const deleteProduct = async(id)=>{
    if(!window.confirm('Delete product?')) return;
    await supplierService.deleteProduct(id);
    loadManual();
  };

  /* ---------- merge lists for table ---------- */
  const rows = [...manualProducts.map(p=>({...p,origin:'manual'})), ...erpProducts];

  return (
    <Box>
      {/* header */}
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:3}}>
        <Typography variant="h4" sx={{fontWeight:600}}>Products</Typography>
        <Box>
          <Button variant="outlined" startIcon={<AddIcon/>}
                  sx={{mr:2}}
                  onClick={()=>{ setSelected(null); setForm(emptyForm); setDialogOpen(true); }}>
            Add Product
          </Button>
          <Button variant="contained" startIcon={<SyncIcon/>}
                  onClick={handleSync} disabled={syncing}>
            {syncing?'Syncing…':'Sync from ERPNext'}
          </Button>
        </Box>
      </Box>

      {rows.length===0 && (
        <Alert severity="info" sx={{mb:3}}>
          No products found. Add a product or click “Sync from ERPNext”.
        </Alert>
      )}

      {/* table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Batches</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(p=>(
              <TableRow key={p._id || p.id}>
                <TableCell>{p.code}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <Chip label={p.origin==='erp'?'ERPNext':'Manual'}
                        size="small"
                        color={p.origin==='erp'?'primary':'default'}/>
                </TableCell>
                <TableCell>{p.uom}</TableCell>
                <TableCell>{p.batches?.length || '-'}</TableCell>
                <TableCell>
                  {p.origin==='manual' && (
                    <>
                      <IconButton size="small"
                          onClick={()=>{setSelected(p); setForm({
                            name:p.name, code:p.code, uom:p.uom
                          }); setDialogOpen(true);}}>
                        <EditIcon/>
                      </IconButton>
                      <IconButton size="small" onClick={()=>deleteProduct(p._id)}>
                        <DeleteIcon/>
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* dialog */}
      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected?'Edit':'Add'} Product</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Product name" margin="normal"
                     value={form.name}
                     onChange={e=>setForm({...form,name:e.target.value})}/>
          <TextField fullWidth label="Product code / SKU" margin="normal"
                     value={form.code}
                     onChange={e=>setForm({...form,code:e.target.value})}/>
          <FormControl fullWidth margin="normal">
            <InputLabel>Unit of Measure</InputLabel>
            <Select value={form.uom}
                    onChange={e=>setForm({...form,uom:e.target.value})}>
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="ton">ton</MenuItem>
              <MenuItem value="bag">bag</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveProduct}>
            {selected?'Save changes':'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;