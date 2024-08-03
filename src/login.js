import './App.css'
import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { GlobalContext } from './utils/GlobalContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const WhiteTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    color: 'white', // text color
  },
  '& .MuiInputLabel-root': {
    color: 'white', // label color
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'white', // placeholder color
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #0A6847 20%, #41B06E 90%)', // your gradient colors
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px #0A6847', // optional shadow
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #41B06E 20%, #0A6847 90%)', // ensure hover state maintains the gradient
  },
}));

const GradientText = styled('h1')({
  fontFamily: 'Merienda, cursive',
  background: 'linear-gradient(45deg, #0A6847 20%, #41B06E 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

function Login() {
  const [username, setLoginUserName] = useState("");
  const [password, setLoginPassword] = useState("");
  const navigate = useNavigate();
  const { setUserName, updateempCode, updateGlobalValue } = useContext(GlobalContext);

  useEffect(() => {
    sessionStorage.removeItem("accesstoken");
    sessionStorage.removeItem("refreshtoken");
    sessionStorage.removeItem("username");
  }, []);

  const validateLogin = () => {
    let rtnflag = true;
    if (username === undefined || username === '' || username.length === 0) {
      rtnflag = false;
    }
    if (password === undefined || password === '' || password.length === 0) {
      rtnflag = false;
    }
    if (rtnflag) {
      fetch("http://localhost:8080/webapi/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((data) => {
        const respData = JSON.parse(JSON.stringify(data));
        console.log("THIS IS LOGIN RESPONSE ::: ", respData);
        if (respData.check !== undefined && respData.check === "success") {
          sessionStorage.setItem("accesstoken", respData.accesstoken);
          sessionStorage.setItem("refreshtoken", respData.refreshtoken);
          sessionStorage.setItem("username", respData.username);
          toast.success('Login Successful');
          setUserName(username);
          updateempCode(respData.empcode);
          updateGlobalValue(respData.role);
          if (respData.isotp) {
            navigate("/authcode", {
              state: {
                emailid: respData.emailid,
                userid: respData.userid,
                role: respData.role
              }
            });
          } else {
            navigate("/dashboard");
          }
        } else {
          toast.error('Account Not Exists.');
        }
      }).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'loginusername') {
      setLoginUserName(value);
    } else if (name === 'loginpassword') {
      setLoginPassword(value);
    }
  };

  return (
    <div className="login_bg">
      <ToastContainer position="top-right" reverseOrder={false} />
      <div className="waveupper">
      <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <filter id="glow">
          <feGaussianBlur stdDeviation="15" result="coloredBlur" />
          <feFlood flood-color="url(#linearGradientGlow)" />
          <feComposite operator="in" in2="coloredBlur" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="coloredBlur" />
          </feMerge>
        </filter>
        <path filter="url(#glow)" fill="url(#linearGradient)" fill-opacity="1"
         d="M0,192L34.3,176C68.6,160,137,128,206,101.3C274.3,75,343,53,411,
         53.3C480,53,549,75,617,101.3C685.7,128,754,160,823,186.7C891.4,
         213,960,235,1029,250.7C1097.1,267,1166,277,1234,261.3C1302.9,
         245,1371,203,1406,181.3L1440,160L1440,320L1405.7,320C1371.4,
         320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,
         891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,
         411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
         <defs>
        <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="20%" stop-color="#41B06E" />
          <stop offset="90%" stop-color="#0A6847" />
        </linearGradient>
        <linearGradient id="linearGradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="100%" stop-color="#41B06E" />
        </linearGradient>
      </defs>
         </svg>
         <svg style={{marginTop:"-2%"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
         <filter id="glow">
          <feGaussianBlur stdDeviation="15" result="coloredBlur" />
          <feFlood flood-color="url(#linearGradientGlow)" />
          <feComposite operator="in" in2="coloredBlur" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="coloredBlur" />
          </feMerge>
        </filter>
        <path filter="url(#glow)" fill="url(#linearGradient)" fill-opacity="1"
       d="M0,192L34.3,176C68.6,160,137,128,206,101.3C274.3,75,343,53,
       411,53.3C480,53,549,75,617,101.3C685.7,128,754,160,823,186.7C891.4,
       213,960,235,1029,250.7C1097.1,267,1166,277,1234,261.3C1302.9,
       245,1371,203,1406,181.3L1440,160L1440,0L1405.7,0C1371.4,0,1303,
       0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,
       617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
         <defs>
        <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="20%" stop-color="#0A6847" />
          <stop offset="90%" stop-color="#41B06E" />
        </linearGradient>
      </defs>
         </svg>
      </div>
      <div className="center">
      
        <div>
          <GradientText>KRYPTO PLANNER</GradientText>
          <br />
          <WhiteTextField
            id="standard-basic"
            label="Username"
            variant="standard"
            name='loginusername'
            value={username}
            onChange={onInputChange}
          />
          <br /><br /><br />
          <WhiteTextField
            id="standard-basic"
            label="Password"
            type="password"
            name="loginpassword"
            variant="standard"
            value={password}
            onChange={onInputChange}
          />
          <br /><br /><br />
          <GradientButton variant="contained" onClick={validateLogin}>
            Login
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

export default Login;
