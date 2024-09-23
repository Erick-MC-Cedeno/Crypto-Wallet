import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';

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
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
                Perfil de Usuario
            </Typography>
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
                />
                <TextField
                    label="Apellido"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Correo Electrónico"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                    sx={{ mt: 2 }}
                >
                    Actualizar Perfil
                </Button>
                {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Box>
        </Paper>
    );
}

export default UserProfileComponent;
