// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Alert
// } from '@mui/material';
// import { useAuth } from '../context/AuthContext';
// import { authService } from '../services/authService';
// import { toast } from 'react-toastify';

// const Profile = () => {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     companyName: user?.companyName || '',
//     contactPerson: {
//       name: user?.contactPerson?.name || '',
//       phone: user?.contactPerson?.phone || '',
//       position: user?.contactPerson?.position || ''
//     },
//     address: {
//       street: user?.address?.street || '',
//       city: user?.address?.city || '',
//       postalCode: user?.address?.postalCode || '',
//       state: user?.address?.state || ''
//     }
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (field, value) => {
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       setFormData({
//         ...formData,
//         [parent]: {
//           ...formData[parent],
//           [child]: value
//         }
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [field]: value
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await authService.updateProfile(formData);
//       toast.success('Profile updated successfully');
//     } catch (error) {
//       toast.error('Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//         Profile Settings
//       </Typography>

//       <Paper sx={{ p: 4 }}>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 Company Information
//               </Typography>
//             </Grid>
            
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Company Name"
//                 value={formData.companyName}
//                 onChange={(e) => handleChange('companyName', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
//                 Contact Person
//               </Typography>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 value={formData.contactPerson.name}
//                 onChange={(e) => handleChange('contactPerson.name', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Phone"
//                 value={formData.contactPerson.phone}
//                 onChange={(e) => handleChange('contactPerson.phone', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Position"
//                 value={formData.contactPerson.position}
//                 onChange={(e) => handleChange('contactPerson.position', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
//                 Address
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Street"
//                 value={formData.address.street}
//                 onChange={(e) => handleChange('address.street', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="City"
//                 value={formData.address.city}
//                 onChange={(e) => handleChange('address.city', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="State"
//                 value={formData.address.state}
//                 onChange={(e) => handleChange('address.state', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Postal Code"
//                 value={formData.address.postalCode}
//                 onChange={(e) => handleChange('address.postalCode', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={loading}
//                 sx={{ mt: 2 }}
//               >
//                 {loading ? 'Saving...' : 'Save Changes'}
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default Profile;

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    country: user?.country || '',
    contactPerson: {
      name: user?.contactPerson?.name || '',
      phone: user?.contactPerson?.phone || '',
      position: user?.contactPerson?.position || ''
    },
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
      state: user?.address?.state || ''
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      if (response.data.success) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contact Person
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name"
                value={formData.contactPerson.name}
                onChange={(e) => handleChange('contactPerson.name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.contactPerson.phone}
                onChange={(e) => handleChange('contactPerson.phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Position"
                value={formData.contactPerson.position}
                onChange={(e) => handleChange('contactPerson.position', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Address
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
                value={formData.address.street}
                onChange={(e) => handleChange('address.street', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => handleChange('address.city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => handleChange('address.state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.address.postalCode}
                onChange={(e) => handleChange('address.postalCode', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}

                            </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;