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
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.createProvider(body);
            if (data) {
                setSuccessMessage('Provider creado con éxito.');
            } else {
                setError('Error al crear el provider.');
            }
        } catch (err) {
            setError(`Error al crear el provider: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getAllProviders = async () => {
        clearError();
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.getAllProviders();
            setSuccessMessage('Providers obtenidos con éxito.');
            return data;
        } catch (err) {
            setError(`Error al obtener todos los providers: ${err.message}`);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const findProviderByEmail = async (email) => {
        clearError();
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.findProviderByEmail(email);
            setSuccessMessage('Provider encontrado con éxito.');
            return data;
        } catch (err) {
            setError(`Error al encontrar el provider por email: ${err.message}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const openChat = async (body) => {
        clearError();
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.openChat(body);
            setSuccessMessage('Chat abierto con éxito.');
            return data;
        } catch (err) {
            setError(`Error al abrir el chat: ${err.message}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (body) => {
        clearError();
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.sendMessage(body);
            setSuccessMessage('Mensaje enviado con éxito.');
            return data;
        } catch (err) {
            setError(`Error al enviar el mensaje: ${err.message}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    };



    
const sendMessageAsProvider = async (body) => {
    clearError();
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.sendMessageAsProvider(body);
            setSuccessMessage('Mensaje enviado como provider con éxito.');
            return data;
        } catch (err) {
            setError(`Error al enviar el mensaje como provider: ${err.message}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const getMessages = async (chatId) => {
        clearError();
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.getMessages(chatId);
            setSuccessMessage('Mensajes obtenidos con éxito.');
            return data;
        } catch (err) {
            setError(`Error al obtener los mensajes: ${err.message}`);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const getChatDetailsByEmail = async (email) => {
        clearError();
        clearSuccessMessage();
        setIsLoading(true);
        try {
            const { data } = await Provider.getChatDetailsByEmail(email);
            setSuccessMessage('Detalles del chat obtenidos con éxito.');
            return data;
        } catch (err) {
            setError(`Error al obtener los detalles del chat por email: ${err.message}`);
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