/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from "axios";
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { User } from "../interfaces";
import axiosInstance from "../lib/axios";

interface AuthState {
  isLogged: boolean;
  user: User | undefined;
  loading: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface PropsContext {
  children?: ReactNode;
}

async function getSession(signal?: AbortSignal) {
  const { data } = await axiosInstance.get<User>('/login/me', { signal });
  return data;
}

async function loginSession(username: string, password: string, signal?: AbortSignal) {
  const { data } = await axiosInstance.post<User>('/login', { username, password }, { signal });
  return data;
}

export const AuthContext = createContext({} as AuthContextProps);

const initialAuthState: AuthState = {
  isLogged: false,
  user: undefined,
  loading: true
};

export const AuthProvider = ({ children }: PropsContext) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout;

    getSession(controller.signal)
      .then((data) => {
        setAuthState((prev) => ({ ...prev, isLogged: true, user: data }));
      })
      .catch(handleError)
      .finally(() => {
        timeoutId = setTimeout(() => {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }, 1000);
      });

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleError = (error: any) => {
    if (error instanceof AxiosError) {
      if (!error.response) return;
      if (error.response.status === 401) return logout();
    }
    throw error;
  };

  const login = async (username: string, password: string) => {
    const data = await loginSession(username, password);
    localStorage.setItem('token', data.token);
    setAuthState((prev) => ({ ...prev, loading: false, isLogged: true, user: data }));
    navigate('/', { replace: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    setAuthState((prev) => ({ ...prev, isLogged: false, user: undefined }));
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};