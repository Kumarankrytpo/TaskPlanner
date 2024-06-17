import { UserAddOutlined,HomeOutlined  } from '@ant-design/icons';
import { MdDashboard } from "react-icons/md";
import { Menu } from 'antd';
import { useState } from 'react';
import UserCreation from './UserCreation';
import {useLocation} from 'react-router-dom';
import { FaBuffer} from "react-icons/fa6";
import TaskCreation from './TaskCreation';
import TaskDashboard from './TaskDashboard';

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


function DashBoard(props) {
    const state = useLocation();
    const userdata = JSON.parse(JSON.stringify(state));
    console.log(userdata.state.role);
    const [current, setCurrent] = useState('');
    const [userCreationRen,setUserCreationRen] = useState(false);
    const items = addingTabDetails(userdata.state.role);
    const [taskCreationRen,settaskCreationRen] = useState(false);
    const [taskDashboardRen,setTaskDashboardRen] = useState(false);
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if(e.key==="home"){
        setUserCreationRen(false);
        settaskCreationRen(false);
        setTaskDashboardRen(false);
    }else if(e.key==="useradd"){
        setUserCreationRen(true);
        setTaskDashboardRen(false);
    }else if(e.key==="taskadd"){
      settaskCreationRen(true);
      setUserCreationRen(false);
      setTaskDashboardRen(false);
    }else if(e.key==="tasktab"){
      settaskCreationRen(true);
      setUserCreationRen(false);
      setTaskDashboardRen(true);
    }

  };
  return (
    <div>
      <div class="admin_dashboard">
       <Menu onClick={onClick} 
       selectedKeys={[current]} 
       mode="horizontal" 
       items={items}
       theme='dark'
       style={{
        boxShadow : 80
       }} />
       {userCreationRen && <UserCreation setCurrent={(val)=>setCurrent(val)} setUserCreationRen={(val)=>setUserCreationRen(val)}></UserCreation>}
       {taskCreationRen && <TaskCreation></TaskCreation>}
       {taskDashboardRen && <TaskDashboard></TaskDashboard>}
      </div>
    </div>
  );
}

export default DashBoard;
