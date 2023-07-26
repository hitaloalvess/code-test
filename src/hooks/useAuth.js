
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '@/services/api';
import { toast } from "react-toastify";
import { AuthContext } from '@/contexts/AuthContext';
import { useModal } from '@/hooks/useModal';


const TIME_ACTIVATE_SEARCH_FORM = 7 * 60 * 1000; //7m
export const useAuth = () => {
  const navigate = useNavigate();
  const { enableModal, disableModal } = useModal();

  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('@Microdigo:user');

    return JSON.parse(user);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchFormHasEnabled, setSearchFormHasEnabled] = useState(false);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const handleSignIn = async ({ email, password }) => {
    try {

      setIsLoading(true);

      const { data: { acessToken: token, user } } = await api.post('/auth/signin', {
        email, password
      });

      localStorage.setItem('@Microdigo:token', JSON.stringify(token));
      localStorage.setItem('@Microdigo:user', JSON.stringify(user));

      setUser(user);
      setIsLoading(false);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      return navigate('/platform');

    } catch (error) {
      toast.error(error.response.data.message);
    }

  }

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('@Microdigo:token');
    localStorage.removeItem('@Microdigo:user');

    api.defaults.headers.common.Authorization = undefined;

    return navigate('/');
  }

  const handleSearchForm = () => {
    enableModal({
      typeContent: 'search-form',
      handleConfirm: () => {
        disableModal();
      }
    });

    setSearchFormHasEnabled(true);
  }

  useEffect(() => {
    const token = localStorage.getItem('@Microdigo:token');
    api.defaults.headers.common.Authorization = `Bearer ${JSON.parse(token)}`;

    setTimeout(handleSearchForm, TIME_ACTIVATE_SEARCH_FORM);

  }, [isAuthenticated]);

  return {
    user,
    isAuthenticated,
    searchFormHasEnabled,
    isLoading,
    handleSignIn,
    handleSignOut,
  }
}

export const useContextAuth = () => useContext(AuthContext);
