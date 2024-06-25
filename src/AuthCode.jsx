import "./authcode.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {  useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AuthCode(props) {
  const { state } = useLocation();
  const userData = JSON.parse(JSON.stringify(state));
  const apiCalled = useRef(false);
  const [authcode, setAuthCode] = useState("");
  const navigation = useNavigate();
  useEffect(()=>{
    authcodeIntiation(userData,navigation);
  },[])
  const validate = () => {
    console.log("auth code validation ");
    fetch("http://localhost:8080/webapi/auth/authCodeCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userid: userData.userid,
        authcode: authcode,
        Accesstoken: sessionStorage.getItem("accesstoken"),
      RefreshToken: sessionStorage.getItem("refreshtoken"),
      username: sessionStorage.getItem("username"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const respData = JSON.parse(JSON.stringify(data));
        console.log("Status >>",respData);
        if(respData.status==="sessionexpired"){
          sessionStorage.removeItem("accesstoken");
        sessionStorage.removeItem("refreshtoken");
        sessionStorage.removeItem("username");
          navigation("/")
         }else if(respData.status==="tokenrefreshed"){
           sessionStorage.removeItem("accesstoken");
           sessionStorage.setItem("accesstoken",data.accesstoken);
         }else if (respData.status === "success") {
          navigation("/dashboard", {
            state: {
              role: userData.role,
            },
          });
        } else {
          toast.error("Code Mismatch");
        }
      })
      .catch((e) => {
        console.log("Error in API", e);
      });
  };

  const onInputChange = (event) => {
    if (event.target.name === "authcode") {
      setAuthCode(event.target.value);
    }
  };

  return (
    <div class="auth_bg">
      <div>
        <ToastContainer position="top-right" reverseOrder={false} />
      </div>
      <div class="auth_container">
        <h1>Authenticator Code</h1>
        <input
          type="text"
          value={authcode}
          name="authcode"
          onChange={onInputChange}
        ></input>
        <br></br>
        <button type="submit" onClick={validate}>
          Ok
        </button>
      </div>
    </div>
  );
}

export default AuthCode;

function authcodeIntiation(userData,navigation) {
  fetch("http://localhost:8080/webapi/auth/authCodeIntiation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userid: userData.userid,
      emailid: userData.emailid,
      Accesstoken: sessionStorage.getItem("accesstoken"),
      RefreshToken: sessionStorage.getItem("refreshtoken"),
      username: sessionStorage.getItem("username"),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }).then((data)=>{
       const respData = JSON.parse(JSON.stringify(data));
       if(respData.status==="sessionexpired"){
        sessionStorage.removeItem("accesstoken");
        sessionStorage.removeItem("refreshtoken");
        sessionStorage.removeItem("username");
        navigation("/");
       }else if(respData.status==="tokenrefreshed"){
         sessionStorage.removeItem("accesstoken");
         sessionStorage.setItem("accesstoken",data.accesstoken);
         authcodeIntiation(userData,navigation);
       }
    }).catch((e) => {
      console.log("Error in API", e);
    });
}
