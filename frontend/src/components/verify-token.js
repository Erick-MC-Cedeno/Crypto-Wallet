import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, Button, TextField, Grid, Alert, Container, CircularProgress } from '@mui/material';
import AtmIcon from '@mui/icons-material/Atm';
import { useHistory } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

//CAMBIOS 23/09/2024

const VerifyToken = () => {
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const { verifyToken, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [tokenExpired, setTokenExpired] = useState(false); 
    const history = useHistory();
    const isMounted = useRef(true);

    useEffect(() => {
        const savedTime = localStorage.getItem('tokenExpireTime');
        const currentTime = Math.floor(Date.now() / 1000); 

        if (savedTime) {
            const expireTime = parseInt(savedTime, 10);
            const remainingTime = expireTime - currentTime;

            if (remainingTime > 0) {
                setTimeLeft(remainingTime);
            } else {
                localStorage.removeItem('tokenExpireTime'); 
                setTokenExpired(true); 
            }
        } else {
            const expireTime = Math.floor(Date.now() / 1000) + 300; 
            localStorage.setItem('tokenExpireTime', expireTime);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    localStorage.removeItem('tokenExpireTime'); 
                    setTokenExpired(true); 
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            isMounted.current = false;
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (tokenExpired) {
            return; 
        }
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await verifyToken({ userId, token });
            if (isMounted.current) {
                if (response && response.msg === 'Logged in!') {
                    history.push('/');
                }
            }
        } catch (err) {
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    return (
        <Container 
            maxWidth="xs" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginTop: 2 
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: '0 0 25px rgba(0, 123, 255, 0.6)',
                    bgcolor: 'background.paper',
                    border: '1px solid #ddd',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'glow 1.5s infinite alternate'
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
                <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                        mb: 4, 
                        color: 'red', 
                        fontWeight: 600 
                    }}
                >
                    {tokenExpired 
                        ? 'Token expirado, intenta de nuevo.' 
                        : `Token expira en ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')} minutos`}
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
                            disabled={tokenExpired} 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            sx={{ borderRadius: 2 }} 
                            disabled={loading || tokenExpired} 
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={20} sx={{ color: '#074EE7FF' }} />
                                    <Typography sx={{ ml: 1, color: '#074EE7FF', fontSize: '0.875rem' }}>Verificando...</Typography>
                                </Box>
                            ) : (
                                'Verificar'
                            )}
                        </Button>
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                    </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default VerifyToken;
