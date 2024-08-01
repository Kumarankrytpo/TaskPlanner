import "./usercreation.css";
import { Tabs ,Input} from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SecurityScanOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { TextField } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./utils/GlobalContext";
import Checkbox from '@mui/material/Checkbox';

const { TabPane } = Tabs;

const getuserlist = async (navigation, userName) => {
  console.log("INSIDE USER LIST METHOD");
  let userlist = [];

  try {
    const response = await fetch("http://localhost:8080/webapi/auth/getUsers", {
      method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username"),
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const respData = JSON.parse(JSON.stringify(data));
    console.log("Status >>", respData);

    if (respData.status === "sessionexpired") {
      sessionStorage.removeItem("accesstoken");
      sessionStorage.removeItem("refreshtoken");
      sessionStorage.removeItem("username");
      navigation("/");
    } else if (respData.status === "tokenrefreshed") {
      sessionStorage.removeItem("accesstoken");
      sessionStorage.setItem("accesstoken", data.token);
      console.log(
        "Session storage accesstoken refreshed",
        sessionStorage.getItem("accesstoken")
      );
      getuserlist(navigation,userName);
    } else if (respData.status === "success") {
      console.log("After user list API hit >>>", respData.userlist);
      if (Array.isArray(respData.userlist.myArrayList)) {
        userlist = respData.userlist.myArrayList.map((item) => item.map);
      }
      console.log("<><><<<<><><><><><", userlist);
    }
  } catch (e) {
    console.error("There was a problem with the fetch operation:", e);
  }

  console.log("Before user list return", userlist);
  return userlist;
};

function UserCreation({ mainPageHandle }) {
  const navigation = useNavigate();
  const [activeTab, setActiveTab] = useState("1");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [emailid, setEmailId] = useState("");
  const [empid, setEmpid] = useState("");
  const [role, setRole] = useState("");
  const [reportto, setReportTo] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { userName } = useContext(GlobalContext);
  const [users, SetUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isotp,setIsotp] = useState(false);
  const [reporttoempid,setReporttoempid] = useState("");
  const [firstnameerror,setFirstNameError] = useState("");
  const [lastnameerror,setLastNameError] = useState("");
  const [emailiderror,setEmailidError] = useState("");
  const [roleerror,setRoleError] = useState("");
  const [reporttoerror,setReporttoerror] = useState("");
  const [usernameerror,setUserNameError] = useState("");
  const [passworderror,setPasswordError] = useState("");
  

  console.log("aftr useres set .", users);

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const nextTab = (key) => {
    let flag=true;
    console.log("this is next tab key",key);
    if(key-1===1){
      if(firstname===null || firstname===""){
        setFirstNameError("First Name Mandatory");
        flag=false;
      }
       if(lastname===null || lastname===""){
        setLastNameError("lastname empty");
        flag=false
      }
      if(emailid===null || emailid===""){
        setEmailidError("emailid empty");
        flag=false;
      }else if(!validateEmail(emailid)){
        console.log("invalid emailid");
        setEmailidError("emailid Not Correct");
        flag=false;
      }
      if(flag){
        setRole("");
        setReportTo("");
      }
    }else if(key-1==2){
      if(role===null || role===""){
        setRoleError("role is empty");
        flag=false;
      }
      if(reportto===null || reportto===""){
        setReporttoerror("report to is empy");
        flag=false;
      }
    }
    if(flag){
      setActiveTab(key);
    }else{
      console.log("emlid id error",emailiderror);
      if(emailiderror==="emailid Not Correct"){
        toast.error("Enter the Valid Emaliid");
      }else{
        toast.error("Enter the mandatory fields");
      }
    }
  };

  const inputChange = (event) => {
    if (event.target.name === "firstname") {
      setFirstName(event.target.value);
      setFirstNameError("")
    } else if (event.target.name === "lastname") {
      setLastName(event.target.value);
      setLastNameError("");
    } else if (event.target.name === "emailid") {
      setEmailId(event.target.value);
      setEmailidError("");
    } else if (event.target.name === "username") {
      setUserName(event.target.value);
      setUserNameError("")
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
      setPasswordError("");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/webapi/auth/getEmpID", {
      method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username"),
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const respData = JSON.parse(JSON.stringify(data));
        console.log("EMPD CODE API", respData);
        if (respData.status === "sessionexpired") {
          sessionStorage.removeItem("accesstoken");
          sessionStorage.removeItem("refreshtoken");
          sessionStorage.removeItem("username");
          navigation("/");
        } else if (respData.status === "tokenrefreshed") {
          sessionStorage.removeItem("accesstoken");
          sessionStorage.setItem("accesstoken", data.token);
          console.log(
            "session storge accesstocken refreshed ",
            sessionStorage.getItem("accesstoken")
          );
        } else if (respData.status === "success") {
          setEmpid("EMP" + respData.empcode);
          console.log("after empd code >>>" + empid);
        }
      })
      .catch((e) => {
        console.error("There was a problem with the fetch operation:", e);
      });

    const fetchUserList = async () => {
      const users = await getuserlist(navigation, userName);
      SetUsers(users); // assuming you have a state setter for options
    };

    fetchUserList();

    const getroledetails = async()=>{
      const roles = await getRoles(userName,navigation);
      setRoles(roles);
    }

    getroledetails();
  }, []);

  const saveUser = () => {
    let flag=true;
    if(username===null || username===""){
       setUserNameError("username empty");
       flag=false
    }

    if(password===null || password===""){
      setPasswordError("password empty");
      flag=false;
    }
    if(flag){
      const saveData = {
        firstname: firstname,
        lastname: lastname,
        emailid: emailid,
        empid: empid,
        role: role,
        reportto: reportto,
        username: username,
        password: password,
        isotp : isotp,
        reporttoempid : reporttoempid
      };
      saveUserData(saveData,username,navigation,mainPageHandle);
    }    
  };

  const onTabChange = (key) => {
    if (key === "2") {
      console.log("2");
    }
  };

  const onSelect = (value) => {
    console.log("Selected:", value);
  };

  const onChangeOtp = (e)=>{
    setIsotp(e.target.checked);
    console.log("this is otp",e.target.checked);
  }
  return (
    <div class="usercreationmain">
      <div>
        <ToastContainer position="top-right" reverseOrder={false} />
      </div>
      <Tabs centered activeKey={activeTab} onChange={() => onTabChange}>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              User Information
            </span>
          }
          key="1"
        >
          <div className="user_info_center">
            <h3>First Name*</h3>
            <Input
              type="text"
              name="firstname"
              value={firstname}
              onChange={inputChange}
              error={!!firstnameerror}
              className={firstnameerror ? 'error-input' : ''}
            ></Input>
            <h3>Last Name*</h3>
            <Input
              type="text"
              name="lastname"
              value={lastname}
              onChange={inputChange}
              error={!!lastnameerror}
              className={lastnameerror ? 'error-input' : ''}
            ></Input>
            <h3>Email*</h3>
            <Input
              type="email"
              name="emailid"
              value={emailid}
              onChange={inputChange}
              error={!!emailiderror}
              className={emailiderror ? 'error-input' : ''}
            ></Input>
            <h3>Employee Id</h3>
            <Input type="text" disabled={true} value={empid}></Input>
            <br></br>
            <br></br>
            <button type="button" onClick={() => nextTab("2")} style={{ marginLeft: "10px" }}>
              Next
              <span>
                <ArrowRightOutlined />
              </span>
            </button>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <SolutionOutlined />
              Role Information
            </span>
          }
          key="2"
        >
          <div className="user_info_center">
            <h3>Role*</h3>
            <Autocomplete
              value={role}
              onChange={(event, newValue) => {
                setRole(newValue);
                setRoleError("");
              }}
              options={roles}
              getOptionLabel={(option) => (option ? option.role : "")}
              isOptionEqualToValue={(option, value) =>
                option.role === value.role
              }
              renderOption={(props, option) => (
                <li {...props}>{option.role}</li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Options"
                  variant="outlined"
                  error={!!roleerror}
                  className={roleerror ? 'error-input' : ''}
                />
              )}
              sx={{ mb: 2, width: "100%" }}
              
            />

            <h3>Reporting To*</h3>

            <Autocomplete
              value={reportto}
              onChange={(event, newValue) => {
                console.log(event," afasfasd",newValue);
                if(newValue!==null){
                  setReportTo(newValue);
                  setReporttoempid(newValue.empid);
                  setReporttoerror("");
                }else{
                  setReportTo("");
                  setReporttoempid("");
                }
              }}
              options={users}
              getOptionLabel={(option) => (option ? option.name : "")}
              isOptionEqualToValue={(option, value) =>
                option.empid === value.empid
              }
              renderOption={(props, option) => (
                <li {...props}>
                  {option.name} ({option.role})
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Options"
                  variant="outlined"
                  error={!!reporttoerror}
                  className={reporttoerror ? 'error-input' : ''}
                />
              )}
              sx={{ mb: 2, width: "100%" }}
            />

            <br></br>
            <br></br>
            <button onClick={() => nextTab("1")}>
              <span>{<ArrowLeftOutlined />}</span>Previous
            </button>
            <button onClick={() => nextTab("3")} style={{ marginLeft: "10px" }}>
              Next<span>{<ArrowRightOutlined />}</span>
            </button>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <SecurityScanOutlined />
              Security Information
            </span>
          }
          key="3"
        >
          <div className="user_info_center">
            <h3>User Name</h3>
            <Input
              type="text"
              name="username"
              value={username}
              onChange={inputChange}
              error={!!firstnameerror}
              className={usernameerror ? 'error-input' : ''}
            ></Input>
            <h3>Password</h3>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={inputChange}
              error={!!firstnameerror}
              className={passworderror ? 'error-input' : ''}
            ></Input>
            <br></br>
            <br></br>
            <label>
            <Checkbox color="success"  onChange={onChangeOtp}/>
             Is OTP
      </label>
            <br></br>
            <br></br>
            <button onClick={() => nextTab("2")} >
              <span>{<ArrowLeftOutlined />}</span>Previous
            </button>
            <button onClick={saveUser} style={{ marginLeft: "10px" }}>
              Submit<span>{<CheckCircleOutlined />}</span>
            </button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default UserCreation;

