// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
// const axios = require('axios');
// const { getErpCreds, buildHeaders } = require('../services/erpnextService');
// const User = require('../models/User');

// exports.register = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { email, password, companyName, country, role } = req.body;
//     const { baseURL, apiKey, apiSecret } = getErpCreds(role);
//     // Create user in ERPNext
//     const payload = {
//       email,
//       password,
//       company: companyName,
//       country,
//       role
//     };
//     const erpRes = await axios.post(
//       `${baseURL}/api/method/frappe.core.doctype.user.user.sign_up`,
//       payload,
//       { headers: buildHeaders(apiKey, apiSecret) }
//     );

//   // Generate token for portal session
//     const token = jwt.sign(
//       { email, role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );
//     res.status(201).json({
//       success: true,
//       token,
//       user: {
//         email,
//         companyName,
//         role,
//         country
//       }
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };

// // exports.login = async (req, res) => {
// //   try {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ errors: errors.array() });
// //     }
// //     const { email, password } = req.body;
// //     let role = 'customer'; // Use let so it can be reassigned
// //     const { baseURL } = getErpCreds('customer');

// //       // Authenticate against ERPNext by sending credentials in the body
// //       console.log('Login payload:', { usr: email, pwd: password });
// //       const erpRes = await axios.post(
// //         `${baseURL}/api/method/login`,
// //         { usr: email, pwd: password }
// //       );

// //     // Fetch user roles from ERPNext
// //     const { apiKey, apiSecret } = getErpCreds('customer');
// //     const userRolesRes = await axios.get(
// //       `${baseURL}/api/resource/User/${encodeURIComponent(email)}`,
// //       { headers: buildHeaders(apiKey, apiSecret) }
// //     );

// //     const userRoles = userRolesRes.data.data.roles.map(role => role.role);
// //     role = userRoles.includes('Supplier') ? 'supplier' : 'customer'; // Reassign role instead of redeclaring

// //   // Issue JWT for portal
// //     const token = jwt.sign(
// //       { email, role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '7d' }
// //     );
// //     res.json({
// //       success: true,
// //       token,
// //       user: {
// //         email,
// //         role
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Login error:', error.response?.data || error.message);
// //     res.status(400).json({ error: 'Invalid credentials' });
// //   }
// // };
// exports.login = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { email, password } = req.body;
//     let role = 'customer';
//     const { baseURL } = getErpCreds('customer');

//     // Authenticate against ERPNext
//     const erpRes = await axios.post(
//       `${baseURL}/api/method/login`,
//       { usr: email, pwd: password }
//     );

//     // Fetch user roles and profile from ERPNext
//     const { apiKey, apiSecret } = getErpCreds('customer');
//     const userRes = await axios.get(
//       `${baseURL}/api/resource/User/${encodeURIComponent(email)}`,
//       { headers: buildHeaders(apiKey, apiSecret) }
//     );
//     const userData = userRes.data.data;
//     const userRoles = userData.roles.map(role => role.role);
//     role = userRoles.includes('Supplier') ? 'supplier' : 'customer';

//     // Save or update user in MongoDB
//     const mongoUser = await User.findOneAndUpdate(
//       { email },
//       {
//         email,
//         role,
//         companyName: userData.company || '',
//         country: userData.country || '',
//         // Add other fields as needed
//       },
//       { upsert: true, new: true }
//     );

//     // Issue JWT for portal
//     const token = jwt.sign(
//       { email, role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );
//     res.json({
//       success: true,
//       token,
//       user: {
//         email,
//         role,
//         companyName: mongoUser.companyName,
//         country: mongoUser.country
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error.response?.data || error.message);
//     res.status(400).json({ error: 'Invalid credentials' });
//   }
// };

// exports.getProfile = async (req, res) => {
//   try {
//     console.log('Profile fetch request received, user from token:', req.user);
//     res.json({ success: true, user: req.user });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ error: 'Failed to fetch profile' });
//   }
// };

// // exports.updateProfile = async (req, res) => {
// //   try {
// //     const updates = req.body;
// //     const user = await User.findOneAndUpdate(
// //       { email: req.user.email },
// //       updates,
// //       { new: true, runValidators: true }
// //     );
// //     if (!user) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }

