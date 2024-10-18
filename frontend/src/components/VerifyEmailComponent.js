import React, { useContext, useState, useEffect } from 'react';
import { Alert, Typography, CircularProgress, Container, Button, Box } from '@mui/material'; 
import { AuthContext } from '../hooks/AuthContext'; 
import useAuth from '../hooks/useAuth'; 

const VerifyEmailComponent = () => {
    const { auth } = useContext(AuthContext); 
    const { sendVerificationEmail, isEmailVerified, error, successMessage } = useAuth(); 

    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [localError, setLocalError] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [hasCheckedVerification, setHasCheckedVerification] = useState(false);
    const [sending, setSending] = useState(false); 

    useEffect(() => {
        const checkEmailVerification = async () => {
            setLocalError(null); 
            try {
                const isVerified = await isEmailVerified(); 

                if (isVerified) {
                    setVerificationStatus({
                        verified: true,
                        message: 'Correo electrónico verificado con éxito.',
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
            } catch (error) {
                setLocalError(error.message || 'Error al enviar el correo de verificación.');
            } finally {
                setSending(false); 
            }
        }
    };

    return (
        <>
            <Container maxWidth="md" sx={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Verificar Correo Electrónico
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: '#555' }}>
                    Correo electrónico autenticado: <strong>{auth?.email || 'Correo no disponible'}</strong>
                </Typography>
                {loading ? (
                    <CircularProgress sx={{ mt: 3, color: '#1976d2' }} />
                ) : (
                    <>
                        <Box sx={{ maxWidth: '400px', margin: '0 auto' }}>
                            {localError && (
                                <Alert severity="error" sx={{ mt: 3, borderRadius: '8px', backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold' }}>
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
                                        fontWeight: 'bold' 
                                    }}
                                >
                                    {verificationStatus.message}
                                </Alert>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendVerificationEmail}
                            disabled={emailVerified || sending} 
                            sx={{ mt: 3, padding: '10px 20px', fontSize: '16px', borderRadius: '20px' }}
                        >
                            {sending ? <CircularProgress size={24} color="inherit" /> : (emailVerified ? 'Correo Verificado' : 'Enviar Correo de Verificación')}
                        </Button>
                    </>
                )}
            </Container>
            <Box sx={{ maxWidth: '400px', margin: '20px auto' }}>
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold' }}>
                        {successMessage}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold' }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </>
    );
};

export default VerifyEmailComponent;
