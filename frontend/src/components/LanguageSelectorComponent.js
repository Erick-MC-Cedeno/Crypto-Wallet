import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useState } from 'react';

const useLanguage = () => {
    const [language, setLanguage] = useState('en'); // Idioma por defecto

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        // Aquí puedes añadir lógica para guardar el idioma en la configuración del usuario, por ejemplo en un API.
    };

    return { language, handleLanguageChange };
};

function LanguageSelectorComponent() {
    const { language, handleLanguageChange } = useLanguage();
    const languageOptions = {
        en: 'Inglés',
        es: 'Español',
        fr: 'Francés',
        de: 'Alemán'
    };

    return (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
                Selección de Idioma
            </Typography>
            <FormControl fullWidth variant="outlined">
                <InputLabel id="language-select-label">Idioma</InputLabel>
                <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                    label="Idioma"
                >
                    {Object.entries(languageOptions).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={value} variant="outlined" size="small" />
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default LanguageSelectorComponent;
