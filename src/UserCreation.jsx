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

function UserCreation({ setCurrent, setUserCreationRen }) {
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
  const [roles, setRoles] = useState(["Project Manager", "Team Lead"]);

  console.log("aftr useres set .", users);

  const nextTab = (key) => {
    setActiveTab(key);
  };

  const inputChange = (event) => {
    if (event.target.name === "firstname") {
      setFirstName(event.target.value);
    } else if (event.target.name === "lastname") {
      setLastName(event.target.value);
    } else if (event.target.name === "emailid") {
      setEmailId(event.target.value);
    } else if (event.target.name === "role") {
      setRole(event.target.value);
    } else if (event.target.name === "reportto") {
      setReportTo(event.target.value);
    } else if (event.target.name === "username") {
      setUserName(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
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
    }).then((response) => {
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
          console.log("after empd code >>>"+empid);
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
  }, []);

  const saveUser = () => {
    const saveData = {
      firstname: firstname,
      lastname: lastname,
      emailid: emailid,
      empid: empid,
      role: role,
      reportto: reportto,
      username: username,
      password: password,
    };
    console.log("JSON <>>>", JSON.stringify(saveData));
    fetch("http://localhost:8080/webapi/auth/usercreation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(saveData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("SSSSS", data);
        const resp = JSON.parse(JSON.stringify(data));
        console.log("RESPOEN");
        console.log("response >>", resp);
        if (resp.status === "success") {
          toast.success("User Created");
          setUserCreationRen(false);
          setCurrent("home");
        } else if (resp.status === "existing user") {
          toast.error("User Name Already Exist");
        } else {
          toast.error("User not Created");
        }
      })
      .catch((exception) => {
        console.log("Exception : ", exception);
      });
  };

  const onTabChange = (key) => {
    if (key === "2") {
      console.log("2");
    }
  };

  const onSelect = (value) => {
    console.log("Selected:", value);
  };
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
            <h3>First Name</h3>
            <input
              type="text"
              name="firstname"
              value={firstname}
              onChange={inputChange}
            ></input>
            <h3>Last Name</h3>
            <input
              type="text"
              name="lastname"
              value={lastname}
              onChange={inputChange}
            ></input>
            <h3>Email</h3>
            <input
              type="email"
              name="emailid"
              value={emailid}
              onChange={inputChange}
            ></input>
            <h3>Employee Id</h3>
            <input type="text" disabled={true} value={empid}></input>
            <br></br>
            <br></br>
            <button type="button" onClick={() => nextTab("2")}>
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
            <h3>Role</h3>
            <input
              type="text"
              name="role"
              value={role}
              onChange={inputChange}
            ></input>
            <h3>Reporting To</h3>

            <Autocomplete
              value={reportto}
              onChange={(event, newValue) => {
                setReportTo(newValue);
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
                />
              )}
              sx={{ mb: 2, width: "100%" }}
            />

            <br></br>
            <br></br>
            <button onClick={() => nextTab("1")}>
              <span>{<ArrowLeftOutlined />}</span>Previous
            </button>
            <button onClick={() => nextTab("3")}>
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
            <input
              type="text"
              name="username"
              value={username}
              onChange={inputChange}
            ></input>
            <h3>Password</h3>
            <input
              type="password"
              name="password"
              value={password}
              onChange={inputChange}
            ></input>
            <br></br>
            <br></br>
            <button onClick={() => nextTab("2")}>
              <span>{<ArrowLeftOutlined />}</span>Previous
            </button>
            <button onClick={saveUser}>
              Submit<span>{<CheckCircleOutlined />}</span>
            </button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default UserCreation;
