import "./usercreation.css";
import { Tabs } from "antd";
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
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const WhiteTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: "white", // text color
  },
  "& .MuiInputLabel-root": {
    color: "white", // label color
  },
  "& .MuiInputBase-input::placeholder": {
    color: "white", // placeholder color
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "white", // placeholder color
  },
  "&MuiInputBase-input-MuiInput-input.Mui-disabled" :{
    color : "white",
  }
}));

const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiAutocomplete-option": {
    backgroundColor: "lightblue", // Customize this color
    '&[data-focus="true"]': {
      backgroundColor: "lightgreen", // Color when focused
    },
    '&[aria-selected="true"]': {
      backgroundColor: "blue", // Color when selected
      color: "white", // Text color when selected
    },
    '&[data-shrink=false]': {
      backgroundColor: "blue", // Color when selected
      color: "white", // Text color when selected
    },
    
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .ant-tabs-tab-btn": {
    color: "#0A6847", // text color
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #0A6847 20%, #41B06E 90%)", // your gradient colors
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px #0A6847", // optional shadow
  color: "white",
  height: 48,
  padding: "0 30px",
  "&:hover": {
    background: "linear-gradient(45deg, #41B06E 20%, #0A6847 90%)", // ensure hover state maintains the gradient
  },
}));

const { TabPane } = Tabs;

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
  const [isotp, setIsotp] = useState(false);
  const [reporttoempid, setReporttoempid] = useState("");
  const [firstnameerror, setFirstNameError] = useState("");
  const [lastnameerror, setLastNameError] = useState("");
  const [emailiderror, setEmailidError] = useState("");
  const [roleerror, setRoleError] = useState("");
  const [reporttoerror, setReporttoerror] = useState("");
  const [usernameerror, setUserNameError] = useState("");
  const [passworderror, setPasswordError] = useState("");

  console.log("aftr useres set .", users);

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const nextTab = (key) => {
    let flag = true;
    console.log("this is next tab key", key);
    if (key - 1 === 1) {
      if (firstname === null || firstname === "") {
        setFirstNameError("First Name Mandatory");
        flag = false;
      }
      if (lastname === null || lastname === "") {
        setLastNameError("lastname empty");
        flag = false;
      }
      if (emailid === null || emailid === "") {
        setEmailidError("emailid empty");
        flag = false;
      } else if (!validateEmail(emailid)) {
        console.log("invalid emailid");
        setEmailidError("emailid Not Correct");
        flag = false;
      }
      if (flag) {
        setRole("");
        setReportTo("");
      }
    } else if (key - 1 === 2) {
      if (role === null || role === "") {
        setRoleError("role is empty");
        flag = false;
      }
      if (reportto === null || reportto === "") {
        setReporttoerror("report to is empy");
        flag = false;
      }
    }
    if (flag) {
      setActiveTab(key);
    } else {
      console.log("emlid id error", emailiderror);
      if (emailiderror === "emailid Not Correct") {
        toast.error("Enter the Valid Emaliid");
      } else {
        toast.error("Enter the mandatory fields");
      }
    }
  };

  const inputChange = (event) => {
    if (event.target.name === "firstname") {
      setFirstName(event.target.value);
      setFirstNameError("");
    } else if (event.target.name === "lastname") {
      setLastName(event.target.value);
      setLastNameError("");
    } else if (event.target.name === "emailid") {
      setEmailId(event.target.value);
      setEmailidError("");
    } else if (event.target.name === "username") {
      setUserName(event.target.value);
      setUserNameError("");
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
      setPasswordError("");
    }
  };

  useEffect(() => {

    const EMPIDRetreive =  async ()=>{
      var empcodee =await empidretreive(navigation,userName);
      console.log("user effcect",empcodee);
       setEmpid("EMP"+empcodee);
    } 

    EMPIDRetreive();
  
    const fetchUserList = async () => {
      const users = await getuserlist(navigation, userName);
      SetUsers(users); // assuming you have a state setter for options
    };

    fetchUserList();

    const getroledetails = async () => {
      const roles = await getRoles(userName, navigation);
      setRoles(roles);
    };

    getroledetails();
  }, [navigation,userName]);

  const saveUser = () => {
    let flag = true;
    if (username === null || username === "") {
      setUserNameError("username empty");
      flag = false;
    }

    if (password === null || password === "") {
      setPasswordError("password empty");
      flag = false;
    }
    if (flag) {
      const saveData = {
        firstname: firstname,
        lastname: lastname,
        emailid: emailid,
        empid: empid,
        role: role,
        reportto: reportto,
        username: username,
        password: password,
        isotp: isotp,
        reporttoempid: reporttoempid,
      };
      saveUserData(saveData, username, navigation, mainPageHandle);
    }
  };

  const onTabChange = (key) => {
    if (key === "2") {
      console.log("2");
    }
  };

  const onChangeOtp = (e) => {
    setIsotp(e.target.checked);
    console.log("this is otp", e.target.checked);
  };

  return (
    <div class="usercreationmain">
      <div>
        <ToastContainer position="top-right" reverseOrder={false} />
      </div>
      <StyledTabs
        style={{ color: "#0A6847" }}
        centered
        activeKey={activeTab}
        onChange={() => onTabChange}
      >
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
            <WhiteTextField
              type="text"
              name="firstname"
              variant="standard"
              value={firstname}
              onChange={inputChange}
              error={!!firstnameerror}
              className={firstnameerror ? "error-input" : ""}
              style={{ height: "25px", width: "250px" }}
            ></WhiteTextField>
            <br></br>
            <br></br>
            <h3>Last Name*</h3>
            <WhiteTextField
              type="text"
              name="lastname"
              value={lastname}
              variant="standard"
              onChange={inputChange}
              error={!!lastnameerror}
              className={lastnameerror ? "error-input" : ""}
              style={{ height: "25px", width: "250px" }}
            ></WhiteTextField>
            <br></br>
            <br></br>
            <h3>Email*</h3>
            <WhiteTextField
              type="email"
              name="emailid"
              value={emailid}
              variant="standard"
              onChange={inputChange}
              error={!!emailiderror}
              className={emailiderror ? "error-input" : ""}
              style={{ height: "25px", width: "250px" }}
            ></WhiteTextField>
            <br></br>
            <br></br>
            <h3>Employee Id</h3>
            <WhiteTextField
              type="text"
              disabled={true}
              value={empid}
              variant="standard"
              style={{ height: "25px", width: "250px", color: "#fff" }}
            ></WhiteTextField>
            <br></br>
            <br></br>
            <br></br>
            <GradientButton
              type="button"
              onClick={() => nextTab("2")}
              style={{ marginLeft: "10px" }}
            >
              Next
              <span>
                <ArrowRightOutlined />
              </span>
            </GradientButton>
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
            <CustomAutocomplete
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
                  className={roleerror ? "error-input" : ""}
                  InputProps={{
                    ...params.InputProps,
                    style: { color: role ? "white" : "black" }, // Customize selected value text color
                  }}
                />
              )}
              sx={{ mb: 2, width: "100%" }}
            />

            <h3>Reporting To*</h3>

            <CustomAutocomplete
              value={reportto}
              onChange={(event, newValue) => {
                console.log(event, " afasfasd", newValue);
                if (newValue !== null) {
                  setReportTo(newValue);
                  setReporttoempid(newValue.empid);
                  setReporttoerror("");
                } else {
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
                  className={reporttoerror ? "error-input" : ""}
                  InputProps={{
                    ...params.InputProps,
                    style: { color: "white" }, // Customize selected value text color
                  }}
                />
              )}
              sx={{ mb: 2, width: "100%" }}
            />

            <br></br>
            <br></br>
            <GradientButton onClick={() => nextTab("1")}>
              <span>{<ArrowLeftOutlined />}</span>Previous
            </GradientButton>
            <GradientButton onClick={() => nextTab("3")} style={{ marginLeft: "10px" }}>
              Next<span>{<ArrowRightOutlined />}</span>
            </GradientButton>
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
            <WhiteTextField
              type="text"
              name="username"
              value={username}
              onChange={inputChange}
              variant="standard"
              error={!!firstnameerror}
              className={usernameerror ? "error-input" : ""}
            ></WhiteTextField>
            <br></br>
            <br></br>
            <h3>Password</h3>
            <WhiteTextField
              type="password"
              name="password"
              value={password}
              variant="standard"
              onChange={inputChange}
              error={!!firstnameerror}
              className={passworderror ? "error-input" : ""}
            ></WhiteTextField>
            <br></br>
            <br></br>
            <label>
              <Checkbox color="success" onChange={onChangeOtp} />
              Is OTP
            </label>
            <br></br>
            <br></br>
            <GradientButton onClick={() => nextTab("2")}>
              <span>{<ArrowLeftOutlined />}</span>Previous
            </GradientButton>
            <GradientButton onClick={saveUser} style={{ marginLeft: "10px" }}>
              Submit<span>{<CheckCircleOutlined />}</span>
            </GradientButton>
          </div>
        </TabPane>
      </StyledTabs>
    </div>
  );
}

