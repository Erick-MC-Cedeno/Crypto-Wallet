import { useState } from 'react';
import Provider from '../services/providerService';

export default function useProvider() {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const clearError = () => setError(null);
    const clearSuccessMessage = () => setSuccessMessage(null);

    const createProvider = async (body) => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.createProvider(body);
            if (data) {
                setSuccessMessage('Provider creado con éxito.');
            } else {
                setError('Error al crear el provider.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getAllProviders = async () => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.getAllProviders();
            return data;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const findProviderByEmail = async (email) => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.findProviderByEmail(email);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const openChat = async (body) => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.openChat(body);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (body) => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.sendMessage(body);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessageAsProvider = async (body) => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.sendMessageAsProvider(body);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const getMessages = async (chatId) => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.getMessages(chatId);
            return data;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const getChatDetailsByEmail = async (email) => {
        clearError();
        setIsLoading(true);
        try {
            const { data } = await Provider.getChatDetailsByEmail(email);
            return data;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createProvider,
        getAllProviders,
        findProviderByEmail,
        openChat,
        sendMessage,
        sendMessageAsProvider,
        getMessages,
        getChatDetailsByEmail,
        error,
        successMessage,
        isLoading,
        clearError,
        clearSuccessMessage
    };
}
