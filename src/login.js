import './App.css'
import React, { useEffect, useState} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


function Login() {
  const[inputStyleClas,setinputStyleClas] = useState("");
  const[username,setLoginUserName] = useState("");
  const[password,setLoginPassword] = useState("");
  const navigation = useNavigate();

  useEffect(()=>{
    sessionStorage.removeItem("accesstoken");
    sessionStorage.removeItem("refreshtoken");
    sessionStorage.removeItem("username");
  },[])

  const validateLogin = () =>{
    let rtnflag=true;
      if(username===undefined || username===isNaN || username.length===0){
        setinputStyleClas("wrong_inputField");
        rtnflag=false;
      }
      if(password===undefined || password===isNaN || password.length===0){
        setinputStyleClas("wrong_inputField");
        rtnflag=false;
      }
      if(rtnflag){
        fetch("http://localhost:8080/webapi/auth/login", { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body : JSON.stringify({
            username : username,
            password : password
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        }).then((data) => {
          const respData = JSON.parse(JSON.stringify(data));
          console.log("THIS IS LOGIN RESPONSE ::: ",respData);
          if(respData.check!== undefined && respData.check==="success"){
            sessionStorage.setItem("accesstoken",respData.accesstoken);
            sessionStorage.setItem("refreshtoken",respData.refreshtoken);
            sessionStorage.setItem("username",respData.username);
            toast.success('Login Successful');
            navigation("/authcode",{
              state : {
                emailid : respData.emailid,
                userid : respData.userid,
                role : respData.role
              }
            });
          }else{
            toast.error('Account Not Exists.');
          }
        }).catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
      }
      
  } 

  const onInputChange = (event) =>{
      if(event.target.name==='loginusername'){
        setinputStyleClas("");
        setLoginUserName(event.target.value);
      }else if(event.target.name==='loginpassword'){
        setinputStyleClas("");
        setLoginPassword(event.target.value);
      }
  }
  
  return (
    <div class="login_bg">
 <div><ToastContainer position="top-right" reverseOrder={false}/>
    <div class="center">
      <div>   
      <p>User Name</p>
      <input type="text" placeholder="username" name='loginusername' value={username} class={inputStyleClas} onChange={onInputChange}></input>
      <p>Password</p>
      <input type="password" placeholder="password" name='loginpassword' value={password} class={inputStyleClas} onChange={onInputChange}></input>
      <br />
      <br />
      <button type="submit" onClick={validateLogin} >Login</button>
      </div>
    
    </div>
    </div>
    </div>
   
  );
}

export default Login;
