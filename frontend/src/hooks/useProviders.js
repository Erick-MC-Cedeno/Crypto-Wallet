import { useState, useEffect } from 'react';
import ProviderService from '../services/providerService';

export default function useProviders() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProviders() {
            try {
                const response = await ProviderService.getAllProviders();
                setProviders(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchProviders();
    }, []);

    return { providers, loading, error };
}
