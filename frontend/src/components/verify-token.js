import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, Button, TextField, Grid, Alert, Container, CircularProgress } from '@mui/material';
import AtmIcon from '@mui/icons-material/Atm';
import { useHistory } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const VerifyToken = () => {
    const [formValues, setFormValues] = useState({ userId: '', token: '' });
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

            remainingTime > 0 ? setTimeLeft(remainingTime) : handleTokenExpiration();
        } else {
            localStorage.setItem('tokenExpireTime', Math.floor(Date.now() / 1000) + 300);
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleTokenExpiration();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            isMounted.current = false; // Clean up the mounted state
        };
    }, []);

    const handleTokenExpiration = () => {
        localStorage.removeItem('tokenExpireTime');
        setTokenExpired(true);
    };

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (tokenExpired) return;

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await verifyToken(formValues);
            if (isMounted.current && response?.msg === 'Logged in!') {
                history.push('/');
            }
        } catch (err) {
            // Handle error if needed
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
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
                <Typography component="h1" variant="h5" align="center" sx={{ mb: 2, fontFamily: 'Arial, sans-serif', fontWeight: 600 }}>
                    NextCryptoATM
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 4, fontFamily: 'Arial, sans-serif' }}>
                    Por favor, ingresa tu KEY de usuario y el token que recibiste en el correo electrónico
                </Typography>
                <Typography variant="body2" align="center" sx={{ mb: 4, color: 'red', fontWeight: 600 }}>
                    {tokenExpired 
                        ? 'Token expirado, intenta de nuevo.' 
                        : `Token expira en ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')} minutos`}
                </Typography>
                <Grid container spacing={2}>
                    {['userId', 'token'].map((field, index) => (
                        <Grid item xs={12} key={index}>
                            <TextField
                                fullWidth
                                label={field === 'userId' ? 'User Key' : 'Token'}
                                variant="outlined"
                                name={field}
                                value={formValues[field]}
                                onChange={handleChange}
                                required
                                margin="normal"
                                autoFocus={field === 'userId'}
                                InputProps={{ sx: { borderRadius: 2, border: '1px solid #ddd' } }}
                                disabled={field === 'token' && tokenExpired}
                            />
                        </Grid>
                    ))}
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
                            ) : 'Verificar'}
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
