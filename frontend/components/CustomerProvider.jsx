'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearCustomer,
  customerApi,
  getCustomerToken,
  getStoredCustomer,
  storeCustomer,
} from '@/lib/customerApi';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getCustomerToken();
    if (!token) {
      setReady(true);
      return;
    }
    setCustomer(getStoredCustomer());
    customerApi('/customer/me')
      .then((data) => {
        setCustomer(data);
        storeCustomer(token, data);
      })
      .catch((err) => {
        if (err.status === 401 || err.status === 403) {
          clearCustomer();
          setCustomer(null);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async ({ phone, password }) => {
    const data = await customerApi('/customer/login', {
      method: 'POST',
      body: { phone, password },
    });
    storeCustomer(data.token, data.customer);
    setCustomer(data.customer);
    return data;
  }, []);

  const register = useCallback(async ({ name, phone, password, email }) => {
    const data = await customerApi('/customer/register', {
      method: 'POST',
      body: { name, phone, password, email },
    });
    storeCustomer(data.token, data.customer);
    setCustomer(data.customer);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearCustomer();
    setCustomer(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await customerApi('/customer/me');
      setCustomer(data);
      const token = getCustomerToken();
      if (token) storeCustomer(token, data);
      return data;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({ customer, ready, login, register, logout, refresh, isLoggedIn: Boolean(customer) }),
    [customer, ready, login, register, logout, refresh]
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used inside CustomerProvider');
  return ctx;
}
