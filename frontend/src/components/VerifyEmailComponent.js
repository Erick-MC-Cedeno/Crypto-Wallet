import React, { useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext'; 
import useAuth from '../hooks/useAuth';
import { Box, Button, Typography, Alert, Container } from '@mui/material';

const VerifyEmailComponent = () => {
    const { auth } = useContext(AuthContext); 
    const { sendVerificationEmail, error, successMessage } = useAuth(); 

    const handleSendVerificationEmail = () => {
        if (auth && auth.email) {
            sendVerificationEmail(auth.email); 
        }
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', paddingTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                Verificar Correo Electrónico
            </Typography>
            <Typography variant="body1" gutterBottom>
                Se enviará un correo de verificación a: <strong>{auth.email}</strong>
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSendVerificationEmail}
                sx={{ mt: 3, padding: '10px 20px', fontSize: '16px' }}
            >
                Enviar Correo de Verificación
            </Button>
            <Box sx={{ mt: 3 }}>
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default VerifyEmailComponent;
