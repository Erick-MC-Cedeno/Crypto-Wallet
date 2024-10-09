import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import User from '../services/user';
import useAuth from '../hooks/useAuth';
import { Switch, FormControlLabel, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Paper, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import MuiAlert from '@mui/material/Alert';

const TwoFactorAuthComponent = () => {
  const { auth } = useContext(AuthContext);
  const { updateTokenStatus, error, setError } = useAuth();
  const [isTokenEnabled, setIsTokenEnabled] = useState(() => localStorage.getItem('isTokenEnabled') === 'true');
  const [showWarning, setShowWarning] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    const fetchTokenStatus = async () => {
      if (!auth) return;

      try {
        const { data } = await User.getInfo();
        if (data && 'data' in data) {
          setIsTokenEnabled(data.data.isTokenEnabled);
          localStorage.setItem('isTokenEnabled', data.data.isTokenEnabled);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTokenStatus();
  }, [auth, setError]);

  const toggleTwoFactorAuth = () => {
    if (isTokenEnabled) {
      setShowWarning(true);
      setConfirmDialogOpen(true);
    } else {
      updateTokenStatusAndLocalStorage(true);
    }
  };

  const updateTokenStatusAndLocalStorage = async (newStatus) => {
    try {
      const userId = auth._id;
      await updateTokenStatus({ userId, isTokenEnabled: newStatus });
      setIsTokenEnabled(newStatus);
      localStorage.setItem('isTokenEnabled', newStatus);
      setSnackbar({ open: true, message: newStatus ? "Autenticación de dos factores activada." : "Autenticación de dos factores desactivada.", severity: "success" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmDialogClose = (confirm) => {
    setConfirmDialogOpen(false);
    if (confirm) {
      updateTokenStatusAndLocalStorage(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        handleCloseSnackbar();
      }, 3000); // 3000 milisegundos = 3 segundos
      return () => clearTimeout(timer);
    }
  }, );

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Autenticación de Dos Factores
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isTokenEnabled}
            onChange={toggleTwoFactorAuth}
            color="primary"
          />
        }
        label={isTokenEnabled ? (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Desactivar
            <CheckCircleIcon style={{ color: 'green', marginLeft: 4, fontSize: '1.2rem' }} />
          </span>
        ) : 'Activar'}
      />
      {isTokenEnabled && (
        <Typography variant="body2" style={{ color: 'green' }}>
          La autenticación de dos factores está activa.
        </Typography>
      )}
      <Box sx={{ marginTop: 2 }}>
        {showWarning && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', marginBottom: 1 }}>
            <WarningIcon sx={{ marginRight: 1 }} />
            <Typography variant="body2">
              Desactivar la autenticación de dos factores pone en riesgo tu cuenta.
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog open={confirmDialogOpen} onClose={() => handleConfirmDialogClose(false)}>
        <DialogTitle>Confirmar Desactivación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas desactivar la autenticación de dos factores? Esto pone en riesgo tu cuenta a cibercriminales.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => handleConfirmDialogClose(false)} 
            color="error" 
            variant="contained" 
            sx={{ marginRight: 1 }} 
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => handleConfirmDialogClose(true)} 
            color="primary" 
            variant="contained" 
          >
            Desactivar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <MuiAlert elevation={6} variant="filled" onClose={() => setError(null)} severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      )}
    </Paper>
  );
};

export default TwoFactorAuthComponent;
