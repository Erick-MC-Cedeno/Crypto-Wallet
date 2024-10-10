import { useState, useEffect, useCallback } from 'react';
import Transaction from '../services/transaction';

export default function useTransitions(coin) {
    const [transactions, setTransactions] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(0);

    // Define getTransactions using useCallback to memoize it
    const getTransactions = useCallback(async () => {
        try {
            let { data } = coin 
                ? await Transaction.getCoinTransactions(coin) 
                : await Transaction.getAllTransactions();

            if (data) {
                setTransactions(data);
            }
        } catch (err) {
        }
    }, [coin]);

    const getTotalTransactions = useCallback(async () => {
    try {
        const { data } = await Transaction.getTotalTransactions(); 
        if (data) {
            setTotalTransactions(data.totalCount); 
        }
    } catch (err) {
        console.error('Error fetching total transactions:', err); 
    }
}, []);

useEffect(() => {
    getTotalTransactions();
}, [getTotalTransactions]);


    return {
        transactions,
        totalTransactions, 
        getTransactions
    };
}
