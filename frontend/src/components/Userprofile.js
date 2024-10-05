import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function UserProfileComponent() {
    // Simulación de datos del usuario
    const [user, setUser] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
    });

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);

    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdateProfile = () => {
        if (!firstName || !lastName || !email) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Simulación de una llamada API para actualizar el perfil
        setTimeout(() => {
            setUser({ firstName, lastName, email });
            setSuccessMessage('Perfil actualizado correctamente.');
            setError('');
        }, 500);
    };

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
                {successMessage && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{successMessage}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
            </Box>
        </Paper>
    );
}

export default UserProfileComponent;
