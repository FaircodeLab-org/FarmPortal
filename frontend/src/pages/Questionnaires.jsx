// import React, { useState, useEffect } from 'react';
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
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stepper,
//   Step,
//   StepLabel,
//   TextField,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Checkbox,
//   Alert,
//   Grid
// } from '@mui/material';
// import { 
//   Assignment as QuestionnaireIcon,
//   Check as CheckIcon,
//   Close as CloseIcon
// } from '@mui/icons-material';
// import { toast } from 'react-toastify';

// const Questionnaires = () => {
//   const [questionnaires, setQuestionnaires] = useState([
//     {
//       id: 1,
//       title: 'EUDR Compliance Assessment',
//       customer: 'ABC Importers EU',
//       status: 'pending',
//       createdDate: '2024-01-15',
//       questions: [
//         {
//           section: 'General Information',
//           items: [
//             { id: 'q1', question: 'Is your company certified for sustainable practices?', type: 'radio' },
//                         { id: 'q2', question: 'Do you have deforestation-free supply chain documentation?', type: 'radio' },
//             { id: 'q3', question: 'Year of last third-party audit', type: 'text' }
//           ]
//         },
//         {
//           section: 'Land Use',
//           items: [
//             { id: 'q4', question: 'Total hectares under cultivation', type: 'number' },
//             { id: 'q5', question: 'Percentage of land converted after 2020', type: 'number' },
//             { id: 'q6', question: 'Types of certifications held', type: 'checkbox', 
//               options: ['Rainforest Alliance', 'Fair Trade', 'Organic', 'UTZ', 'Other'] }
//           ]
//         }
//       ]
//     }
//   ]);
  
//   const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [completed, setCompleted] = useState(false);

//   const handleStartQuestionnaire = (questionnaire) => {
//     setSelectedQuestionnaire(questionnaire);
//     setDialogOpen(true);
//     setActiveStep(0);
//     setAnswers({});
//   };

//   const handleAnswer = (questionId, value) => {
//     setAnswers({
//       ...answers,
//       [questionId]: value
//     });
//   };

//   const handleNext = () => {
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSubmit = () => {
//     // Submit questionnaire
//     toast.success('Questionnaire submitted successfully');
//     setDialogOpen(false);
    
//     // Update questionnaire status
//     setQuestionnaires(questionnaires.map(q => 
//       q.id === selectedQuestionnaire.id 
//         ? { ...q, status: 'completed' }
//         : q
//     ));
//   };

//   const handleDeny = (questionnaireId) => {
//     setQuestionnaires(questionnaires.map(q => 
//       q.id === questionnaireId 
//         ? { ...q, status: 'denied' }
//         : q
//     ));
//     toast.info('Questionnaire denied');
//   };

//   const renderQuestionInput = (item) => {
//     switch (item.type) {
//       case 'radio':
//         return (
//           <RadioGroup
//             value={answers[item.id] || ''}
//             onChange={(e) => handleAnswer(item.id, e.target.value)}
//           >
//             <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//             <FormControlLabel value="no" control={<Radio />} label="No" />
//           </RadioGroup>
//         );
      
//       case 'text':
//       case 'number':
//         return (
//           <TextField
//             fullWidth
//             type={item.type}
//             value={answers[item.id] || ''}
//             onChange={(e) => handleAnswer(item.id, e.target.value)}
//             margin="normal"
//           />
//         );
      
//       case 'checkbox':
//         return (
//           <Box>
//             {item.options.map(option => (
//                             <FormControlLabel
//                 key={option}
//                 control={
//                   <Checkbox
//                     checked={answers[item.id]?.includes(option) || false}
//                     onChange={(e) => {
//                       const current = answers[item.id] || [];
//                       if (e.target.checked) {
//                         handleAnswer(item.id, [...current, option]);
//                       } else {
//                         handleAnswer(item.id, current.filter(o => o !== option));
//                       }
//                     }}
//                   />
//                 }
//                 label={option}
//               />
//             ))}
//           </Box>
//         );
      
//       default:
//         return null;
//     }
//   };

//   const handleQuestionnairesSubmit = () => {
//     setCompleted(true);
//   };

//   if (completed) {
//     return (
//       <Box>
//         <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//           EUDR Supplier Assessment - Completed
//         </Typography>
//         <Typography>Your responses have been saved successfully.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//         Questionnaires
//       </Typography>

//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Open Questionnaires
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Title</TableCell>
//               <TableCell>Customer</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {questionnaires.filter(q => q.status === 'pending').map((q) => (
//               <TableRow key={q.id}>
//                 <TableCell>{q.title}</TableCell>
//                 <TableCell>{q.customer}</TableCell>
//                 <TableCell>{q.createdDate}</TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={q.status} 
//                     color="warning" 
//                     size="small" 
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     size="small"
//                     variant="contained"
//                     onClick={() => handleStartQuestionnaire(q)}
//                     sx={{ mr: 1 }}
//                   >
//                     Start
//                   </Button>
//                   <Button
//                     size="small"
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDeny(q.id)}
//                   >
//                     Deny
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Questionnaire Dialog */}
//       <Dialog 
//         open={dialogOpen} 
//         onClose={() => setDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           {selectedQuestionnaire?.title}
//         </DialogTitle>
//         <DialogContent>
//           <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//             {selectedQuestionnaire?.questions.map((section) => (
//               <Step key={section.section}>
//                 <StepLabel>{section.section}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           {selectedQuestionnaire && (
//             <Box>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 {selectedQuestionnaire.questions[activeStep].section}
//               </Typography>
//               {selectedQuestionnaire.questions[activeStep].items.map((item) => (
//                 <Box key={item.id} sx={{ mb: 3 }}>
//                   <FormLabel>{item.question}</FormLabel>
//                   {renderQuestionInput(item)}
//                 </Box>
//               ))}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Save & Continue Later</Button>
//           <Button 
//             disabled={activeStep === 0} 
//             onClick={handleBack}
//           >
//             Back
//           </Button>
//           {activeStep === (selectedQuestionnaire?.questions.length - 1) ? (
//             <Button variant="contained" onClick={handleSubmit}>
//               Complete & Send
//             </Button>
//           ) : (
//             <Button variant="contained" onClick={handleNext}>
//               Next
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>

