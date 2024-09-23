import React, { useState } from 'react';
import { Typography, Box, Button, TextField, Grid, Link, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AtmIcon from '@mui/icons-material/Atm';
import { useHistory } from 'react-router-dom';
import useAuth from './../hooks/useAuth';

export default function Login() {
    const { loginUser, error } = useAuth();
    const history = useHistory();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        
        try {
            const responseMessage = await loginUser(data);
            if (responseMessage) {
                history.push('/verifytoken');
            }
        } catch (e) {
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
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
                    maxWidth: '500px',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: '0 0 25px rgba(0, 123, 255, 0.6)', 
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'glow 1.5s infinite alternate', 
                }}
            >
                <Box
                    sx={{
                        m: 1,
                        width: 45,
                        height: 50,
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        bgcolor: '#2186EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <AtmIcon sx={{ color: 'white' }} />
                </Box>
                <Typography component="h1" variant="h5">
                    NextCryptoATM
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        mt: 3,
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Correo electrónico"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={!!error}
                        helperText={error ? error : ''}
                        InputProps={{
                            sx: {
                                borderRadius: 2,  
                                border: '1px solid #ddd', 
                            },
                        }}
                        InputLabelProps={{
                            shrink: true, 
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error}
                        helperText={error ? error : ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 2,  
                                border: '1px solid #ddd',  
                            },
                        }}
                        InputLabelProps={{
                            shrink: true, 
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            color: 'white',
                            bgcolor: '#326DEB',
                            '&:hover': {
                                bgcolor: '#326DEB',
                            },
                        }}
                    >
                        Iniciar sesión
                    </Button>
                    <Grid container direction="column" alignItems="center">
                        <Grid item>
                            <Link
                                href="/register"
                                variant="body2"
                                sx={{
                                    mt: 2,
                                    fontSize: '0.875rem',
                                    color: '#326DEB',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: '#1E5BB5',
                                    },
                                }}
                            >
                                No tienes una cuenta? Regístrate
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                href="/forgot-password" 
                                variant="body2"
                                sx={{
                                    mt: 1,
                                    fontSize: '0.875rem',
                                    color: '#326DEB',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: '#1E5BB5',
                                    },
                                }}
                            >
                                Olvidé mi contraseña
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error || 'Ha ocurrido un error al iniciar sesión.'}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}
