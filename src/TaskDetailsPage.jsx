import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Pagination } from 'antd';
import TaskDetailsCard from './TaskDetailsCard';
import './TaskDetailsPage.css';  // Ensure this file is created for custom styles
import { GlobalContext } from './utils/GlobalContext';
import { useNavigate } from "react-router-dom";

const TaskDetailsPage = ({ mainPageHandle }) => {
  const [tasks, setTasks] = useState([]);
  const [tasksToShow, setTasksToShow] = useState([]); // Define tasksToShow state

  // Pagination
  const pageSize = 8; // Number of tasks per page
  const [currentPage, setCurrentPage] = useState(1);

  const { empCode, userName } = useContext(GlobalContext);
  const navigation = useNavigate();

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const taskdetails = await getTaskdetails(empCode, navigation, userName);
      setTasks(taskdetails);
    };
    fetchTaskDetails();
  }, [empCode, navigation, userName]);

  useEffect(() => {
    const indexOfLastTask = currentPage * pageSize;
    const indexOfFirstTask = indexOfLastTask - pageSize;
    setTasksToShow(tasks.slice(indexOfFirstTask, indexOfLastTask));
  }, [tasks, currentPage]);

  return (
    <div style={{ padding: '20px', width: '100vw', height: '100vh', overflow: 'auto' }}>
      <Row gutter={[16, 16]}>
        {tasksToShow.map(task => (
          <Col span={6} key={task.taskid} className="task-col">
            <TaskDetailsCard task={task} />
          </Col>
        ))}
      </Row>
      {tasks.length > pageSize && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Pagination
            current={currentPage}
            total={tasks.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPage;


const getTaskdetails = async (empCode, navigation, userName) => {
    console.log("inside task details method");
    var taskarr = [];
    try {
      const response = await fetch("http://localhost:8080/webapi/auth/getTaskDetails", {
        method: "POST",
        body: JSON.stringify({
          username: userName,
          Accesstoken: sessionStorage.getItem("accesstoken"),
          RefreshToken: sessionStorage.getItem("refreshtoken"),
          empcode: empCode
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("API NOT HIT");
      }
  
      const data = await response.json();
      console.log("this is data >>", data)
      const respData = JSON.parse(JSON.stringify(data));
      console.log("resp data ", respData);
  
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
        console.log("After user list API hit >>>", respData.taskdetails);
        if (Array.isArray(respData.taskdetails.myArrayList)) {
          taskarr = respData.taskdetails.myArrayList.map((item) => {
            let task = item.map;
            // Ensure subtasks is always an array
            if (typeof task.subtasks === 'object' && 'myArrayList' in task.subtasks) {
              task.subtasks = task.subtasks.myArrayList;
            } else {
              task.subtasks = [];
            }
            return task;
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
    return taskarr;
  }
  