//       {/* EUDR Supplier Assessment */}
//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//           EUDR Supplier Assessment
//         </Typography>
//         <Typography sx={{ mb: 2 }}>
//           The EUDR Supplier section evaluates your company's general readiness and operational adherence to EU
//           Deforestation Regulation (EUDR) compliance requirements, helping assess key aspects of your business
//           processes, risk management procedures, and supply chain checks.
//         </Typography>

//         <Paper sx={{ p: 4 }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Typography variant="h6">Has your company implemented EUDR-specific risk assessment and mitigation procedures?</Typography>
//               <FormControl>
//                 <RadioGroup
//                   value={answers.riskAssessment || ''}
//                   onChange={(e) => handleAnswer('riskAssessment', e.target.value)}
//                 >
//                   <FormControlLabel value="yes" control={<Radio />} label="Yes, we have established procedures" />
//                   <FormControlLabel value="no" control={<Radio />} label="No, we have not yet implemented EUDR-specific risk management procedures" />
//                 </RadioGroup>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6">What measures does your company employ to ensure EUDR compliance?</Typography>
//               <FormControl>
//                 <FormLabel>Check all that apply:</FormLabel>
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Automated compliance management system"
//                   onChange={(e) => handleAnswer('complianceMeasures', { ...answers.complianceMeasures, automated: e.target.checked })}
//                 />
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Regular EUDR-compliance audits"
//                   onChange={(e) => handleAnswer('complianceMeasures', { ...answers.complianceMeasures, audits: e.target.checked })}
//                 />
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Systematic verification of supplier information"
//                   onChange={(e) => handleAnswer('complianceMeasures', { ...answers.complianceMeasures, verification: e.target.checked })}
//                 />
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Structured process for EUDR due diligence statements"
//                   onChange={(e) => handleAnswer('complianceMeasures', { ...answers.complianceMeasures, structuredProcess: e.target.checked })}
//                 />
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6">Does your company maintain physical segregation between EUDR-compliant and non-compliant products?</Typography>
//               <FormControl>
//                 <RadioGroup
//                   value={answers.physicalSegregation || ''}
//                   onChange={(e) => handleAnswer('physicalSegregation', e.target.value)}
//                 >
//                   <FormControlLabel value="yes" control={<Radio />} label="Yes, we have established procedures and controls" />
//                   <FormControlLabel value="no" control={<Radio />} label="No, we do not currently have a system to segregate compliant and non-compliant products" />
//                   <FormControlLabel value="notApplicable" control={<Radio />} label="Not applicable, we only have EUDR-compliant products" />
//                 </RadioGroup>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6">Do you ensure your suppliers' EUDR compliance?</Typography>
//               <FormControl>
//                 <RadioGroup
//                   value={answers.supplierCompliance || ''}
//                   onChange={(e) => handleAnswer('supplierCompliance', e.target.value)}
//                 >
//                   <FormControlLabel value="yes" control={<Radio />} label="Yes, we actively ensure our suppliers comply with EUDR" />
//                   <FormControlLabel value="no" control={<Radio />} label="No, we do not currently have a system to verify supplier EUDR compliance" />
//                 </RadioGroup>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6">How do you check your products' EUDR compliance?</Typography>
//               <FormControl>
//                 <FormLabel>Check all that apply:</FormLabel>
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Verification of geolocation data and DDS reference numbers"
//                   onChange={(e) => handleAnswer('productCompliance', { ...answers.productCompliance, geolocation: e.target.checked })}
//                 />
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Identification and documentation of all supply chain participants"
//                   onChange={(e) => handleAnswer('productCompliance', { ...answers.productCompliance, documentation: e.target.checked })}
//                 />
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Assessment of deforestation risk through land use and forest cover analysis"
//                   onChange={(e) => handleAnswer('productCompliance', { ...answers.productCompliance, deforestationRisk: e.target.checked })}
//                 />
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="Monitoring of product mixing risks at transshipment points"
//                   onChange={(e) => handleAnswer('productCompliance', { ...answers.productCompliance, mixingRisks: e.target.checked })}
//                 />
//                 <FormControlLabel
//                   control={<Checkbox />}
//                   label="No entry checks related to EUDR compliance are conducted"
//                   onChange={(e) => handleAnswer('productCompliance', { ...answers.productCompliance, noChecks: e.target.checked })}
//                 />
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6">Upload Evidence</Typography>
//               <TextField
//                 fullWidth
//                 type="file"
//                 onChange={(e) => handleAnswer('evidenceFile', e.target.files[0])}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button variant="contained" color="primary" onClick={handleQuestionnairesSubmit}>
//                 Save and Complete
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default Questionnaires;
// frontend/src/pages/Questionnaires.jsx
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  Assignment as QuestionnaireIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { requestService } from '../services/requestService';

