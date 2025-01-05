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

    const createProvider = async (body) => {
        setLoading(true);
        try {
            const response = await ProviderService.createProvider(body);
            setSuccessMessage('Proveedor creado exitosamente.');
            return response.data;
        } catch (err) {
            setError(err);
            console.error('Error creating provider:', err);
        } finally {
            setLoading(false);
        }
    };

    const findProviderByEmail = async (email) => {
        setLoading(true);
        try {
            const response = await ProviderService.findProviderByEmail(email);
            if (!response.data) {
                throw new Error("No hay proveedores");
            }
            return response.data;
        } catch (err) {
            if (err.response && err.response.status === 500) {
                setError("Error del servidor. Por favor, inténtelo de nuevo más tarde.");
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    const openChat = async (userEmail, providerEmail) => {
        setLoading(true);
        try {
            console.log('Opening chat with:', { userEmail, providerEmail });
            const response = await ProviderService.openChat(userEmail, providerEmail);
            setSuccessMessage('Chat abierto exitosamente.');
            localStorage.setItem('chatData', JSON.stringify(response.data));
            return response.data;
        } catch (err) {
            setError(err);
            console.error('Error opening chat:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (senderEmail, chatId, messageContent) => {
        setLoading(true);
        try {
            const response = await ProviderService.sendMessage(senderEmail, chatId, messageContent);
            setSuccessMessage('Mensaje enviado exitosamente.');
            return response.data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessageAsProvider = async (providerEmail, chatId, messageContent) => {
        setLoading(true);
        try {
            const response = await ProviderService.sendMessageAsProvider(providerEmail, chatId, messageContent);
            setSuccessMessage('Mensaje enviado exitosamente.');
            return response.data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const getChatDetailsByEmail = async (email) => {
        setLoading(true);
        try {
            const response = await ProviderService.getChatDetailsByEmail(email);
            if (response.data && response.data.length === 0) {
                setError('No chats found for this user');
                return [];
            }
            return response.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError(`User with email ${email} not found`);
            } else {
                setError(err.message || 'Error fetching chat details');
            }
            console.error('Error fetching chat details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMessages = async (chatId) => {
        setLoading(true);
        try {
            const response = await ProviderService.getMessages(chatId);
            setMessages(response.data);
            return response.data;
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
        setMessages,
        successMessage,
        findProviderByEmail,
        openChat,
        sendMessage,
        sendMessageAsProvider,
        getChatDetailsByEmail,
        getMessages,
        createProvider,
    };
}