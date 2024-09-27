import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import User from '../services/user';
import useAuth from '../hooks/useAuth';
import { Switch, FormControlLabel, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const TwoFactorAuthComponent = () => {
  const { auth } = useContext(AuthContext);
  const { updateTokenStatus, error, setError, successMessage } = useAuth();
  const [isTokenEnabled, setIsTokenEnabled] = useState(() => localStorage.getItem('isTokenEnabled') === 'true');
  const [showWarning, setShowWarning] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Autenticación de Dos Factores</Typography>
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
        {error && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', marginBottom: 1 }}>
            <ErrorOutlineIcon sx={{ marginRight: 1 }} />
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        {successMessage && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'green', marginBottom: 1 }}>
            <CheckCircleIcon sx={{ marginRight: 1 }} />
            <Typography variant="body2">{successMessage}</Typography>
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
          <Button onClick={() => handleConfirmDialogClose(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={() => handleConfirmDialogClose(true)} color="primary">
            Desactivar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TwoFactorAuthComponent;
