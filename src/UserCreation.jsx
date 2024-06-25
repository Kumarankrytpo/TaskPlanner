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
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AutoComplete } from "antd";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

function UserCreation({ setCurrent, setUserCreationRen }) {
    const [activeTab, setActiveTab] = useState("1");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [emailid, setEmailId] = useState("");
    const [empid, setEmpid] = useState("");
    const [role, setRole] = useState("");
    const [reportto, setReportTo] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [users, SetUsers] = useState([]);
    const navigation = useNavigate();

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
          const resp = JSON.parse(JSON.stringify(data));
          console.log("RETURN DATE", resp);
          setEmpid("EMP" + resp.empcode);
        })
        .catch((e) => {
          console.error("There was a problem with the fetch operation:", e);
        });
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
    const handleSearch = (value) => {
        const suggestions = [
            { name: 'kumaran' },
            { name: 'apple' },
            { name: 'banana' },
            { name: 'orange' },
            { name: 'grape' },
            { name: 'strawberry' }
        ];
        const filteredSuggestions = suggestions.filter(suggestion =>
            suggestion.name.toLowerCase().includes(value.toLowerCase())
        );
    
        // Map the filtered suggestions to the format required by AutoComplete
        SetUsers(filteredSuggestions.map(suggestion => ({ value: suggestion.name })));
    };

    const handleFocus = () => {
        
        SetUsers([]);
    };

    const onTabChange = (key)=>{
      if(key==="2"){
        console.log("2");

      }
    }
    

      const onSelect = (value) => {
        console.log('Selected:', value);
      };
    return (
        <div>
            <div>
                <ToastContainer position="top-right" reverseOrder={false} />
            </div>
            <Tabs centered activeKey={activeTab} onChange={()=>onTabChange}>
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
                        <input
                            type="text"
                            name="reportto"
                            value={reportto}
                            onChange={inputChange}
                        ></input>
                       <AutoComplete
    options={users}
    onSearch={handleSearch}
    onSelect={onSelect}
    style={{ width: 200 }}
    onFocus={handleFocus} 
    placeholder="Report To"
>

</AutoComplete>

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
