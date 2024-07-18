import React, { useState, useEffect,useContext } from "react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import { DatePicker, Modal, Input, Button } from "antd";
import './OverdueTaskDetails.css'; // Import your CSS for styling
import { GlobalContext } from "./utils/GlobalContext";

const getPendingTasks = async (empCode) => {
  let task = [];
  try {
    const response = await fetch("http://localhost:8080/webapi/auth/getPendingTaskDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        empcode : empCode,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username")
      })
    });

    console.log("after hit s")
    if (!response.ok) {
      throw new Error("API NOT HIT");
    }

    const data = await response.json();
    console.log("data",data);
    const respData = JSON.parse(JSON.stringify(data));
    if (respData.status === "sessionexpired") {
      sessionStorage.removeItem("accesstoken");
      sessionStorage.removeItem("refreshtoken");
      sessionStorage.removeItem("username");
    } else if (respData.status === "tokenrefreshed") {
      console.log("data acc", data.token);
      sessionStorage.removeItem("accesstoken");
      sessionStorage.setItem("accesstoken", data.token);
      console.log(
        "session storge accesstocken refreshed ",
        sessionStorage.getItem("accesstoken")
      );
      await getPendingTasks();
    } else if (respData.status === "success") {
      if (Array.isArray(respData.pendingtaskdetails.myArrayList)) {
        task = respData.pendingtaskdetails.myArrayList.map((item) => {
          let task = item.map;
          // Ensure subtasks is always an array
          if (typeof task.Subtaskdetails === 'object' && 'myArrayList' in task.Subtaskdetails) {
            task.Subtaskdetails = task.Subtaskdetails.myArrayList.map(subtask => subtask.map);
          } else {
            task.Subtaskdetails = [];
          }
          console.log("after everything",task);
          return task;
        });
      }
    }
  } catch (e) {
    console.log(e);
  }

  return task;
}

function OverdueTaskDetails() {
  const [taskDetails, setTaskDetails] = useState([]);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reportTo, setReportTo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const {empCode}  = useContext(GlobalContext);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getPendingTasks(empCode);
      setTaskDetails(tasks);
    };
    fetchData();
    setReportTo("Kumaran");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const toggleSubtasks = (index) => {
    // Toggle the expanded state for the clicked task
    if (expandedTaskIndex === index) {
      setExpandedTaskIndex(null);
    } else {
      setExpandedTaskIndex(index);
    }
  };

  const getDeviation = (deadline) => {
    const d1 = currentTime;
    const d2 = new Date(deadline);

    // Calculate the difference in milliseconds
    const diffMs = Math.abs(d1 - d2);

    // Calculate the difference in hours and minutes
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the result as HH:mm
    const hh = String(diffHrs).padStart(2, "0");
    const mm = String(diffMins).padStart(2, "0");

    return `${hh}:${mm}`;
  };

  const showExtendModal = (id) => {
    setSelectedTaskId(id);
    setModalVisible(true);
  };

  const handleModalOk = () => {
    // Handle submission logic here
    console.log("Selected Date:", selectedDate);
    console.log("Remarks:", remarks);

    // Close the modal and reset states
    setModalVisible(false);
    setSelectedDate(null);
    setRemarks("");
  };

  const handleModalCancel = () => {
    // Close the modal and reset states
    setModalVisible(false);
    setSelectedDate(null);
    setRemarks("");
  };

  return (
    <div className="overdue-container">
      <h3>Overdue Tasks</h3>
      <div className="tasks-list">
        {taskDetails.map((item, index) => (
          <div key={index} className="task-item">
            <div className="task-header">
              <h3>Task ID: {item.Taskid}</h3>
              <h3>Subject: {item.subject}</h3>
              <p>Deadline: {item.Deadline}</p>
              {item.SubTaskCount !== 0 && (
                <button
                  className="toggle-button"
                  onClick={() => toggleSubtasks(index)}
                >
                  <FaAngleDown />
                </button>
              )}
              <p>Deviation: {getDeviation(item.Deadline)}</p>
              {item.SubTaskCount === 0 && (
                <div className="task-actions">
                  <button
                    className="action-button"
                    onClick={() => showExtendModal(item.Taskid)}
                  >
                    Extend Request
                  </button>
                  <button className="action-button">
                    Completed <FaCheck />
                  </button>
                </div>
              )}
            </div>
            {expandedTaskIndex === index && item.Subtaskdetails && (
              <div className="subtasks-container">
                {item.Subtaskdetails.map((subtask, subIndex) => (
                  <div key={subIndex} className="subtask-item">
                    <h4>Subtask ID: {subtask.subtaskid}</h4>
                    <h4>Subject: {subtask.subject}</h4>
                    <p>Deadline: {subtask.Deadline}</p>
                    <div className="subtask-actions">
                      <button className="action-button">
                        Extend Request
                      </button>
                      <button className="action-button">
                        Completed <FaCheck />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Extend Request Modal */}
      <Modal
        title="Extend Task Deadline"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <DatePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          style={{ marginBottom: "10px", width: "100%" }}
        />
        <Input.TextArea
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 6 }}
          style={{ marginBottom: "10px" }}
        />
      </Modal>
    </div>
  );
}

export default OverdueTaskDetails;
