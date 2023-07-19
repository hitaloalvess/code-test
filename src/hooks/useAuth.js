
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useModal } from '@/hooks/useModal';
import { api } from '@/services/api';
import { toast } from "react-toastify";
import { AuthContext } from '@/contexts/AuthContext';
import { isTokenValid } from '@/utils/token-validation';

export const useAuth = () => {
  const navigate = useNavigate();

  const { enableModal, disableModal } = useModal();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function getUserData() {
      try {
        const { data: user } = await api.get('/users/me');

        return user;
      } catch {
        return null
      }
    }

    const token = localStorage.getItem('@Microdigo:token');

    if (!token) {
      return;
    }

    if (!isTokenValid(token)) {
      localStorage.removeItem('@Microdigo:token');
      setIsAuthenticated(false);
      setIsLoading(false);

      enableModal({
        typeContent: 'confirmation',
        title: 'Sessão expirada',
        subtitle: 'Sua sessão foi expirada, por favor faça o login novamente!!',
        handleConfirm: () => {
          disableModal();
          navigate('/');
        },
        notRenderCancel: true
      });

      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${JSON.parse(token)}`;

    getUserData()
      .then(data => {
        setUser(data);
        setIsAuthenticated(true);
        setIsLoading(false);
      })

    return navigate('/platform');


  }, []);

  const handleSignIn = async ({ email, password }) => {
    try {

      const { data: { acessToken: token } } = await api.post('/auth/signin', {
        email, password
      });

      localStorage.setItem('@Microdigo:token', JSON.stringify(token));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setIsAuthenticated(true);

      return navigate('/platform');

    } catch (error) {
      toast.error(error.response.data.message);
    }

  }

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('@Microdigo:token');
    api.defaults.headers.Authorization = undefined;

    return navigate('/');
  }


  return {
    user,
    isAuthenticated,
    isLoading,
    handleSignIn,
    handleSignOut
  }
}

export const useContextAuth = () => useContext(AuthContext);
