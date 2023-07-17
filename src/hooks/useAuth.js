
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { api } from '@/services/api';
import { toast } from "react-toastify";
import { AuthContext } from '../contexts/AuthContext';

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);

    console.log(decodedToken);

    return true;
  } catch (error) {
    return false;
  }


}

export const useAuth = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function getUserData() {
      const { data: user } = await api.get('/users/me');

      return user;
    }

    const token = localStorage.getItem('@Microdigo:token');

    if (token && isTokenValid(token)) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;

      getUserData().then(data => setUser(data))
      setIsAuthenticated(true);

      return navigate('/platform');

    } else {
      localStorage.removeItem('@Microdigo:token');
    }

    setIsLoading(false);

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
