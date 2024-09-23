import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 700,
      fontSize: '1.25rem',
      color: '#E0E0E0',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#B0B0B0',
    },
  },
  palette: {
    primary: {
      main: '#1E88E5',
    },
    secondary: {
      main: '#FF5722',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          height: '300px', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden', 
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 6px 30px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          padding: '12px 24px',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#FF3D00',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: '24px',
          backgroundColor: '#1E1E1E',
        },
      },
    },
  },
});

export default function ProviderCard({ provider }) {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cryptoCoin, setCryptoCoin] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCryptoCoinChange = (event) => {
    setCryptoCoin(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="center" mt={3} p={2}>
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <BadgeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    {provider.firstName} {provider.lastName}
                    <CheckCircleIcon sx={{ color: '#1DA1F2', ml: 1, fontSize: 24 }} />
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {provider.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Street Name:</strong> {provider.streetName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>City:</strong> {provider.city}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Button variant="contained" color="secondary" fullWidth onClick={handleClickOpen}>
              Vender
            </Button>
          </CardContent>
        </Card>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Información de Venta</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nombre Completo" type="text" fullWidth variant="outlined" />
          <FormControl fullWidth margin="dense">
            <InputLabel>Método de Pago</InputLabel>
            <Select value={paymentMethod} onChange={handlePaymentMethodChange} label="Método de Pago">
              <MenuItem value="BAC">BAC CREDOMATIC</MenuItem>
              <MenuItem value="LAFISE">LAFISE</MenuItem>
              <MenuItem value="En Persona">En Persona</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Cripto Moneda</InputLabel>
            <Select value={cryptoCoin} onChange={handleCryptoCoinChange} label="Cripto Moneda">
              <MenuItem value="ETH">ETH</MenuItem>
              <MenuItem value="MATIC">MATIC</MenuItem>
              <MenuItem value="FTM">FTM</MenuItem>
              <MenuItem value="Avalanche">Avalanche</MenuItem>
              <MenuItem value="BNB">BNB</MenuItem>
            </Select>
          </FormControl>
          <TextField margin="dense" label="Número de Cuenta" type="text" fullWidth variant="outlined" />
          <TextField margin="dense" label="Cantidad" type="number" fullWidth variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleClose} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
