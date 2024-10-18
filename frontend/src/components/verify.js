import React, { useContext, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import User from '../services/user';
import { Button, Typography, Dialog, DialogTitle, DialogContent, Box, Paper } from '@mui/material';

const EmailVerificationComponent = () => {
    const { auth } = useContext(AuthContext);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [showCloseMessage, setShowCloseMessage] = useState(false);

    const verifyEmail = async (email) => {
        try {
            const { data } = await User.verifyEmail({ email });
            if (data && data.message === 'Correo electrónico verificado con éxito.') {
                handleVerificationResult({ verified: true, message: `✔️ ${data.message}` });
            } else {
                handleVerificationResult({ verified: false, message: data.error || 'Error al verificar el correo electrónico.' });
            }
        } catch (err) {
            handleVerificationResult({ verified: false, message: err.message });
        }
    };

    const handleVerifyClick = () => {
        if (auth && auth.email) {
            verifyEmail(auth.email);
        } else {
            handleVerificationResult({ verified: false, message: 'No se encontró el correo electrónico autenticado.' });
        }
    };

    const handleVerificationResult = (result) => {
        setDialogMessage(result.message);
        setOpenDialog(true);
        setShowCloseMessage(false); 

        if (result.verified) {
            setTimeout(() => {
                setOpenDialog(false);
                setShowCloseMessage(true); 
            }, 5000); 
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setShowCloseMessage(true);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: '#f6f8fa', 
                padding: 3,
                textAlign: 'center',
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 400, width: '100%', backgroundColor: 'white' }}>
                {!showCloseMessage ? (
                    <>
                        <Typography variant="h4" gutterBottom sx={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                            Verificar Correo Electrónico
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleVerifyClick}
                            sx={{ mt: 3, fontSize: '1.2rem', padding: '10px 20px', backgroundColor: '#0366d6', '&:hover': { backgroundColor: '#005cc5' } }} // Colores de GitHub
                        >
                            Enviar Correo de Verificación
                        </Button>

                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            PaperProps={{
                                sx: {
                                    padding: 3,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                },
                            }}
                        >
                            <DialogTitle>Estado de Verificación</DialogTitle>
                            <DialogContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography variant="body1" sx={{ mt: 2, color: '#333' }}>
                                    {dialogMessage}
                                </Typography>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontSize: '1.1rem' }}>
                        Puedes cerrar esta ventana.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default EmailVerificationComponent;
