import { UserAddOutlined, HomeOutlined } from "@ant-design/icons";
import { MdDashboard } from "react-icons/md";
import { Menu } from "antd";
import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserCreation from "./UserCreation";
import { FaBuffer } from "react-icons/fa6";
import TaskCreation from "./TaskCreation";
import TaskDashboard from "./TaskDashboard";
import { GlobalContext } from "./utils/GlobalContext";

import "./dashboard.css";
import OverdueTaskDetails from "./OverdueTaskDetails";
import TaskDetailsPage from "./TaskDetailsPage";
import RoleCreation from "./RoleCreation";

function addingTabDetails(role) {
  const items = [
    {
      label: "Home",
      key: "home",
      icon: <HomeOutlined />,
    },
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
      icon: <MdDashboard />,
    },
    {
      label: "Task Deatils",
      key: "taskdetails",
      icon: <MdDashboard />,
    },
    {
      label: "OverDue Task",
      key: "overduetask",
      icon: <MdDashboard />,
    },
    {
      label: "Role Creation",
      key: "rolecreation",
      icon: <MdDashboard />,
    },
  ];
  var filteredItems = [];
  if (role === "Admin") {
    filteredItems = items.filter(
      (obj) =>
        obj.key !== "tasktab" &&
        obj.key !== "taskdetails" &&
        obj.key !== "overduetask"
    );
  } else if (role === "Project Manager") {
    filteredItems = items.filter(
      (obj) => obj.key !== "useradd" && obj.key !== "rolecreation"
    );
  } else {
    filteredItems = items.filter(
      (obj) =>
        obj.key !== "taskadd" &&
        obj.key !== "useradd" &&
        obj.key !== "rolecreation"
    );
  }

  console.log("menu items>>>", filteredItems);
  return filteredItems;
}

function DashBoard() {
  const { userRole } = useContext(GlobalContext);
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

  useEffect(() => {
    setMenuitems([
      {
        label: "TASK PLANNER",
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
  }, []);

  const onClick = (key) => {
    console.log("click ", key);
    setItemrenderer(false);
    if (key === "home") {
      setUserCreationRen(false);
      settaskCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
    } else if (key === "useradd") {
      setUserCreationRen(true);
      setTaskDashboardRen(false);
      settaskCreationRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
    } else if (key === "taskadd") {
      settaskCreationRen(true);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
    } else if (key === "tasktab") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(true);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(false);
    } else if (key === "overduetask") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(true);
      setRoleCreationren(false);
    } else if (key === "taskdetails") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(true);
      setOverduetaskren(false);
      setRoleCreationren(false);
    } else if (key === "rolecreation") {
      settaskCreationRen(false);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
      setTaskdetailsRen(false);
      setOverduetaskren(false);
      setRoleCreationren(true);
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
        console.log("this is role creation ren",rolecreationren);
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
    <div>
      <div class="admin_dashboard">
        <Menu
          onClick={menuOnclick}
          selectedKeys={"TASK PLANNER"}
          mode="horizontal"
          items={menuitems}
          theme="dark"
          style={{
            boxShadow: 80,
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
      </div>

      <div class="mainOptionContainer">
        {itemrenderer &&
          items.map((item, index) => {
            return (
              <div
                className="optionsContainer"
                key={index}
                onClick={() => onClick(item.key)}
              >
                <span class="iconsstyle">{item.icon}</span>
                <h5 style={{ marginTop: "20%" }}>{item.label}</h5>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default DashBoard;
