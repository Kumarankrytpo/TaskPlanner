import React, { useState ,useContext} from 'react';
import { Card, Typography, Button, List, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import { GlobalContext } from './utils/GlobalContext';

const { Title, Text } = Typography;

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
};

const TaskDetailsCard = ({ task ,fetchTaskDetails}) => {
  const { taskid, Subject, Subtopiccount, subtasks, deadline, completed } = task;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { empCode, userName } = useContext(GlobalContext);
  const navigation = useNavigate();

  const handleCompleteTask = () => {
    // Handle completing the task, e.g., update state or make an API call    
    setCompleteTask(taskid,navigation,empCode,userName,fetchTaskDetails)
  };

  const handleSubtaskComplete = (subtaskid) => {
    // Handle completing the subtask, e.g., update state or make an API call
    alert(`Subtask ${subtaskid} completed!`);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Card style={cardStyle}>
        <div>
          <Title level={4}>Task ID: {taskid}</Title>
          <Text type="secondary">Subject: {Subject}</Text><br />
          <Text type="secondary">Subtask Count: {Subtopiccount}</Text>
          <Text type="secondary">Deadline: {deadline}</Text>
        </div>
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={handleCompleteTask}
            disabled={completed}
          >
            {completed ? 'Completed' : 'Complete Task'}
          </Button>
          {Subtopiccount > 0 && (
            <Button
              type="default"
              style={{ marginLeft: '10px' }}
              onClick={showModal}
            >
              View Subtasks
            </Button>
          )}
        </div>
      </Card>

      <Modal
        title="Subtask Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          dataSource={subtasks}
          renderItem={subtask => (
            <List.Item>
              <List.Item.Meta
                title={`Subtask ID: ${subtask.map.subtaskid}`}
                description={`Main Task ID: ${taskid} | Subject: ${subtask.map.subject} | Deadline: ${subtask.map.deadline}`}
              />
              <Button
                type="primary"
                onClick={() => handleSubtaskComplete(subtask.map.subtaskid)}
                disabled={subtask.map.iscompleted}
              >
                {subtask.map.iscompleted ? 'Completed' : 'Complete Subtask'}
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default TaskDetailsCard;

const setCompleteTask = async (taskid,navigation,empCode,userName,fetchTaskDetails)=>{
       try{
          const response = await fetch("http://localhost:8080/webapi/auth/setCompleteTask",{
            method: "POST",
            body: JSON.stringify({
              username: userName,
              Accesstoken: sessionStorage.getItem("accesstoken"),
              RefreshToken: sessionStorage.getItem("refreshtoken"),
              empcode: empCode,
              taskid : taskid
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          if(!response.ok){
            throw new Error("API Not Hit");
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
              "Session storage accesstoken refreshed",
              sessionStorage.getItem("accesstoken")
            );
          } else if (respData.status === "success") {
            fetchTaskDetails();
          }
       }catch(e){
        console.log(e);
       }
}