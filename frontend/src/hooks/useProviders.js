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
            console.log(`Sending message as provider: ${providerEmail}, chatId: ${chatId}, content: ${messageContent}`);
            const response = await ProviderService.sendMessageAsProvider(providerEmail, chatId, messageContent);
            setSuccessMessage('Mensaje enviado exitosamente.');
            console.log('Message sent successfully:', response.data);
            return response.data;
        } catch (err) {
            console.error('Error sending message as provider:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
      
      const getChatDetailsByEmail = async (email) => {
        setLoading(true);
        try {
          const response = await ProviderService.getChatDetailsByEmail(email);
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
        successMessage,
        findProviderByEmail,
        openChat,
        sendMessage,
        sendMessageAsProvider,
        getChatDetailsByEmail,
        getMessages,
    };
}