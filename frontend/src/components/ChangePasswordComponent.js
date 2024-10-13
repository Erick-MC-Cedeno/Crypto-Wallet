import React, { useState } from 'react';
import {
    TextField,
    Button,
    Alert,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Paper,
    Avatar
} from '@mui/material';
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

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', maxWidth: 400, width: '100%', mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1976D2', width: 48, height: 48 }}>
                    <LockIcon />
                </Avatar>
                <Typography variant="h6" component="h2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Cambiar Contraseña
                </Typography>
            </Box>
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field, index) => (
                    <TextField
                        key={field}
                        name={field}
                        label={field === 'currentPassword' ? 'Contraseña Actual' : field === 'newPassword' ? 'Nueva Contraseña' : 'Confirmar Contraseña'}
                        type={showPasswords[field] ? 'text' : 'password'}
                        variant="outlined"
                        value={passwords[field]}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={`toggle ${field} visibility`}
                                        onClick={() => handleTogglePasswordVisibility(field)}
                                    >
                                        {showPasswords[field] ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2, borderColor: '#ddd' },
                        }}
                    />
                ))}
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
