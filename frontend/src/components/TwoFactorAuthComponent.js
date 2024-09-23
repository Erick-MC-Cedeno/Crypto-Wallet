// src/components/TwoFactorAuthComponent.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel, Alert } from '@mui/material';
import useAuth from '../hooks/useAuth';

function TwoFactorAuthComponent() {
    const { enableTwoFactorAuth, disableTwoFactorAuth, successMessage, error, isTwoFactorAuthEnabled } = useAuth();
    
    const [enabled, setEnabled] = useState(isTwoFactorAuthEnabled);

    // Update local state when the authentication status changes
    useEffect(() => {
        setEnabled(isTwoFactorAuthEnabled);
    }, [isTwoFactorAuthEnabled]);

    const handleToggle = async () => {
        try {
            if (enabled) {
                await disableTwoFactorAuth();
            } else {
                await enableTwoFactorAuth();
            }
            // The state will be updated by the useEffect hook when the authentication status changes
        } catch (err) {
            // Handle any errors that occur during the toggle action
            console.error(err);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                TwoFactor AUTH
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Activar la autenticación de dos pasos (2FA) añade una capa adicional de seguridad a tu cuenta. Con 2FA habilitado, incluso si alguien obtiene tu contraseña, necesitará una segunda pieza de información para acceder a tu cuenta, protegiendo así tu información personal.
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={enabled}
                        onChange={handleToggle}
                        color="primary"
                    />
                }
                label={enabled ? 'Habilitado' : 'Deshabilitado'}
            />
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
    );
}

export default TwoFactorAuthComponent;
