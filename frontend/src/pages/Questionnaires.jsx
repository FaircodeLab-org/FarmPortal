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
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Alert
} from '@mui/material';
import { 
  Assignment as QuestionnaireIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Questionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState([
    {
      id: 1,
      title: 'EUDR Compliance Assessment',
      customer: 'ABC Importers EU',
      status: 'pending',
      createdDate: '2024-01-15',
      questions: [
        {
          section: 'General Information',
          items: [
            { id: 'q1', question: 'Is your company certified for sustainable practices?', type: 'radio' },
                        { id: 'q2', question: 'Do you have deforestation-free supply chain documentation?', type: 'radio' },
            { id: 'q3', question: 'Year of last third-party audit', type: 'text' }
          ]
        },
        {
          section: 'Land Use',
          items: [
            { id: 'q4', question: 'Total hectares under cultivation', type: 'number' },
            { id: 'q5', question: 'Percentage of land converted after 2020', type: 'number' },
            { id: 'q6', question: 'Types of certifications held', type: 'checkbox', 
              options: ['Rainforest Alliance', 'Fair Trade', 'Organic', 'UTZ', 'Other'] }
          ]
        }
      ]
    }
  ]);
  
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStartQuestionnaire = (questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setDialogOpen(true);
    setActiveStep(0);
    setAnswers({});
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // Submit questionnaire
    toast.success('Questionnaire submitted successfully');
    setDialogOpen(false);
    
    // Update questionnaire status
    setQuestionnaires(questionnaires.map(q => 
      q.id === selectedQuestionnaire.id 
        ? { ...q, status: 'completed' }
        : q
    ));
  };

  const handleDeny = (questionnaireId) => {
    setQuestionnaires(questionnaires.map(q => 
      q.id === questionnaireId 
        ? { ...q, status: 'denied' }
        : q
    ));
    toast.info('Questionnaire denied');
  };

  const renderQuestionInput = (item) => {
    switch (item.type) {
      case 'radio':
        return (
          <RadioGroup
            value={answers[item.id] || ''}
            onChange={(e) => handleAnswer(item.id, e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        );
      
      case 'text':
      case 'number':
        return (
          <TextField
            fullWidth
            type={item.type}
            value={answers[item.id] || ''}
            onChange={(e) => handleAnswer(item.id, e.target.value)}
            margin="normal"
          />
        );
      
      case 'checkbox':
        return (
          <Box>
            {item.options.map(option => (
                            <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={answers[item.id]?.includes(option) || false}
                    onChange={(e) => {
                      const current = answers[item.id] || [];
                      if (e.target.checked) {
                        handleAnswer(item.id, [...current, option]);
                      } else {
                        handleAnswer(item.id, current.filter(o => o !== option));
                      }
                    }}
                  />
                }
                label={option}
              />
            ))}
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Questionnaires
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Open Questionnaires
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionnaires.filter(q => q.status === 'pending').map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.title}</TableCell>
                <TableCell>{q.customer}</TableCell>
                <TableCell>{q.createdDate}</TableCell>
                <TableCell>
                  <Chip 
                    label={q.status} 
                    color="warning" 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleStartQuestionnaire(q)}
                    sx={{ mr: 1 }}
                  >
                    Start
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeny(q.id)}
                  >
                    Deny
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Questionnaire Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedQuestionnaire?.title}
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {selectedQuestionnaire?.questions.map((section) => (
              <Step key={section.section}>
                <StepLabel>{section.section}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {selectedQuestionnaire && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedQuestionnaire.questions[activeStep].section}
              </Typography>
              {selectedQuestionnaire.questions[activeStep].items.map((item) => (
                <Box key={item.id} sx={{ mb: 3 }}>
                  <FormLabel>{item.question}</FormLabel>
                  {renderQuestionInput(item)}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Save & Continue Later</Button>
          <Button 
            disabled={activeStep === 0} 
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === (selectedQuestionnaire?.questions.length - 1) ? (
            <Button variant="contained" onClick={handleSubmit}>
              Complete & Send
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Questionnaires;