import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Snackbar,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ProviderService from '../services/providerService';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ProviderForm() {
  const [providerData, setProviderData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    streetName: '',
    city: '',
    postalCode: ''
  });
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({
    emailError: false,
    streetNameError: false,
    firstNameError: false,
    lastNameError: false,
    idNumberError: false,
    cityError: false,
    postalCodeError: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProviderData(prevData => ({ ...prevData, [name]: value }));

    // Validate fields
    setErrors(prevErrors => ({
      ...prevErrors,
      [name + 'Error']: validateField(name, value)
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'streetName':
        return value.length < 12;
      case 'firstName':
      case 'lastName':
      case 'idNumber':
      case 'city':
      case 'postalCode':
        return value.trim() === '';
      default:
        return false;
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileUploaded(Boolean(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).includes(true)) {
      setSnackbarMessage('Please correct the errors before submitting');
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Object.keys(providerData).forEach(key => formData.append(key, providerData[key]));
    if (file) {
      formData.append('image', file);
    }

    try {
      await ProviderService.createProvider(formData);
      setSnackbarMessage('Provider created successfully');
    } catch (err) {
      setSnackbarMessage('Error creating provider');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          maxWidth: 600,
          margin: 'auto',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'glow 1.5s infinite alternate',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            mb: 3,
          }}
        >
          Regístrate como proveedor P2P
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {[
              { label: 'First Name', name: 'firstName', icon: <PersonIcon /> },
              { label: 'Last Name', name: 'lastName', icon: <PersonIcon /> },
              { label: 'ID Number', name: 'idNumber', icon: <PhotoCameraIcon /> },
              { label: 'Email', name: 'email', icon: <EmailIcon /> },
              { label: 'Street Name', name: 'streetName', icon: <LocationOnIcon /> },
              { label: 'City', name: 'city', icon: <LocationOnIcon /> },
              { label: 'Postal Code', name: 'postalCode', icon: <LocationOnIcon /> }
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={providerData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: alpha('#f5f5f5', 0.8),
                    },
                    '& .MuiInputLabel-root': {
                      color: '#000', 
                      fontWeight: 'bold',
                    },
                    '& .MuiInputBase-input': {
                      backgroundColor: alpha('#f5f5f5', 0.8),
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                    '& .MuiInputLabel-shrink': {
                      top: 0,
                      left: 0,
                      color: '#000',
                      backgroundColor: alpha('#fff', 0.8),
                      padding: '0 4px',
                    },
                  }}
                  error={errors[field.name + 'Error']}
                  helperText={errors[field.name + 'Error'] ? `${field.label} is required` : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {field.icon}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom sx={{ color: '#000', fontWeight: '500', textAlign: 'center', mb: 2 }}>
                Se requiere de una selfie con la identificación en mano para verificar la identidad.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    sx={{
                      borderRadius: '12px',
                      padding: '10px 20px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        backgroundColor: alpha('#1976d2', 0.8),
                        transform: 'scale(1.05)',
                      },
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '16px',
                    }}
                  >
                    <PhotoCameraIcon sx={{ mr: 1 }} />
                    Upload selfie
                    {fileUploaded && (
                      <CheckCircleIcon sx={{
                        color: 'green',
                        position: 'absolute',
                        right: '1px',
                        fontSize: '20px',
                        marginLeft: '30px',
                      }} />
                    )}
                  </Button>
                </label>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: alpha('#1976d2', 0.8),
                      transform: 'scale(1.05)',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Provider'}
                </Button>
              </Box>
            </Grid>
          </Grid>
                    <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#333', color: '#fff' } }}
          />
        </Box>
      </Paper>

      <style jsx global>{`
        @keyframes glow {
          0% {
            box-shadow: 0 0 8px rgba(0, 122, 255, 0.5);
          }
          100% {
            box-shadow: 0 0 16px rgba(0, 122, 255, 0.7);
          }
        }
      `}</style>
    </Box>
  );
}
