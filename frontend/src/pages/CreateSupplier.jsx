import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { customerService } from '../services/customerService';

const CreateSupplier = () => {
  const [form, setForm] = useState({ supplier_name:'', item_code:'', item_name:'' });
  const [msg, setMsg] = useState('');

  const submit = async () => {
    setMsg('');
    try {
      await customerService.createSupplier({ supplier_name: form.supplier_name });
      await customerService.createItem({
        supplier_name: form.supplier_name,
        item_code   : form.item_code,
        item_name   : form.item_name
      });
      setMsg('Supplier & Item created!');
      setForm({ supplier_name:'', item_code:'', item_name:'' });
    } catch(e) {
      let detail = e.response?.data?.detail || e.response?.data?.error || e.message || 'API failed';
      setMsg('Error: ' + detail);
    }
  };

  return (
    <Paper sx={{ p:3, maxWidth:500 }}>
      <Typography variant="h6">Create Supplier & Product</Typography>
      <TextField fullWidth label="Supplier Name"
        value={form.supplier_name}
        onChange={e=>setForm({...form,supplier_name:e.target.value})}
        sx={{ mt:2 }}/>
      <TextField fullWidth label="Item Code"
        value={form.item_code}
        onChange={e=>setForm({...form,item_code:e.target.value})}
        sx={{ mt:2 }}/>
      <TextField fullWidth label="Item Name"
        value={form.item_name}
        onChange={e=>setForm({...form,item_name:e.target.value})}
        sx={{ mt:2 }}/>
      <Button variant="contained" fullWidth sx={{ mt:3 }} onClick={submit}>
        Save
      </Button>
      {msg && <Typography sx={{ mt:2 }}>{msg}</Typography>}
    </Paper>
  );
};

export default CreateSupplier;