// //     // Sync to ERPNext Organization Profile doctype
// //     const { baseURL, apiKey, apiSecret } = require('../services/erpnextService').getErpCreds(user.role);
// //     const headers = require('../services/erpnextService').buildHeaders(apiKey, apiSecret);
// //     const orgProfilePayload = {
// //       company_name: user.companyName,
// //       account_type: user.role,
// //       // Add other fields as needed from user
// //     };
// //     try {
// //       await require('axios').post(
// //         `${baseURL}/api/resource/Organization Profile`,
// //         orgProfilePayload,
// //         { headers }
// //       );
// //     } catch (erpErr) {
// //       console.error('ERPNext sync error:', erpErr.response?.data || erpErr.message);
// //       // Optionally, you can return a warning in the response
// //     }

// //     res.json({ success: true, user });
// //   } catch (error) {
// //     console.error('Update profile error:', error);
// //     res.status(500).json({ error: 'Failed to update profile' });
// //   }
// // };
// exports.updateProfile = async (req, res) => {
//   try {
//     const { companyName, accountType, country } = req.body;

//     // Update MongoDB
//     const updatedUser = await User.findOneAndUpdate(
//       { email: req.user.email },
//       { companyName, accountType, country },
//       { new: true }
//     );

//     // Sync with ERPNext
//     const { baseURL, apiKey, apiSecret } = getErpCreds('customer');
//     const payload = {
//       company_name: companyName,
//       account_type: accountType,
//       country,
//     };
//     await axios.post(
//       `${baseURL}/api/resource/Organization Profile`,
//       payload,
//       { headers: buildHeaders(apiKey, apiSecret) }
//     );

//     res.json({ success: true, user: updatedUser });
//   } catch (error) {
//     console.error('Update profile error:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to update profile' });
//   }
// };

