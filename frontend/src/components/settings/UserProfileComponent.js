import React, { useEffect, useState, useContext } from 'react';
import {
    Typography,
    TextField,
    Button,
    Alert,
    Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../../hooks/useAuth';
import { AuthContext } from '../../hooks/AuthContext';

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
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar style={{ backgroundColor: '#1976D2', width: '48px', height: '48px' }}>
                    <PersonIcon />
                </Avatar>
                <Typography variant="h6" component="h2" style={{ marginTop: '8px', fontWeight: 'bold' }}>
                    Perfil de Usuario
                </Typography>
            </div>
            <form noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                <TextField
                    label="Primer Nombre"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <TextField
                    label="Apellido"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <TextField
                    label="Correo Electrónico"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                    style={{ marginTop: '16px' }}
                >
                    Actualizar Perfil
                </Button>
                {localSuccessMessage && (
                    <Alert severity="success" style={{ marginTop: '16px' }}>
                        {localSuccessMessage}
                    </Alert>
                )}
                {localError && (
                    <Alert severity="error" style={{ marginTop: '16px' }}>
                        {localError}
                    </Alert>
                )}
            </form>
        </>
    );
}

export default UserProfileComponent;