export default UserCreation;

const getRoles = async (userName, navigation) => {
  var roles = [];
  try {
    const response = await fetch(
      "http://localhost:8080/webapi/auth/getRoleDetails",
      {
        method: "POST",
        body: JSON.stringify({
          username: userName,
          Accesstoken: sessionStorage.getItem("accesstoken"),
          RefreshToken: sessionStorage.getItem("refreshtoken"),
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
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
      getRoles(userName, navigation);
    } else if (respData.status === "success") {
      console.log("After user list API hit >>>", respData.roledetails);
      if (Array.isArray(respData.roledetails.myArrayList)) {
        roles = respData.roledetails.myArrayList.map((item) => item.map);
      }
    }
  } catch (e) {
    console.log(e);
  }
  return roles;
};

const saveUserData = (saveData, userName, navigation, mainPageHandle) => {
  console.log("JSON <>>>", JSON.stringify(saveData));
  fetch("http://localhost:8080/webapi/auth/usercreation", {
    method: "POST",
    body: JSON.stringify({
      username: userName,
      Accesstoken: sessionStorage.getItem("accesstoken"),
      RefreshToken: sessionStorage.getItem("refreshtoken"),
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
};

const empidretreive = async(navigation,userName) =>{
  var empid = "";
  try{
     const response = await fetch("http://localhost:8080/webapi/auth/getEmpID",{
      method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
     });

     if(!response.ok){
      toast.error("Somethig Went Error");
      throw new Error("Api Not Hit for get emp code");
     }

     const data = await response.json();
     const respData = JSON.parse(JSON.stringify(data));

     console.log("inside get rmo id ",respData);
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
      empidretreive();
    } else if (respData.status === "success") {
      empid = respData.empcode;
      console.log("after empd code >>>" + empid);
    }
  }catch(e){
    toast.error("Something Went Error");
    console.log(e);
  }
  return empid;
}

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
      getuserlist(navigation, userName);
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
