import React, { useState, useContext } from "react";
import { Card, Typography, Button, List, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./utils/GlobalContext";
import { Input } from "antd";
import { DatePicker } from "antd";
import moment from 'moment';

const { TextArea } = Input;

const { Title, Text } = Typography;

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
};

const TaskDetailsCard = ({ task, fetchTaskDetails }) => {
  const { taskid, Subject, Subtopiccount, subtasks, deadline, completed } =
    task;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExtendRequestVisible, setIsExtendRequestVisible] = useState(false);
  const [extendDate, setExtendDate] = useState(null);
  const [extendTaskId, setExtendTaskId] = useState("");
  const { empCode, userName } = useContext(GlobalContext);
  const navigation = useNavigate();
  const [extendReason, setExtendReason] = useState("");
  const [isReasonRequired, setIsReasonRequired] = useState(false);
  const [isDateRequired, setIsDateRequired] = useState(false);
  const [subtaskcount,setSubtaskcount] = useState(0);
  const [taskstatus,setTaskstatus] = useState("");
  const [subtaskid,setSubtaskid] = useState(0);

  const handleCompleteTask = () => {
    // Handle completing the task, e.g., update state or make an API call
    
    setCompleteTask(taskid, navigation, empCode, userName, fetchTaskDetails);
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
    setSubtaskid(0);
  };

  const extendModalOk = () => {
    setIsExtendRequestVisible(false);
  };

  const extendModalCancel = () => {
    setIsExtendRequestVisible(false);
  };

  const handleExtendRequest = (flag,taskid,Subtopiccount,subtaskid) => {
    console.log("TASKID >>>", taskid,flag,subtaskid);
    setExtendReason("");
    setExtendDate(null);
    setExtendTaskId(taskid);
    setSubtaskcount(Subtopiccount);
    setIsExtendRequestVisible(true);
    setTaskstatus(flag);
    if(flag==="subtask"){
      setSubtaskid(subtaskid);
    }
    console.log("subtask id ",subtaskid)
  };

  const extendReasonHandle = (e) => {
    setExtendReason(e.target.value);
    setIsReasonRequired(e.target.value.trim() === '');
  };

  const extendRequestSubmit = () => {
    if (extendReason.trim() === '') {
      setIsReasonRequired(true);
    }
    if (!extendDate) {
      setIsDateRequired(true);
    }

    if (extendReason.trim() !== '' && extendDate) {
      // Submit logic here
      console.log('Submit request with reason:', extendReason, 'and date:', extendDate.$d);
      const utcValue = moment(extendDate.$d).format('YYYY-MM-DD HH:mm');
      console.log("this is date ", utcValue);
      const taskdetails = {
        taskid : taskid,
        extenddate : utcValue,
        extendreason : extendReason,
        empcode : empCode,
        Subtopiccount : subtaskcount,
        subtaskid : taskstatus==="maintask" ?  0: subtaskid
      }

      console.log("this is taskdetails >>",taskdetails);

      extendrequest(userName,empCode,taskdetails,navigation,fetchTaskDetails);
      setIsExtendRequestVisible(false);
    }
  };

  return (
    <>
      <Card style={cardStyle}>
        <div>
          <Title level={4}>Task ID: {taskid}</Title>
          <Text type="secondary">Subject: {Subject}</Text>
          <br />
          <Text type="secondary">Subtask Count: {Subtopiccount}</Text>
          <br></br>
          <Text type="secondary">Deadline: {deadline}</Text>
        </div>
        <div style={{ marginTop: "16px", textAlign: "right" }}>
        {Subtopiccount === 0 && (
          <Button
            type="primary"
            onClick={handleCompleteTask}
            disabled={completed}
          >
            {completed ? "Completed" : "Complete Task"}
          </Button>
        )}
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            onClick={()=>handleExtendRequest("maintask",taskid,Subtopiccount,0)}
          >
            Extend Task
          </Button>
          {Subtopiccount > 0 && (
            <Button
              type="default"
              style={{ marginLeft: "10px" }}
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
          renderItem={(subtask) => (
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
                {subtask.map.iscompleted ? "Completed" : "Complete Subtask"}
              </Button>
              <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            onClick={()=>handleExtendRequest("subtask",taskid,Subtopiccount,subtask.map.subtaskid)}
          >
            Extend Task
          </Button>
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title="Extend Request"
        visible={isExtendRequestVisible}
        onOk={extendModalOk}
        onCancel={extendModalCancel}
        footer={null}
      >
        <label>Task Id : {extendTaskId}</label>
        <br></br>
        <br></br>
        <TextArea
          rows={4}
          value={extendReason}
          onChange={extendReasonHandle}
          placeholder="Enter the reason"
          maxLength={500}
          style={{ border: isReasonRequired ? '1px solid red' : '' }}
        />
        <br></br>
        <br></br>
        <DatePicker
          showTime
          onChange={(value) => {
            setExtendDate(value);
            setIsDateRequired(false);
          }}
          value={extendDate}
          onOk={(value) => {
            console.log("OK Selected Time: ", value);
          }}
          placeholder="Extend Request Date"
          style={{ width: "100%" ,border: isDateRequired ? '1px solid red' : '' }}
        />
        <br></br>
        <br></br>
        <Button type="primary" onClick={extendRequestSubmit}>
          Submit
        </Button>
      </Modal>
    </>
  );
};

export default TaskDetailsCard;

const setCompleteTask = async (taskid,navigation,empCode,userName,fetchTaskDetails) => {
  try {
    const response = await fetch(
      "http://localhost:8080/webapi/auth/setCompleteTask",
      {
        method: "POST",
        body: JSON.stringify({
          username: userName,
          Accesstoken: sessionStorage.getItem("accesstoken"),
          RefreshToken: sessionStorage.getItem("refreshtoken"),
          empcode: empCode,
          taskid: taskid,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
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
  } catch (e) {
    console.log(e);
  }
};

const extendrequest = async (userName,empCode,taskdetails,navigation,fetchTaskDetails)=>{
   try{
      const response = await fetch("http://localhost:8080/webapi/auth/setExtendTask",{
        method: "POST",
        body: JSON.stringify({
          username: userName,
          Accesstoken: sessionStorage.getItem("accesstoken"),
          RefreshToken: sessionStorage.getItem("refreshtoken"),
          empcode: empCode,
          taskdetails: taskdetails,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if(!response.ok){
        throw new Error("API NOT HIT");
      }

      const data = await response.json();
      const respData = JSON.parse(JSON.stringify(data));
      console.log("Extend submission ",respData);
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
        console.log("after syubmitted",respData);
        fetchTaskDetails();
      }
   }catch(e){
    console.log(e);
   }
}