const Questionnaires = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [evidenceFile, setEvidenceFile] = useState(null);

  useEffect(() => {
    fetchProductDataRequests();
  }, []);

  const fetchProductDataRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getSupplierRequests();
      // Filter only product_data requests that are pending
      const productDataRequests = response.data.requests.filter(
        req => req.requestType === 'product_data' && req.status === 'pending'
      );
      setRequests(productDataRequests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuestionnaire = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
    setAnswers({});
    setEvidenceFile(null);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleFileUpload = (event) => {
    setEvidenceFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      // Prepare EUDR compliance data
      const eudrCompliance = {
        deforestationFree: answers.deforestationFree || '',
        legalCompliance: answers.legalCompliance || '',
        certifications: answers.certifications || [],
        sustainabilityMeasures: answers.sustainabilityMeasures || '',
        riskAssessment: answers.riskAssessment || '',
        complianceMeasures: answers.complianceMeasures || {},
        physicalSegregation: answers.physicalSegregation || '',
        supplierCompliance: answers.supplierCompliance || '',
        productCompliance: answers.productCompliance || {},
        questionnaireFilled: true,
        filledDate: new Date().toISOString()
      };

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('message', 'EUDR questionnaire completed');
      formData.append('status', 'completed');
      formData.append('eudrCompliance', JSON.stringify(eudrCompliance));
      
      if (evidenceFile) {
        formData.append('evidence', evidenceFile);
      }

      // Submit response
      await requestService.respondToRequest(selectedRequest._id, {
        message: 'EUDR questionnaire completed',
        status: 'completed',
        eudrCompliance: eudrCompliance
      });

      toast.success('Questionnaire submitted successfully');
      setDialogOpen(false);
      fetchProductDataRequests(); // Refresh the list
    } catch (error) {
      toast.error('Failed to submit questionnaire');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        EUDR Compliance Requests
      </Typography>

      {requests.length === 0 ? (
        <Alert severity="info">
          No pending EUDR compliance requests at this time.
        </Alert>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Pending Compliance Requests
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request._id.slice(-8)}</TableCell>
                    <TableCell>{request.customer?.companyName}</TableCell>
                    <TableCell>
                      {request.requestedProducts?.[0]?.productId?.name || 
                       request.requestedProducts?.[0]?.productName || '-'}
                    </TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label="Pending" 
                        color="warning" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleStartQuestionnaire(request)}
                      >
                        Start Assessment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* EUDR Assessment Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          EUDR Compliance Assessment for {selectedRequest?.customer?.companyName}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Product: {selectedRequest?.requestedProducts?.[0]?.productId?.name || 'Product'}
          </Alert>

          <Grid container spacing={3}>
            {/* Question 1 */}
            <Grid item xs={12}>
              <Typography variant="h6">
                1. Is this product deforestation-free?
              </Typography>
              <RadioGroup
                value={answers.deforestationFree || ''}
                onChange={(e) => handleAnswer('deforestationFree', e.target.value)}
              >
                <FormControlLabel 
                  value="yes" 
                  control={<Radio />} 
                  label="Yes, verified deforestation-free since Dec 31, 2020" 
                />
                <FormControlLabel 
                  value="no" 
                  control={<Radio />} 
                  label="No / Cannot verify" 
                />
              </RadioGroup>
            </Grid>

            {/* Question 2 */}
            <Grid item xs={12}>
              <Typography variant="h6">
                2. Legal compliance status
              </Typography>
              <RadioGroup
                value={answers.legalCompliance || ''}
                onChange={(e) => handleAnswer('legalCompliance', e.target.value)}
              >
                <FormControlLabel value="compliant" control={<Radio />} label="Fully compliant with local laws" />
                <FormControlLabel value="partial" control={<Radio />} label="Partially compliant" />
                <FormControlLabel value="non-compliant" control={<Radio />} label="Non-compliant" />
              </RadioGroup>
            </Grid>

            {/* Question 3 */}
            <Grid item xs={12}>
              <Typography variant="h6">
                3. Certifications held
              </Typography>
              {['Rainforest Alliance', 'Fair Trade', 'Organic', 'UTZ', 'RSPO', 'FSC'].map(cert => (
                <FormControlLabel
                  key={cert}
                  control={
                    <Checkbox
                      checked={answers.certifications?.includes(cert) || false}
                      onChange={(e) => {
                        const current = answers.certifications || [];
                        if (e.target.checked) {
                          handleAnswer('certifications', [...current, cert]);
                        } else {
                          handleAnswer('certifications', current.filter(c => c !== cert));
                        }
                      }}
                    />
                  }
                  label={cert}
                />
              ))}
            </Grid>

            {/* Question 4 */}
            <Grid item xs={12}>
              <Typography variant="h6">
                4. Has your company implemented EUDR-specific risk assessment procedures?
              </Typography>
              <RadioGroup
                value={answers.riskAssessment || ''}
                onChange={(e) => handleAnswer('riskAssessment', e.target.value)}
                              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes, we have established procedures" />
                <FormControlLabel value="no" control={<Radio />} label="No, we have not yet implemented EUDR-specific procedures" />
              </RadioGroup>
            </Grid>

            {/* Question 5 */}
            <Grid item xs={12}>
              <Typography variant="h6">
                5. Do you maintain physical segregation between EUDR-compliant and non-compliant products?
              </Typography>
              <RadioGroup
                value={answers.physicalSegregation || ''}
                onChange={(e) => handleAnswer('physicalSegregation', e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes, we have established procedures and controls" />
                <FormControlLabel value="no" control={<Radio />} label="No, we do not currently segregate products" />
                <FormControlLabel value="notApplicable" control={<Radio />} label="Not applicable - we only have EUDR-compliant products" />
              </RadioGroup>
            </Grid>

            {/* Question 6 */}
            <Grid item xs={12}>
              <Typography variant="h6">
                6. Sustainability measures description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe your sustainability practices..."
                value={answers.sustainabilityMeasures || ''}
                onChange={(e) => handleAnswer('sustainabilityMeasures', e.target.value)}
              />
            </Grid>

            {/* Evidence Upload */}
            <Grid item xs={12}>
              <Typography variant="h6">
                7. Upload Evidence (Certificates, Documents, etc.)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                {evidenceFile ? evidenceFile.name : 'Choose File'}
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!answers.deforestationFree || !answers.legalCompliance}
          >
            Submit Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Questionnaires;