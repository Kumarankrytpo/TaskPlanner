import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

function GlobalProvider({ children }) {
  const [userRole, setUserRole] = useState("");

  const updateGlobalValue = (role) => {
    setUserRole(role);
  };

  const [userName, setUserName] = useState("");

  const updateUserName = (usrname) => {
    setUserName(usrname);
  };


  const [empCode, setempCode] = useState("");

  const updateempCode = (empcode) => {
    setempCode(empcode);
  };


  const [userid, setUserId] = useState();

  const updateUserId = (userid) => {
    setUserId(userid);
  };

  const [emailid,setEmailid] = useState("");

  const updatemailid = (emailid)=>{
    setEmailid(emailid);
  }

  return (
    <GlobalContext.Provider value={{ userRole, updateGlobalValue ,userName,setUserName,
    empCode,updateempCode,userid,updateUserId,emailid,updatemailid}}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
