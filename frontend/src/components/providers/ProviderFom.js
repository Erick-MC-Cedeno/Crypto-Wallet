import React, { useState, useContext, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../hooks/AuthContext';
import useProviders from '../../hooks/useProviders';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';

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
  const [openDialog, setOpenDialog] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { findProviderByEmail, createProvider } = useProviders();
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const checkProvider = async () => {
      try {
        const existingProvider = await findProviderByEmail(auth.email);
        if (existingProvider) {
          console.log('Provider already exists, redirecting to /providerchat');
          history.push('/providerchat');
        }
      } catch (err) {
        if (err.message === "No hay proveedores") {
          console.log('No hay proveedores');
        } else {
          console.error('Error checking provider:', err);
        }
      }
    };

    checkProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo una vez al montar el componente

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

    try {
      const formData = new FormData();
      Object.keys(providerData).forEach(key => formData.append(key, providerData[key]));
      if (file) {
        formData.append('image', file);
      }

      await createProvider(formData);
      setSnackbarMessage('Provider created successfully');
      history.push('/providerchat');
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

  const handleAcceptTerms = () => {
    if (acceptTerms) {
      setOpenDialog(false);
    } else {
      setSnackbarMessage('Debes aceptar los términos y condiciones para continuar');
      setSnackbarOpen(true);
    }
  };

  if (openDialog) {
    return (
      <Dialog
        open={openDialog}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'primary.main',
          fontWeight: 'bold'
        }}>
          <SecurityIcon fontSize="large" />
          Términos y Condiciones - Proveedor P2P BlockVault
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, color: 'text.primary' }}>
            Al registrarte como proveedor P2P en BlockVault, aceptas las siguientes condiciones:
          </DialogContentText>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningIcon /> Advertencias Importantes:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Tu registro está sujeto a un proceso de verificación de identidad.</li>
              <li>El proceso de verificación puede tomar de 2 a 4 días hábiles.</li>
              <li>Deberás proporcionar documentación válida y una selfie para la verificación.</li>
              <li>El sistema Escrow será utilizado para todas las transacciones.</li>
              <li>Cualquier intento de fraude o abuso será reportado a las autoridades.</li>
            </Typography>
          </Box>

          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              BlockVault se reserva el derecho de:
              <ul>
                <li>Rechazar solicitudes que no cumplan con los requisitos.</li>
                <li>Suspender cuentas que violen nuestros términos.</li>
                <li>Reportar actividades sospechosas a las autoridades competentes.</li>
                <li>Retener fondos en caso de investigación por fraude.</li>
              </ul>
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                color="primary"
              />
            }
            label="He leído y acepto los términos y condiciones de BlockVault"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => history.push('/')}
            color="error"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAcceptTerms}
            color="primary"
            variant="contained"
            disabled={!acceptTerms}
            sx={{
              fontWeight: 'bold',
              '&:enabled': {
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              }
            }}
          >
            Aceptar y Continuar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

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
