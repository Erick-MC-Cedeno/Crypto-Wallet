import React, { useState } from 'react';
import ChangePasswordComponent from './ChangePasswordComponent';
import TwoFactorAuthComponent from './TwoFactorAuthComponent';
import LanguageSelectorComponent from './LanguageSelectorComponent';
import UserProfileComponent from './Userprofile';
import { 
    Box, 
    Paper, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Typography, 
    Divider, 
    useTheme, 
    useMediaQuery 
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { Link } from 'react-router-dom';

function Settings() {
    const [selectedSection, setSelectedSection] = useState('userProfile');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const renderSection = () => {
        switch (selectedSection) {
            case 'userProfile':
                return <UserProfileComponent />;
            case 'changePassword':
                return <ChangePasswordComponent />;
            case 'twoFactorAuth':
                return <TwoFactorAuthComponent />;
            case 'languageSelector':
                return <LanguageSelectorComponent />;
            default:
                return null;
        }
    };

    return (
        <Box 
            sx={{ 
                mt: 4, 
                display: 'flex', 
                minHeight: '80vh', 
                width: '100%', 
                mx: isMobile ? 0 : 'auto'
            }}
        >
            <Paper elevation={6} sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', width: '100%' }}>
                <Box sx={{ width: isMobile ? '100%' : '20%', bgcolor: theme.palette.grey[200] }}>
                    <List>
                        {['userProfile', 'changePassword', 'twoFactorAuth', 'languageSelector'].map((section) => (
                            <ListItem
                                button
                                key={section}
                                onClick={() => setSelectedSection(section)}
                                selected={selectedSection === section}
                                sx={{
                                    bgcolor: selectedSection === section ? theme.palette.primary.light : 'transparent',
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.main,
                                        color: '#FFFFFF',
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    {section === 'userProfile' && <PersonIcon />}
                                    {section === 'changePassword' && <LockIcon />}
                                    {section === 'twoFactorAuth' && <SecurityIcon />}
                                    {section === 'languageSelector' && <LanguageIcon />}
                                </ListItemIcon>
                                {!isMobile && (
                                    <ListItemText
                                        primary={
                                            section === 'userProfile' ? 'Perfil' :
                                            section === 'changePassword' ? 'Contraseña' :
                                            section === 'twoFactorAuth' ? 'Seguridad' :
                                            'Idioma'
                                        }
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            typography: isMobile ? 'body2' : 'body1',
                                        }}
                                    />
                                )}
                            </ListItem>
                        ))}
                        <ListItem
                            button
                            component={Link}
                            to="/"
                            sx={{
                                marginTop: 'auto', 
                                '&:hover': {
                                    bgcolor: theme.palette.primary.main,
                                    color: '#FFFFFF',
                                },
                            }}
                        >
                            <ListItemIcon>
                                <ArrowBackIcon /> 
                            </ListItemIcon>
                            {!isMobile && (
                                <ListItemText
                                    primary="Regresar"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        typography: isMobile ? 'body2' : 'body1',
                                    }}
                                />
                            )}
                        </ListItem>
                    </List>
                </Box>
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Configuración
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {renderSection()}
                </Box>
            </Paper>
        </Box>
    );
}

export default Settings;
