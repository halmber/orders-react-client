import React, { createContext } from 'react';
import { useSelector } from 'react-redux';

export const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const user = useSelector(({ user }) => user);
  return (
    <UserContext.Provider
      value={{
        email: user.email,
        fullName: user.fullName,
        id: user.id,
        login: user.login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
