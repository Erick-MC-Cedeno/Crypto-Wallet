import { useState, useEffect, useCallback } from 'react';
import Transaction from '../services/transaction';

export default function useTransitions(coin) {
    const [transactions, setTransactions] = useState([]);

    // Define getTransactions using useCallback to memoize it
    const getTransactions = useCallback(async () => {
        try {
            let { data } = coin ? await Transaction.getCoinTransactions(coin)
                : await Transaction.getAllTransactions();

            if (data) {
                setTransactions(data);
            }
        } catch (err) {
            
        }
    }, [coin]); 

    useEffect(() => {
        getTransactions();
    }, [getTransactions]); 

    return {
        transactions,
        getTransactions
    };
}
