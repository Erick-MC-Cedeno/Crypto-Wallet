import { useState, useEffect } from 'react';
import ProviderService from '../services/providerService';

export default function useProviders() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);

    
    const fetchProviders = async () => {
        setLoading(true);
        try {
            const response = await ProviderService.getAllProviders();
            setProviders(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    
    const findProviderByEmail = async (email) => {
        setLoading(true);
        try {
            const response = await ProviderService.findProviderByEmail(email);
            return response.data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    
    const openChat = async (userEmail, providerEmail) => {
        setLoading(true);
        try {
            const response = await ProviderService.openChat(userEmail, providerEmail);
            setSuccessMessage('Chat abierto exitosamente.');
            return response.data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    
    const sendMessage = async (senderId, chatId, messageContent) => {
        setLoading(true);
        try {
            const response = await ProviderService.sendMessage(senderId, chatId, messageContent);
            setSuccessMessage('Mensaje enviado exitosamente.');
            return response.data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    
    const getMessages = async (chatId) => {
        setLoading(true);
        try {
            const response = await ProviderService.getMessages(chatId);
            setMessages(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchProviders();
    }, []);

    return {
        providers,
        loading,
        error,
        setError, 
        messages,
        successMessage,
        findProviderByEmail,
        openChat,
        sendMessage,
        getMessages,
    };
    
}
