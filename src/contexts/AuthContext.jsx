import { createContext } from "react";
import P from 'prop-types';
import { useAuth } from "../hooks/useAuth";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const {
    person,
    isAuthenticated,
    isLoading,
    searchFormHasEnabled,
    handleSignIn,
    handleSignOut,
    handleUpdatePerson
  } = useAuth();

  return (
    <AuthContext.Provider value={{
      person,
      isAuthenticated,
      isLoading,
      searchFormHasEnabled,
      handleSignIn,
      handleSignOut,
      handleUpdatePerson
    }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}
