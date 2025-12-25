// frontend/src/auth/AuthProvider.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) base64 += '=';
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('decodeJwt error', e?.message);
    return null;
  }
}

export default function useAuth() {
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const logoutTimerRef = useRef(null);
  const expiryIntervalRef = useRef(null);
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

  const handleLogout = useCallback(
    (reason = 'manual') => {
      console.debug('handleLogout called', { reason });
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      if (expiryIntervalRef.current) {
        clearInterval(expiryIntervalRef.current);
        expiryIntervalRef.current = null;
      }
      setToken(null);
    },
    [setToken]
  );

  // MAIN: token expiry watcher (setTimeout + fallback interval)
  useEffect(() => {
    // clear any existing timers
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (expiryIntervalRef.current) {
      clearInterval(expiryIntervalRef.current);
      expiryIntervalRef.current = null;
    }

    if (!token) return;

    const payload = decodeJwt(token);
    if (!payload || !payload.exp) {
      // decoding failed or no exp claim — don't assume malicious: log and logout
      console.warn('Token missing exp or failed decode — logging out');
      handleLogout('bad_token');
      return;
    }

    const expiresAtMs = payload.exp * 1000;
    const msUntilExpiry = expiresAtMs - Date.now();

    const bufferMs = 2000;
    const effectiveMs = msUntilExpiry - bufferMs;

    console.debug('Token expiry scheduling', {
      exp: payload.exp,
      expiresAtIso: new Date(expiresAtMs).toISOString(),
      msUntilExpiry,
      bufferMs,
      effectiveMs,
    });

    if (effectiveMs <= 0) {
      // already expired (or within buffer)
      handleLogout('expired_now');
      return;
    }

    // schedule a single timeout — efficient when tab is active
    logoutTimerRef.current = setTimeout(() => {
      console.debug('logoutTimer fired (timeout) — exp reached');
      handleLogout('timeout_expired');
    }, effectiveMs);

    // fallback poll — runs every second and ensures we log out promptly if timeout is throttled
    expiryIntervalRef.current = setInterval(() => {
      if (Date.now() >= expiresAtMs) {
        console.debug('expiryInterval detected expiry');
        handleLogout('interval_expired');
      }
    }, 1000);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      if (expiryIntervalRef.current) {
        clearInterval(expiryIntervalRef.current);
        expiryIntervalRef.current = null;
      }
    };
  }, [token, handleLogout]);

  // axios header sync (keeps default headers in sync)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // axios interceptor: only logout if failing request actually had an Authorization header.
  useEffect(() => {
    // eject previous
    if (interceptorRef.current !== null) {
      axios.interceptors.response.eject(interceptorRef.current);
      interceptorRef.current = null;
    }

    interceptorRef.current = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        // Only trigger automatic logout for requests that included an Authorization header
        const requestHadAuth = !!(
          err?.config?.headers?.Authorization ||
          axios.defaults.headers.common['Authorization']
        );

        if ((status === 401 || status === 403) && requestHadAuth) {
          console.debug(
            'Interceptor detected 401/403 on an authed request — logging out'
          );
          handleLogout('interceptor_401');
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
