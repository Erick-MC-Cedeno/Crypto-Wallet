import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import { AuthContext } from '../hooks/AuthContext';
import User from '../services/user';
import { Button, Typography, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';

const EmailVerificationComponent = () => {
    const { auth } = useContext(AuthContext);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const history = useHistory(); 

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

        if (result.verified) {
            setTimeout(() => {
                setOpenDialog(false);
                history.push('/settings'); 
            }, 2000);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: 'background.default',
                padding: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Verificar Correo Electrónico
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleVerifyClick}
                sx={{ mt: 3, fontSize: '1rem', padding: '10px 20px' }}
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
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {dialogMessage}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default EmailVerificationComponent;
