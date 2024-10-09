import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../hooks/useAuth'; // Asegúrate de importar tu hook correctamente
import { AuthContext } from '../hooks/AuthContext';

function UserProfileComponent() {
    const { updateUserProfile, error, successMessage } = useAuth();
    const { auth } = useContext(AuthContext);
    
    const [firstName, setFirstName] = useState(auth.firstName || '');
    const [lastName, setLastName] = useState(auth.lastName || '');
    const [email, setEmail] = useState(auth.email || '');
    const [localError, setLocalError] = useState('');
    const [localSuccessMessage, setLocalSuccessMessage] = useState('');

    useEffect(() => {
        if (auth) {
            setFirstName(auth.firstName || '');
            setLastName(auth.lastName || '');
            setEmail(auth.email || '');
        }
    }, [auth]);

    const handleUpdateProfile = async () => {
        setLocalError('');
        setLocalSuccessMessage('');

        if (!firstName || !lastName || !email) {
            setLocalError('Todos los campos son obligatorios.');
            return;
        }

        const body = { firstName, lastName, email };
        await updateUserProfile(body);
    };
    useEffect(() => {
        if (successMessage) {
            setLocalSuccessMessage(successMessage);
        }
        if (error) {
            setLocalError(error);
        }
    }, [successMessage, error]);

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', maxWidth: 400, mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1976D2', width: 48, height: 48 }}>
                    <PersonIcon />
                </Avatar>
                <Typography variant="h6" component="h2" sx={{ mt: 1, fontWeight: 'bold', textAlign: 'center' }}>
                    Perfil de Usuario
                </Typography>
            </Box>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <TextField
                    label="Primer Nombre"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ sx: { borderRadius: 2, borderColor: '#E0E0E0' } }}
                />
                <TextField
                    label="Apellido"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ sx: { borderRadius: 2, borderColor: '#E0E0E0' } }}
                />
                <TextField
                    label="Correo Electrónico"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    InputProps={{ sx: { borderRadius: 2, borderColor: '#E0E0E0' } }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                    sx={{ mt: 2, borderRadius: 2 }}
                >
                    Actualizar Perfil
                </Button>
                {localSuccessMessage && (
                    <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                        {localSuccessMessage}
                    </Alert>
                )}
                {localError && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                        {localError}
                    </Alert>
                )}
            </Box>
        </Paper>
    );
}

export default UserProfileComponent;
