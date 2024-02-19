
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getProfile, signIn } from '@/api/http';
import { apiAuth } from '@/lib/axios';
import { toast } from "react-toastify";
import { AuthContext } from '@/contexts/AuthContext';
// import { apiMicrocode } from '../lib/axios';
// import { useModal } from '@/hooks/useModal';


// const TIME_ACTIVATE_SEARCH_FORM = 7 * 60 * 1000; //7m
export const useAuth = () => {
  const navigate = useNavigate();
  // const { enableModal, disableModal } = useModal();

  const isFirstRender = useRef(true);
  const idSearchFormTimeout = useRef(null);

  const [person, setPerson] = useState(() => {
    const person = localStorage.getItem('@Microdigo:person');

    return JSON.parse(person);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchFormHasEnabled /*, setSearchFormHasEnabled*/] = useState(true);
  const isAuthenticated = useMemo(() => !!person, [person]);

  const handleGetProfile = async () => {
    const { person } = await getProfile();

    setPerson(person);

    return person;
  }

  const handleSignIn = async ({ email, password }) => {
    try {

      setIsLoading(true);

      const { token } = await signIn({ email, password });

      localStorage.setItem('@Microdigo:token', JSON.stringify(token));

      const person = await handleGetProfile();
      localStorage.setItem('@Microdigo:person', JSON.stringify(person));

      setIsLoading(false);

      navigate('/projetos');

    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);

    }

  }

  const handleSignOut = (event) => {
    if (event) event.preventDefault();

    setPerson(null);

    apiAuth.defaults.headers.common.Authorization = undefined;
    clearTimeout(idSearchFormTimeout.current);

    localStorage.removeItem('@Microdigo:token');
    localStorage.removeItem('@Microdigo:person');

    window.location.href = "/";
  }

  // const handleSearchForm = () => {
  //   enableModal({
  //     typeContent: 'search-form',
  //     handleConfirm: () => {
  //       disableModal('search-form');
  //     }
  //   });

  //   setSearchFormHasEnabled(true);
  // }
  const handleUpdatePerson = (person) => {

    setPerson(person);
    localStorage.setItem('@Microdigo:person', JSON.stringify(person));
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    const token = localStorage.getItem('@Microdigo:token');

    if (token) {

      try {
        handleGetProfile().catch(error => console.log(error));
      } catch (error) {
        toast.error(error?.message);
      }

    }
  }, [])

  return {
    person,
    isAuthenticated,
    searchFormHasEnabled,
    isLoading,
    handleSignIn,
    handleSignOut,
    handleUpdatePerson
  }
}

export const useContextAuth = () => useContext(AuthContext);
