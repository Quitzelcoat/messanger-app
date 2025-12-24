import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { decodeJwt } from '../utils/jwt';

export default function useAuth() {
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const logoutTimerRef = useRef(null);
  const interceptorRef = useRef(null);

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
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    setToken(null);
  }, [setToken]);

  // **FIXED: ONLY [token] dependency - runs only when token changes or on mount**
  useEffect(() => {
    // Clear any existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (!token) return;

    const payload = decodeJwt(token);
    if (!payload || !payload.exp) {
      handleLogout();
      return;
    }

    const expiresAtMs = payload.exp * 1000;
    const bufferMs = 5000;
    const msUntilExpiry = expiresAtMs - Date.now() - bufferMs;

    if (msUntilExpiry <= 0) {
      handleLogout();
      return;
    }

    // Set ONE timer that respects your .env JWT_EXPIRES_IN="1min"
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, msUntilExpiry);

    // Cleanup on unmount or token change
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, [token, handleLogout]); // include handleLogout to satisfy React Hooks ESLint rule

  // axios header sync
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // axios interceptor
  useEffect(() => {
    if (interceptorRef.current !== null) {
      axios.interceptors.response.eject(interceptorRef.current);
      interceptorRef.current = null;
    }

    interceptorRef.current = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
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
