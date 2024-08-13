import { UserAddOutlined, HomeOutlined } from "@ant-design/icons";
import { MdDashboard,MdDataset ,MdDiversity1,MdAssignmentLate} from "react-icons/md";
import { Menu } from "antd";
import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserCreation from "./UserCreation";
import { FaBuffer } from "react-icons/fa6";
import TaskCreation from "./TaskCreation";
import TaskDashboard from "./TaskDashboard";
import { GlobalContext } from "./utils/GlobalContext";
import { MdFactCheck , MdHourglassDisabled } from "react-icons/md";

import "./dashboard.css";
import OverdueTaskDetails from "./OverdueTaskDetails";
import TaskDetailsPage from "./TaskDetailsPage";
import RoleCreation from "./RoleCreation";
import TaskHistory from "./TaskHistory";
import ExtendRequest from "./ExtendRequest";

function addingTabDetails(role) {
  const items = [
    {
      label: "User Creation",
      key: "useradd",
      icon: <UserAddOutlined />,
    },
    {
      label: "Task Creation",
      key: "taskadd",
      icon: <FaBuffer />,
    },
    {
      label: "Task Dashboard",
      key: "tasktab",
      icon: <MdDataset />,
    },
    {
      label: "Task Details",
      key: "taskdetails",
      icon: <MdFactCheck />,
    },
    {
      label: "Overdue Task",
      key: "overduetask",
      icon: < MdHourglassDisabled  />,
    },
    {
      label: "Role Creation",
      key: "rolecreation",
      icon: <MdDiversity1 />,
    },
    {
      label: "Task History",
      key: "taskhistory",
      icon: <MdDashboard />,
    },
    {
      label: "Extend Request",
      key: "extendrequest",
      icon: <MdAssignmentLate />,
    },
  ];
  var filteredItems = [];
  if (role === "Admin") {
    filteredItems = items.filter(
      (obj) =>
        obj.key !== "taskdetails" &&
        obj.key !== "overduetask" &&
        obj.key !== "taskhistory" 
    );
  } else if (role === "Project Manager" || role==="Team Leader") {
    filteredItems = items.filter(
      (obj) => obj.key !== "useradd" && obj.key !== "rolecreation"
    );
  } else {
    filteredItems = items.filter(
      (obj) =>
        obj.key !== "taskadd" &&
        obj.key !== "useradd" &&
        obj.key !== "rolecreation" &&
        obj.key !== "extendrequest" &&
        obj.key !== "tasktab"
    );
  }

  console.log("menu items>>>", filteredItems);
  return filteredItems;
}

