
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '@/services/api';
import { toast } from "react-toastify";
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('@Microdigo:user');

    return JSON.parse(user);
  });

  const isAuthenticated = useMemo(() => !!user, [user]);

  const handleSignIn = async ({ email, password }) => {
    try {

      const { data: { acessToken: token, user } } = await api.post('/auth/signin', {
        email, password
      });

      localStorage.setItem('@Microdigo:token', JSON.stringify(token));
      localStorage.setItem('@Microdigo:user', JSON.stringify(user));

      setUser(user);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      return navigate('/platform');

    } catch (error) {
      toast.error(error.response.data.message);
    }

  }

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('@Microdigo:token');
    api.defaults.headers.common.Authorization = undefined;

    return navigate('/');
  }

  useEffect(() => {
    const token = localStorage.getItem('@Microdigo:token');
    api.defaults.headers.common.Authorization = `Bearer ${JSON.parse(token)}`;
  }, [isAuthenticated])

  return {
    user,
    isAuthenticated,
    handleSignIn,
    handleSignOut
  }
}

export const useContextAuth = () => useContext(AuthContext);
