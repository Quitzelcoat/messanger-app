import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { decodeJwt } from '../utils/jwt';

export default function useAuth() {
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const logoutTimerRef = useRef(null);
  const interceptorRef = useRef(null);

  // Stable setter used by Login component
  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setTokenState(newToken);
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setTokenState(null);
    }
  }, []);

  const handleLogout = useCallback(() => {
    // clear a scheduled logout (if any)
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    // clear token everywhere
    setToken(null);
  }, [setToken]);

  // ensure axios header mirrors token state
  useEffect(() => {
    if (token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  // schedule automatic logout based on token.exp
  useEffect(() => {
    // clear previous timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (!token) return;

    const payload = decodeJwt(token);
    if (!payload || !payload.exp) {
      // invalid token -> logout
      handleLogout();
      return;
    }

    const expiresAtMs = payload.exp * 1000;
    const bufferMs = 5000; // small buffer to avoid racing expiry
    const msUntilExpiry = expiresAtMs - Date.now() - bufferMs;

    if (msUntilExpiry <= 0) {
      // expired or about to expire -> logout
      handleLogout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, msUntilExpiry);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, [token, handleLogout]);

  // axios interceptor: reactively logout on 401/403
  useEffect(() => {
    // remove old interceptor
    if (interceptorRef.current !== null) {
      axios.interceptors.response.eject(interceptorRef.current);
      interceptorRef.current = null;
    }

    interceptorRef.current = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // server refuses token -> logout
          handleLogout();
        }
        return Promise.reject(err);
      }
    );

    return () => {
      if (interceptorRef.current !== null) {
        axios.interceptors.response.eject(interceptorRef.current);
        interceptorRef.current = null;
      }
    };
  }, [handleLogout]);

  return { token, setToken, handleLogout };
}
