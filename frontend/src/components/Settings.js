import React from 'react';
import ChangePasswordComponent from './ChangePasswordComponent';
import TwoFactorAuthComponent from './TwoFactorAuthComponent';
import LanguageSelectorComponent from './LanguageSelectorComponent';
import UserProfileComponent from './Userprofile'; // Asegúrate de que este sea el nombre correcto
import { Container, Typography, Box, Divider, Paper, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';

function Settings() {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: '#F7F9FA', 
                    color: '#1C1E21', 
                    borderRadius: 2,
                    boxShadow: 'none', 
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Configuración de la Cuenta
                </Typography>

                <Paper
                    elevation={0} 
                    sx={{
                        mb: 4,
                        p: 3,
                        bgcolor: '#FFFFFF', 
                        borderRadius: 1,
                        border: '1px solid #E0E0E0', 
                        boxShadow: 'none', 
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton color="primary" sx={{ p: 1 }}>
                            <LockIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" fontWeight={600}>
                            Cambiar Contraseña
                        </Typography>
                    </Box>
                    <ChangePasswordComponent />
                </Paper>

                <Divider sx={{ mb: 4, borderColor: '#E0E0E0' }} />

                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: 3,
                        bgcolor: '#FFFFFF',
                        borderRadius: 1,
                        border: '1px solid #E0E0E0',
                        boxShadow: 'none',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton color="primary" sx={{ p: 1 }}>
                            <PersonIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" fontWeight={600}>
                            Perfil de Usuario
                        </Typography>
                    </Box>
                    <UserProfileComponent />
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: 3,
                        bgcolor: '#FFFFFF',
                        borderRadius: 1,
                        border: '1px solid #E0E0E0',
                        boxShadow: 'none',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton color="primary" sx={{ p: 1 }}>
                            <SecurityIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" fontWeight={600}>
                            Seguridad de la cuenta
                        </Typography>
                    </Box>
                    <TwoFactorAuthComponent />
                </Paper>

                <Divider sx={{ mb: 4, borderColor: '#E0E0E0' }} />

                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: 3,
                        bgcolor: '#FFFFFF',
                        borderRadius: 1,
                        border: '1px solid #E0E0E0',
                        boxShadow: 'none',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton color="primary" sx={{ p: 1 }}>
                            <LanguageIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" fontWeight={600}>
                            Selección de Idioma
                        </Typography>
                    </Box>
                    <LanguageSelectorComponent />
                </Paper>

            </Box>
        </Container>
    );
}

export default Settings;
