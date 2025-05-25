// UserBalance.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserBalance = ({ setBalance }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('');
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/users/userbalance`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch balance');
        }

        const data = await response.json();
        if (data.message === 'Success') {
          setBalance(data.balance);
        } else {
          throw new Error(data.message || 'Failed to fetch balance');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching balance');
      }
    };

    fetchBalance();
  }, [setBalance, navigate]);

  return error ? (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
      {error}
    </div>
  ) : null;
};

export default UserBalance;