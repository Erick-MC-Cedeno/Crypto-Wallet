import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n'; 

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('es'); 

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
            i18n.changeLanguage(savedLanguage); 
        } else {
            localStorage.setItem('language', 'es'); 
            i18n.changeLanguage('es');
        }
    }, []);

    const handleLanguageChange = (lng) => {
        setLanguage(lng);
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng); 
    };

    return (
        <LanguageContext.Provider value={{ language, handleLanguageChange }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
