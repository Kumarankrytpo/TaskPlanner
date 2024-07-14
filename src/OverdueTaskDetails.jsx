import React, { useState, useEffect } from "react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import { DatePicker, Modal, Input, Button } from "antd";
import './OverdueTaskDetails.css'; // Import your CSS for styling

function getPendingTasks() {
  const tasks = [
    {
      TaskName: "Task 1",
      Taskid: 1,
      SubTaskCount: 0,
      subject : "SUMA",
      Deadline: "2024-05-13 22:00",
      RequestRen: false,
    },
    {
      TaskName: "Task 2",
      Taskid: 2,
      SubTaskCount: 0,
      subject : "SUMA",
      Deadline: "2024-05-13 22:00",
      RequestRen: false,
    },
    {
      TaskName: "Task 3",
      Taskid: 3,
      SubTaskCount: 2,
      subject : "SUMA",
      Deadline: "2024-05-13 22:00",
      Subtaskdetails: [
        {
          subtaskheader: "SUBTASK1",
          subject  : "suma",
          subtaskid: 1,
          Deadline: "2024-05-13 22:00",
          RequestRen: false,
        },
        {
          subtaskheader: "SUBTASK2",
          subtaskid: 2,
          subject  : "suma",
          Deadline: "2024-05-13 22:00",
          RequestRen: false,
        },
      ],
    },
  ];

  return tasks;
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

  useEffect(() => {
    setTaskDetails(getPendingTasks());
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
                  {item.RequestRen && (
                    <div className="date-picker-container">
                      <DatePicker
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            {expandedTaskIndex === index && item.Subtaskdetails && (
              <div className="subtasks-container">
                {item.Subtaskdetails.map((subtask, subIndex) => (
                  <div key={subIndex} className="subtask-item">
                    <h4>Subtask ID: {subtask.subtaskid}</h4>
                    <h4>Subject: {subtask.subject}</h4>
                    <p>Subtask Header: {subtask.subtaskheader}</p>
                    <p>Deadline: {subtask.Deadline}</p>
                    <div className="subtask-actions">
                      <button className="action-button">
                        Extend Request
                      </button>
                      <button className="action-button">
                        Completed <FaCheck />
                      </button>
                      {subtask.RequestRen && (
                        <div className="date-picker-container">
                          <DatePicker
                            showTime={{ format: "HH:mm" }}
                            format="YYYY-MM-DD HH:mm"
                          />
                        </div>
                      )}
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
