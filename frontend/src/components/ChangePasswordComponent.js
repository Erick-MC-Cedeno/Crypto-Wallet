// src/components/ChangePasswordComponent.js
import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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

    return (
        <Box sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Cambiar Contraseña
            </Typography>
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
                        sx: {
                            borderRadius: 2,  
                            border: '1px solid #ddd',  
                        },
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
                        sx: {
                            borderRadius: 2,  
                            border: '1px solid #ddd',  
                        },
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
                        sx: {
                            borderRadius: 2,  
                            border: '1px solid #ddd',  
                        },
                    }}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleChangePassword}
                    sx={{ mt: 2 }}
                >
                    Cambiar Contraseña
                </Button>
                {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Box>
        </Box>
    );
}

export default ChangePasswordComponent;