function DashBoard() {
  const { userRole,empCode,userName } = useContext(GlobalContext);
  const [userCreationRen, setUserCreationRen] = useState(false);
  console.log("USER ROLE >>", userRole);
  const items = useMemo(() => addingTabDetails(userRole));
  const [taskCreationRen, settaskCreationRen] = useState(false);
  const [taskDashboardRen, setTaskDashboardRen] = useState(false);
  const [itemrenderer, setItemrenderer] = useState(true);
  const [menuitems, setMenuitems] = useState([]);
  const navigation = useNavigate();
  const [taskdetailsren, setTaskdetailsRen] = useState(false);
  const [overduetaskren, setOverduetaskren] = useState(false);
  const [rolecreationren, setRoleCreationren] = useState(false);

  // State for task details and overdue task details numbers
  const [taskDetailsNumber, setTaskDetailsNumber] = useState(0);
  const [overdueTaskNumber, setOverdueTaskNumber] = useState(0);

  const [taskhistoryren , setTaskhistoryren] = useState(false);
  const [extendrequestren,setExtendRequestRen] = useState(false);

  useEffect(() => {
    console.log("inside render componenr")
    setMenuitems([
      {
        label: "Krypto Planner",
        key: "maintab",
        icon: <MdDashboard />,
      },
      {
        label: "Log out",
        key: "logout",
        icon: <MdDashboard />,
      },
    ]);
    setUserCreationRen(false);
    settaskCreationRen(false);
    setTaskDashboardRen(false);

    const tasknumbers = async ()=>{
      const [ongoingTaskNo, overdueTaskNo] = await tasknumber(userName, navigation, empCode);
    setTaskDetailsNumber(ongoingTaskNo);
    setOverdueTaskNumber(overdueTaskNo);
    }

    tasknumbers();
  }, []);

  const onClick = (key) => {
    console.log("click ", key);
    setItemrenderer(false);
    if (key === "useradd") {
      setUserCreationRen(true);
      setTaskDashboardRen(false);
      settaskCreationRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
      setTaskhistoryren(false);
      setExtendRequestRen(false);
    } else if (key === "taskadd") {
      settaskCreationRen(true);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
      setTaskhistoryren(false);
      setExtendRequestRen(false);
    } else if (key === "tasktab") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(true);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
      setTaskhistoryren(false);
      setExtendRequestRen(false);
    } else if (key === "overduetask") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(true);
      setRoleCreationren(false);
      setTaskhistoryren(false);
      setExtendRequestRen(false);
    } else if (key === "taskdetails") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(true);
      setOverduetaskren(false);
      setRoleCreationren(false);
      setTaskhistoryren(false);
      setExtendRequestRen(false);
    } else if (key === "rolecreation") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(true);
      setTaskhistoryren(false);
      setExtendRequestRen(false);
    }else if (key === "taskhistory") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
      setTaskhistoryren(true);
      setExtendRequestRen(false);
    }else if (key === "extendrequest") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
      setTaskhistoryren(false);
      setExtendRequestRen(true);
    }
  };

  const menuOnclick = (menulable) => {
    console.log("menu lable", menulable.key, "  asdasdasd ", userRole);
    console.log("AFTER ")
    if(userRole!== undefined && userRole !==""){
      if (menulable.key === "maintab") {
        setUserCreationRen(false);
        settaskCreationRen(false);
        setTaskDashboardRen(false);
        setTaskdetailsRen(false);
        setItemrenderer(true);
        setOverduetaskren(false);
        setRoleCreationren(false);
        setTaskhistoryren(false);
        setExtendRequestRen(false);
        console.log("this is role creation ren",rolecreationren);
        const tasknumbers = async ()=>{
          const [ongoingTaskNo, overdueTaskNo] = await tasknumber(userName, navigation, empCode);
        setTaskDetailsNumber(ongoingTaskNo);
        setOverdueTaskNumber(overdueTaskNo);
        }
    
        tasknumbers();
      } else if (menulable.key === "logout") {
        logout();
      }
    }else{
      logout();
    }
    
  };

  const logout = () => {
    sessionStorage.removeItem("accesstoken");
    sessionStorage.removeItem("refreshtoken");
    sessionStorage.removeItem("username");
    navigation("/");
  };

  const mainPageHandle = () => {
    setUserCreationRen(false);
    settaskCreationRen(false);
    setTaskDashboardRen(false);
    setItemrenderer(true);
    setOverduetaskren(false);
    setRoleCreationren(false);
  };


  return (
    <div className="dashboardmain">
      <div>
        <Menu
          onClick={menuOnclick}
          selectedKeys={"TASK PLANNER"}
          mode="horizontal"
          items={menuitems}
          theme="dark"
          style={{
            boxShadow: 80,
            backgroundColor : '#282b31'
          }}
        />
      </div>
      <div>
        {userCreationRen && (
          <UserCreation mainPageHandle={mainPageHandle}></UserCreation>
        )}
        {taskCreationRen && (
          <TaskCreation mainPageHandle={mainPageHandle}></TaskCreation>
        )}
        {taskDashboardRen && <TaskDashboard></TaskDashboard>}
        {overduetaskren && <OverdueTaskDetails></OverdueTaskDetails>}
        {taskdetailsren && (
          <TaskDetailsPage mainPageHandle={mainPageHandle}></TaskDetailsPage>
        )}
        {rolecreationren && (
          <RoleCreation mainPageHandle={mainPageHandle}></RoleCreation>
        )}
        {taskhistoryren && (
          <TaskHistory mainPageHandle={mainPageHandle}></TaskHistory>
        )}
        {extendrequestren && (
          <ExtendRequest></ExtendRequest>
        )}
      </div>

      {!userCreationRen && !taskCreationRen && !taskDashboardRen && !overduetaskren
      && !taskdetailsren && !taskhistoryren && !extendrequestren &&
      <div className="mainOptionContainer">
      {itemrenderer &&
        items.map((item, index) => {
          const showNumber =
            item.key === "taskdetails" || item.key === "overduetask";
          const number =
            item.key === "taskdetails"
              ? taskDetailsNumber
              : item.key === "overduetask"
              ? overdueTaskNumber
              : null;
          return (
            <div
        className={"optionsContainer"}
        key={index}
        onClick={() => onClick(item.key)}
      >
        <span className="iconsstyle">{item.icon}</span>
        {showNumber && (
          <span className="numberBadge">{number}</span>
        )}
        <h5 style={{ marginTop: "20%" }}>{item.label}</h5>
      </div>
          );
        })}
    </div>
      }
    </div>
  );
}

export default DashBoard;

const tasknumber = async (userName,navigation,empCode)=>{
   var tasknumbers = [];
   try{
      const response = await fetch("http://localhost:8080/webapi/auth/getTaskNumbers",{
        method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username"),
        empcode : empCode
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      });

      if(!response.ok){
        throw new Error("API NOT HIT");
      }
      const data = await response.json();
      const respData = JSON.parse(JSON.stringify(data));
      console.log(respData);
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
        tasknumber(userName,navigation,empCode);
      } else if (respData.status === "success") {
        console.log("tasko",respData);
        tasknumbers.push(data.ongoingtaskno, data.overduetaskno);
        console.log("hii",tasknumbers);
      }
   }catch(e){
    console.log();
   }
   console.log("after api",tasknumbers);
   return tasknumbers;
}