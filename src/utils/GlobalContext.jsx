import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

function GlobalProvider({ children }) {
  const [userRole, setUserRole] = useState("");

  const updateGlobalValue = (role) => {
    setUserRole(role);
  };

  return (
    <GlobalContext.Provider value={{ userRole, updateGlobalValue }}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
