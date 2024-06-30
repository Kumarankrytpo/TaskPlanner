import { UserAddOutlined,HomeOutlined  } from '@ant-design/icons';
import { MdDashboard } from "react-icons/md";
import { Menu } from 'antd';
import { useEffect, useState ,useContext} from 'react';
import { useNavigate } from "react-router-dom";
import UserCreation from './UserCreation';
import { FaBuffer} from "react-icons/fa6";
import TaskCreation from './TaskCreation';
import TaskDashboard from './TaskDashboard';
import { GlobalContext } from './utils/GlobalContext';

import './dashboard.css'

function addingTabDetails(role){
  const items = [
    {
        label: 'Home',
        key: 'home',
        icon: <HomeOutlined />,
      },
    {
      label: 'User Creation',
      key: 'useradd',
      icon: <UserAddOutlined />,
    },
    {
      label: 'Task Creation',
      key: 'taskadd',
      icon: <FaBuffer />,
    },
    {
      label: 'Task Dashboard',
      key: 'tasktab',
      icon: <MdDashboard /> ,
    },
   ];
  var filteredItems=[];
  if(role==="Admin"){
    filteredItems = items.filter(obj => obj.key !== 'taskadd'); 
  }else if(role==="Project Manager"){
    filteredItems = items.filter(obj => obj.key !== 'useradd'); 
  }

  return filteredItems;
}


function DashBoard() {
    const { userRole } = useContext(GlobalContext);
    const [userCreationRen,setUserCreationRen] = useState(false);
    console.log("USER ROLE >>",userRole);
    const items = addingTabDetails(userRole);
    const [taskCreationRen,settaskCreationRen] = useState(false);
    const [taskDashboardRen,setTaskDashboardRen] = useState(false);
    const [itemrenderer,setItemrenderer] = useState(true);
    const [menuitems,setMenuitems] = useState([]);
    const navigation = useNavigate();


    useEffect(()=>{
      setMenuitems([
        {
          label: 'TASK PLANNER',
        key: 'maintab',
        icon: <MdDashboard /> ,
        },{
          label: 'Log out',
        key: 'logout',
        icon: <MdDashboard /> ,
        }
      ])
      setUserCreationRen(false);
      settaskCreationRen(false);
      setTaskDashboardRen(false);
    },[])

  const onClick = (key) => {
    console.log('click ', key);
    setItemrenderer(false);
    if(key==="home"){
        setUserCreationRen(false);
        settaskCreationRen(false);
        setTaskDashboardRen(false);
    }else if(key==="useradd"){
        setUserCreationRen(true);
        setTaskDashboardRen(false);
        settaskCreationRen(false);
    }else if(key==="taskadd"){
      settaskCreationRen(true);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
    }else if(key==="tasktab"){
      settaskCreationRen(true);
      setUserCreationRen(false);
      setTaskDashboardRen(true);
    }
  };

  const menuOnclick = (menulable) =>{
       console.log("menu lable",menulable.key);
       if(menulable.key==="maintab"){
        setUserCreationRen(false);
      settaskCreationRen(false);
      setTaskDashboardRen(false);
      setItemrenderer(true);
       }else if(menulable.key==="logout"){
        logout();
       }
  }

  const logout=()=>{
    sessionStorage.removeItem("accesstoken");
    sessionStorage.removeItem("refreshtoken");
    sessionStorage.removeItem("username");
    navigation("/");
  }
   
  return (
    <div>
      <div class="admin_dashboard">
       <Menu onClick={menuOnclick} 
       selectedKeys={'TASK PLANNER'} 
       mode="horizontal" 
       items={menuitems}
       theme='dark'
       style={{
        boxShadow : 80
       }} />
       
      </div>
      <div>
     {userCreationRen && <UserCreation></UserCreation>}
       {taskCreationRen && <TaskCreation></TaskCreation>}
       {taskDashboardRen && <TaskDashboard></TaskDashboard>}
     </div>

     <div class='mainOptionContainer'>
      {itemrenderer && items.map((item,index)=>{
        return(
         <div className='optionsContainer' key={index} onClick={()=>onClick(item.key)}>
         <span class='iconsstyle'>{item.icon}</span>
        <h5 style={{marginTop:"20%"}}>{item.label}</h5>
      </div>
        )
      })}
     </div>
    
    </div>
  );
}

export default DashBoard;