const getRoles = async (userName,navigation)=>{
  var roles = [];
  try{
    const response = await fetch("http://localhost:8080/webapi/auth/getRoleDetails",{
      method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username"),
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if(!response.ok){
      throw new Error("NO HIT API");
    }

    const data = await response.json();
    const respData = JSON.parse(JSON.stringify(data));

    if (respData.status === "sessionexpired") {
      sessionStorage.removeItem("accesstoken");
      sessionStorage.removeItem("refreshtoken");
      sessionStorage.removeItem("username");
      navigation("/");
    } else if (respData.status === "tokenrefreshed") {
      sessionStorage.removeItem("accesstoken");
      sessionStorage.setItem("accesstoken", data.token);
      console.log(
        "session storge accesstocken refreshed ",
        sessionStorage.getItem("accesstoken")
      );
      getRoles(userName,navigation);
    } else if (respData.status === "success") {
      console.log("After user list API hit >>>", respData.roledetails);
      if (Array.isArray(respData.roledetails.myArrayList)) {
        roles = respData.roledetails.myArrayList.map((item) => item.map);
      }
    }
  }catch(e){
    console.log(e);
  }
  return roles;
}

const saveUserData = (saveData,userName,navigation,mainPageHandle)=>{

  console.log("JSON <>>>", JSON.stringify(saveData));
  fetch("http://localhost:8080/webapi/auth/usercreation", {
    method: "POST",
    body: JSON.stringify({
      username: userName,
      Accesstoken: sessionStorage.getItem("accesstoken"),
      RefreshToken: sessionStorage.getItem("refreshtoken"),
      username: sessionStorage.getItem("username"),
      userdetails: saveData,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const respData = JSON.parse(JSON.stringify(data));
      console.log("EMPD CODE API", respData);
      if (respData.status === "sessionexpired") {
        sessionStorage.removeItem("accesstoken");
        sessionStorage.removeItem("refreshtoken");
        sessionStorage.removeItem("username");
        navigation("/");
      } else if (respData.status === "tokenrefreshed") {
        sessionStorage.removeItem("accesstoken");
        sessionStorage.setItem("accesstoken", data.token);
        console.log(
          "session storge accesstocken refreshed ",
          sessionStorage.getItem("accesstoken")
        );
      } else if (respData.status === "success") {
        if (respData.status === "success") {
          toast.success("User Created");
          mainPageHandle();
        } else if (respData.status === "existing user") {
          toast.error("User Name Already Exist");
        } else {
          toast.error("User not Created");
        }
      }
    })
    .catch((exception) => {
      console.log("Exception : ", exception);
    });
}
