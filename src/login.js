import './App.css'
import React, { useEffect, useState,useContext} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { GlobalContext } from './utils/GlobalContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


function Login() {
  const[inputStyleClas,setinputStyleClas] = useState("");
  const[username,setLoginUserName] = useState("");
  const[password,setLoginPassword] = useState("");
  const navigation = useNavigate();
  const {setUserName,updateempCode,updateGlobalValue} = useContext(GlobalContext);


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
            setUserName(username);
            updateempCode(respData.empcode);
            updateGlobalValue(respData.role);
            if(respData.isotp){
              navigation("/authcode",{
                state : {
                  emailid : respData.emailid,
                  userid : respData.userid,
                  role : respData.role
                }
              });
            }else{
              navigation("/dashboard");
            }
            
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

      <TextField id="standard-basic" label="Username" variant="standard" name='loginusername' value={username} onChange={onInputChange}/>
      <br></br>
      <br></br>
      <TextField id="standard-basic" label="Password" type='password' variant="standard" name='loginpassword' value={password} onChange={onInputChange}/>
    
      <br />
      <br />
      <Button variant="contained" color="success" onClick={validateLogin}>Login</Button>
      </div>
    
    </div>
    </div>
    </div>
   
  );
}

export default Login;
