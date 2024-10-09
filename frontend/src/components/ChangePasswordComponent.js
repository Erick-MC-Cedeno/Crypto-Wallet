import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, InputAdornment, IconButton, Paper, Avatar, useMediaQuery } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import useAuth from '../hooks/useAuth';

function ChangePasswordComponent() {
    const { changePassword, successMessage, error } = useAuth();

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleTogglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }
        await changePassword(passwords);
    };

    // Usar useMediaQuery para obtener el tamaño de la pantalla
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', maxWidth: isSmallScreen ? '90%' : 400, mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1976D2', width: 48, height: 48 }}>
                    <LockIcon />
                </Avatar>
                <Typography variant="h6" component="h2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Cambiar Contraseña
                </Typography>
            </Box>
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    name="currentPassword"
                    label="Contraseña Actual"
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle current password visibility"
                                    onClick={() => handleTogglePasswordVisibility('currentPassword')}
                                >
                                    {showPasswords.currentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2, borderColor: '#ddd' },
                    }}
                    // Cambiar el tamaño de la tipografía del label según el tamaño de la pantalla
                    InputLabelProps={{
                        sx: { fontSize: isSmallScreen ? '0.875rem' : '1rem' } // Ajuste del tamaño del label
                    }}
                />
                <TextField
                    name="newPassword"
                    label="Nueva Contraseña"
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle new password visibility"
                                    onClick={() => handleTogglePasswordVisibility('newPassword')}
                                >
                                    {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2, borderColor: '#ddd' },
                    }}
                    InputLabelProps={{
                        sx: { fontSize: isSmallScreen ? '0.875rem' : '1rem' } // Ajuste del tamaño del label
                    }}
                />
                <TextField
                    name="confirmNewPassword"
                    label="Confirmar Contraseña"
                    type={showPasswords.confirmNewPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={passwords.confirmNewPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm new password visibility"
                                    onClick={() => handleTogglePasswordVisibility('confirmNewPassword')}
                                >
                                    {showPasswords.confirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2, borderColor: '#ddd' },
                    }}
                    InputLabelProps={{
                        sx: { fontSize: isSmallScreen ? '0.875rem' : '1rem' } // Ajuste del tamaño del label
                    }}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleChangePassword}
                    sx={{ mt: 2, borderRadius: 2 }}
                >
                    Cambiar Contraseña
                </Button>
                {successMessage && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{successMessage}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
            </Box>
        </Paper>
    );
}

export default ChangePasswordComponent;
