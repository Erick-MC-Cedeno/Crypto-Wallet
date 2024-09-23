import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert, Grid } from '@mui/material';
import AtmIcon from '@mui/icons-material/Atm';
import useAuth from '../hooks/useAuth';

const VerifyToken = () => {
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const { verifyToken, error } = useAuth();
    const [message, setMessage] = useState('');
    const history = useHistory();
    const isMounted = useRef(true); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await verifyToken({ userId, token });
            if (isMounted.current) { 
                if (response && response.msg === 'Logged in!') {
                    history.push('/');
                } else if (response && response.msg === 'Código de verificación enviado a tu correo electrónico.') {
                    setMessage('¡Verifica tu correo electrónico! Se ha enviado un código de verificación.');
                } else if (response && response.msg === 'Código de verificación inválido.') {
                    setMessage('Código de verificación inválido. Por favor, verifica el código e intenta de nuevo.');
                } else {
                    setMessage('Respuesta inesperada del servidor. Por favor, intenta de nuevo.');
                }
            }
        } catch (err) {
            console.error('Error verifying token:', err.message);
            if (isMounted.current) {
                setMessage('User-Key o Token incorrecto por favor intenta de nuevo.');
            }
        }
    };

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: '0 0 25px rgba(0, 123, 255, 0.6)', // Mejorado
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '1px solid #ddd',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'glow 1.5s infinite alternate' // Animación de resplandor
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Box
                        sx={{
                            width: 45,
                            height: 50,
                            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                            bgcolor: '#2186EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2, 
                        }}
                    >
                        <AtmIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography 
                        component="h1" 
                        variant="h5" 
                        align="center" 
                        sx={{ 
                            mb: 2, 
                            fontFamily: 'Arial, sans-serif', 
                            fontWeight: 600
                        }}
                    >
                        NextCryptoATM
                    </Typography>
                    <Typography 
                        variant="body1" 
                        align="center" 
                        sx={{ 
                            mb: 4, 
                            fontFamily: 'Arial, sans-serif', 
                        }}
                    >
                        Por favor, ingresa tu KEY de usuario y el token que recibiste en el correo electrónico
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="User Key"
                                variant="outlined"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                                margin="normal"
                                autoFocus
                                InputProps={{ 
                                    sx: { 
                                        borderRadius: 2,  
                                        border: '1px solid #ddd'  
                                    } 
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Token"
                                variant="outlined"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                                margin="normal"
                                InputProps={{ 
                                    sx: { 
                                        borderRadius: 2,  
                                        border: '1px solid #ddd'  
                                    } 
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                sx={{ borderRadius: 2 }} 
                            >
                                Verificar
                            </Button>
                        </Grid>
                        {message && (
                            <Grid item xs={12}>
                                <Alert 
                                    severity={message.includes('inválido') ? 'error' : 'info'} 
                                    sx={{ mt: 2 }}
                                >
                                    {message}
                                </Alert>
                            </Grid>
                        )}
                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default VerifyToken;