// console.log('buildHeaders:', typeof buildHeaders);

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const axios = require('axios');
const { getErpCreds, buildHeaders } = require('../services/erpnextService');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, companyName, country, role } = req.body;
    const { baseURL, apiKey, apiSecret } = getErpCreds(role);
    
    // Create user in ERPNext
    const payload = {
      email,
      password,
      company: companyName,
      country,
      role
    };
    const erpRes = await axios.post(
      `${baseURL}/api/method/frappe.core.doctype.user.user.sign_up`,
      payload,
      { headers: buildHeaders(apiKey, apiSecret) }
    );

    // Generate token for portal session
    const token = jwt.sign(
      { email, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      success: true,
      token,
      user: {
        email,
        companyName,
        role,
        country
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    let role = 'customer';
    const { baseURL } = getErpCreds('customer');

    // Authenticate against ERPNext
    console.log('Login payload:', { usr: email, pwd: password });
    const erpRes = await axios.post(
      `${baseURL}/api/method/login`,
      { usr: email, pwd: password }
    );

    // Fetch user roles and profile from ERPNext
    const { apiKey, apiSecret } = getErpCreds('customer');
    const userRes = await axios.get(
      `${baseURL}/api/resource/User/${encodeURIComponent(email)}`,
      { headers: buildHeaders(apiKey, apiSecret) }
    );
    const userData = userRes.data.data;
    const userRoles = userData.roles.map(r => r.role);
    role = userRoles.includes('Supplier') ? 'supplier' : 'customer';

    // Try to fetch existing profile from MongoDB or create new
    let mongoUser = await User.findOne({ email });
    
    if (!mongoUser) {
      // Create new user in MongoDB
      // mongoUser = await User.create({
      //   email,
      //   password: 'erpnext-managed',
      //   role,
      //   companyName: '',
      //   country: '',
      mongoUser = await User.create({
        email,
        password: 'erpnext-managed',
        role,
        companyName: userData.full_name || userData.username || email.split('@')[0],  // Use ERPNext username
        country: userData.time_zone || '',
  // ...
        isEU: false,
        contactPerson: {
          name: '',
          phone: '',
          position: ''
        },
        address: {
          street: '',
          city: '',
          postalCode: '',
          state: ''
        }
      });
    }

    // Issue JWT for portal
    const token = jwt.sign(
      { email, role: mongoUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        email: mongoUser.email,
        role: mongoUser.role,
        companyName: mongoUser.companyName,
        country: mongoUser.country,
        contactPerson: mongoUser.contactPerson,
        address: mongoUser.address
      }
    });
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('Profile fetch request received, user from token:', req.user);
    
    // Fetch the complete user profile from MongoDB
    let user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      // If user doesn't exist in MongoDB, create one
      user = await User.create({
        email: req.user.email,
        password: 'erpnext-managed',
        role: req.user.role,
        companyName: '',
        country: '',
        isEU: false,
        contactPerson: {
          name: '',
          phone: '',
          position: ''
        },
                address: {
          street: '',
          city: '',
          postalCode: '',
          state: ''
        }
      });
    }
    
    // Return the complete user profile from MongoDB
    res.json({ 
      success: true, 
      user: {
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        country: user.country,
        contactPerson: user.contactPerson,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Update user in MongoDB with all fields
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        companyName: updates.companyName || '',
        country: updates.country || '',
        contactPerson: {
          name: updates.contactPerson?.name || '',
          phone: updates.contactPerson?.phone || '',
          position: updates.contactPerson?.position || ''
        },
        address: {
          street: updates.address?.street || '',
          city: updates.address?.city || '',
          postalCode: updates.address?.postalCode || '',
          state: updates.address?.state || ''
        }
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('MongoDB user updated:', user);

    // Sync with ERPNext Organization Profile
    try {
      const { baseURL, apiKey, apiSecret } = getErpCreds(user.role);
      
      // Check if Organization Profile exists by email
      let orgProfileName = null;
      let orgProfileExists = false;
      
      try {
        const checkRes = await axios.get(
          `${baseURL}/api/resource/Organization Profile?filters=[["email","=","${user.email}"]]&fields=["name","email"]`,
          { headers: buildHeaders(apiKey, apiSecret) }
        );
        
        if (checkRes.data.data && checkRes.data.data.length > 0) {
          orgProfileExists = true;
          orgProfileName = checkRes.data.data[0].name;
          console.log('Found existing Organization Profile:', orgProfileName);
        }
      } catch (err) {
        console.error('Error checking Organization Profile:', err.response?.data);
      }

      // Prepare the payload with exact field mapping
      const orgProfilePayload = {
        // Company info
        company_name: user.companyName || '',
        account_type: user.role === 'supplier' ? 'Supplier' : 'Customer',
        email: user.email,
        country: user.country || '',
        
        // Contact person fields
        contact_name: user.contactPerson?.name || '',
        contact_phone: user.contactPerson?.phone || '',
        position: user.contactPerson?.position || '',
        
        // Address fields
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postal_code: user.address?.postalCode || ''
      };

  // Debugging logs for ERPNext sync
  console.log('ERPNext URL:', `${baseURL}/api/resource/Organization Profile`);
  console.log('Headers:', buildHeaders(apiKey, apiSecret));
  console.log('Payload being sent:', JSON.stringify(orgProfilePayload, null, 2));

      console.log('Organization Profile payload:', orgProfilePayload);

      if (orgProfileExists && orgProfileName) {
        // Update existing Organization Profile
        const updateRes = await axios.put(
          `${baseURL}/api/resource/Organization Profile/${encodeURIComponent(orgProfileName)}`,
          orgProfilePayload,
          { headers: buildHeaders(apiKey, apiSecret) }
        );
        console.log('Updated Organization Profile in ERPNext:', updateRes.data);
      } else {
        // Create new Organization Profile
        const createPayload = {
          ...orgProfilePayload,
          doctype: 'Organization Profile'
        };
        
        const createRes = await axios.post(
          `${baseURL}/api/resource/Organization Profile`,
          createPayload,
          { headers: buildHeaders(apiKey, apiSecret) }
        );
        console.log('Created new Organization Profile in ERPNext:', createRes.data);
      }
    } catch (erpErr) {
      console.error('ERPNext sync error:', erpErr.response?.data || erpErr.message);
      // Log the full error for debugging
      if (erpErr.response?.data) {
        console.error('ERPNext error details:', JSON.stringify(erpErr.response.data, null, 2));
      }
      // Don't fail the request if ERPNext sync fails
      // The profile is still saved in MongoDB
    }

    // Return the complete updated user
    res.json({ 
      success: true, 
      user: {
        email: user.email,
                role: user.role,
        companyName: user.companyName,
        country: user.country,
        contactPerson: user.contactPerson,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

console.log('buildHeaders:', typeof buildHeaders);