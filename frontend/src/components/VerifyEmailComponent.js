import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Alert, Typography, CircularProgress, Button, Snackbar } from '@mui/material'; 
import { AuthContext } from '../hooks/AuthContext'; 
import useAuth from '../hooks/useAuth'; 
import MuiAlert from '@mui/material/Alert';

const VerifyEmailComponent = () => {
    const { auth } = useContext(AuthContext); 
    const { sendVerificationEmail, isEmailVerified, error } = useAuth(); 

    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [localError, setLocalError] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [hasCheckedVerification, setHasCheckedVerification] = useState(false); 
    const [sending, setSending] = useState(false); 
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        const checkEmailVerification = async () => {
            setLocalError(null); 
            try {
                const isVerified = await isEmailVerified(); 

                if (isVerified) {
                    setVerificationStatus({
                        verified: true,
                        message: 'Correo electrónico verificado',
                    });
                    setEmailVerified(true);
                } else {
                    setVerificationStatus({
                        verified: false,
                        message: 'El correo electrónico no está verificado.',
                    });
                    setEmailVerified(false);
                }
            } catch (err) {
                setLocalError(err.message || 'Error al verificar el correo.');
                setVerificationStatus(null); 
            } finally {
                setLoading(false); 
                setHasCheckedVerification(true); 
            }
        };

        if (auth && auth.email && !hasCheckedVerification) {
            checkEmailVerification(); 
        } else if (!auth || !auth.email) {
            setLocalError('No se ha encontrado un correo electrónico autenticado.');
            setLoading(false); 
        }
    }, [auth, isEmailVerified, hasCheckedVerification]); 

    const handleSendVerificationEmail = async () => {
        if (auth && auth.email) {
            setSending(true); 
            try {
                await sendVerificationEmail(auth.email);
                setSnackbar({ open: true, message: "Correo de verificación enviado.", severity: "success" });
            } catch (error) {
                setLocalError(error.message || 'Error al enviar el correo de verificación.');
                setSnackbar({ open: true, message: localError, severity: "error" });
            } finally {
                setSending(false); 
            }
        }
    };

    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(handleCloseSnackbar, 4000);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open, handleCloseSnackbar]);

    return (
        <>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    fontWeight: 'bold', 
                    color: '#333', 
                    textAlign: 'center', 
                    padding: 2,
                    fontSize: { xs: '1.5rem', sm: '2rem' } 
                }}
            >
                Verificar Correo Electrónico
            </Typography>
            <Typography 
                variant="body1" 
                gutterBottom 
                sx={{ 
                    color: '#555', 
                    textAlign: 'center', 
                    maxWidth: '400px', 
                    margin: '0 auto', 
                    fontSize: { xs: '0.9rem', sm: '1rem' } 
                }}
            >
                Correo electrónico autenticado: <strong>{auth?.email || 'Correo no disponible'}</strong>
            </Typography>
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: '20px auto', color: '#1976d2' }} />
            ) : (
                <>
                    {localError && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mt: 3, 
                                borderRadius: '8px', 
                                backgroundColor: '#f44336', 
                                color: '#fff', 
                                fontWeight: 'bold', 
                                textAlign: 'center', 
                                maxWidth: '400px', 
                                margin: '0 auto' 
                            }}
                        >
                            {localError}
                        </Alert>
                    )}
                    {verificationStatus && (
                        <Alert 
                            severity={verificationStatus.verified ? 'success' : 'warning'} 
                            sx={{ 
                                mt: 3, 
                                borderRadius: '8px', 
                                backgroundColor: verificationStatus.verified ? '#4caf50' : '#ff9800', 
                                color: '#fff', 
                                fontWeight: 'bold', 
                                textAlign: 'center', 
                                maxWidth: '400px', 
                                margin: '0 auto' 
                            }}
                        >
                            {verificationStatus.message}
                        </Alert>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendVerificationEmail}
                        disabled={emailVerified || sending} 
                        sx={{ 
                            display: 'block', 
                            margin: '20px auto', 
                            padding: '10px 20px', 
                            fontSize: { xs: '14px', sm: '16px' }, 
                            borderRadius: '20px', 
                            maxWidth: '200px' 
                        }}
                    >
                        {sending ? <CircularProgress size={24} color="inherit" /> : (emailVerified ? 'Verificado' : 'Enviar Correo')}
                    </Button>
                </>
            )}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 2, 
                        borderRadius: '8px', 
                        backgroundColor: '#f44336', 
                        color: '#fff', 
                        fontWeight: 'bold', 
                        textAlign: 'center', 
                        maxWidth: '400px', 
                        margin: '0 auto' 
                    }}
                >
                    {error}
                </Alert>
            )}
        </>
    );
};

export default VerifyEmailComponent;
