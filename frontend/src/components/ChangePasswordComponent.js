import React, { useState } from 'react';
import {
    TextField,
    Button,
    Alert,
    Typography,
    InputAdornment,
    IconButton,
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
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar style={{ backgroundColor: '#1976D2', width: '48px', height: '48px' }}>
                    <LockIcon />
                </Avatar>
                <Typography variant="h6" component="h2" style={{ marginTop: '8px', fontWeight: 'bold' }}>
                    Cambiar Contraseña
                </Typography>
            </div>
            <form noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '420px', margin: '0 auto' }}>
                {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field) => (
                    <TextField
                        key={field}
                        name={field}
                        label={field === 'currentPassword' ? 'Contraseña Actual' : field === 'newPassword' ? 'Nueva Contraseña' : 'Confirmar Contraseña'}
                        type={showPasswords[field] ? 'text' : 'password'}
                        variant="outlined"
                        value={passwords[field]}
                        onChange={handleChange}
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
                        }}
                    />
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleChangePassword}
                    style={{ marginTop: '16px' }}
                >
                    Cambiar Contraseña
                </Button>
                {successMessage && <Alert severity="success" style={{ marginTop: '16px' }}>{successMessage}</Alert>}
                {error && <Alert severity="error" style={{ marginTop: '16px' }}>{error}</Alert>}
            </form>
        </>
    );
}

export default ChangePasswordComponent;
