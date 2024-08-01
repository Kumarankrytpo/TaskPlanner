import React, { useState, useEffect, useContext } from "react";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { DatePicker, Modal, Input, Button, Card, Row, Col, Pagination } from "antd";
import './OverdueTaskDetails.css';
import { GlobalContext } from "./utils/GlobalContext";

const { Search } = Input;

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
        empcode: empCode,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username")
      })
    });

    if (!response.ok) {
      throw new Error("API NOT HIT");
    }

    const data = await response.json();
    const respData = JSON.parse(JSON.stringify(data));
    if (respData.status === "sessionexpired") {
      sessionStorage.removeItem("accesstoken");
      sessionStorage.removeItem("refreshtoken");
      sessionStorage.removeItem("username");
    } else if (respData.status === "tokenrefreshed") {
      sessionStorage.removeItem("accesstoken");
      sessionStorage.setItem("accesstoken", data.token);
      await getPendingTasks();
    } else if (respData.status === "success") {
      if (Array.isArray(respData.pendingtaskdetails.myArrayList)) {
        task = respData.pendingtaskdetails.myArrayList.map((item) => {
          let task = item.map;
          if (typeof task.Subtaskdetails === 'object' && 'myArrayList' in task.Subtaskdetails) {
            task.Subtaskdetails = task.Subtaskdetails.myArrayList.map(subtask => subtask.map);
          } else {
            task.Subtaskdetails = [];
          }
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { empCode } = useContext(GlobalContext);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getPendingTasks(empCode);
      setTaskDetails(tasks);
    };
    fetchData();
  }, [empCode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const getDeviation = (deadline) => {
    const d1 = currentTime;
    const d2 = new Date(deadline);

    const diffMs = Math.abs(d1 - d2);
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const hh = String(diffHrs).padStart(2, "0");
    const mm = String(diffMins).padStart(2, "0");

    return `${hh}:${mm}`;
  };

  const showExtendModal = (id) => {
    setSelectedTaskId(id);
    setModalVisible(true);
  };

  const handleModalOk = () => {
    console.log("Selected Date:", selectedDate);
    console.log("Remarks:", remarks);

    setModalVisible(false);
    setSelectedDate(null);
    setRemarks("");
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedDate(null);
    setRemarks("");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredTasks = taskDetails.filter((task) => 
  String(task.Taskid).toLowerCase().includes(searchTerm.toLowerCase()) ||
  task.subject.toLowerCase().includes(searchTerm.toLowerCase())
);

  const toggleSubtasks = (index) => {
    if (expandedTaskIndex === index) {
      setExpandedTaskIndex(null);
    } else {
      setExpandedTaskIndex(index);
    }
  };
  

  const tasksPerPage = 12;
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  return (
    <div className="overdue-container">
      <h3>Overdue Tasks</h3>
      <Search
        placeholder="Search tasks..."
        onSearch={handleSearch}
        style={{ marginBottom: '20px', width: '100%' }}
      />
      <Row gutter={[16, 16]}>
        {paginatedTasks.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={8} xl={4}>
            <Card
              title={`Task ID: ${item.Taskid}`}
              extra={<FaExclamationCircle style={{ color: 'red', fontSize: '18px' }} />}
              actions={[
                <Button type="link" onClick={() => showExtendModal(item.Taskid)}>
                  Extend Request
                </Button>,
                <Button type="primary" icon={<FaCheck />}>
                  Completed
                </Button>
              ]}
            >
              <p><strong>Subject:</strong> {item.subject}</p>
              <p><strong>Deadline:</strong> {item.Deadline}</p>
              <p><strong>Deviation:</strong> {getDeviation(item.Deadline)}</p>
              {item.SubTaskCount !== 0 && (
                <Button type="link" onClick={() => toggleSubtasks(index)}>
                  {expandedTaskIndex === index ? "Hide Subtasks" : "Show Subtasks"}
                </Button>
              )}
              {expandedTaskIndex === index && item.Subtaskdetails.length > 0 && (
                <div className="subtasks-container">
                  {item.Subtaskdetails.map((subtask, subIndex) => (
                    <div key={subIndex} className="subtask-item">
                      <p><strong>Subtask ID:</strong> {subtask.subtaskid}</p>
                      <p><strong>Subject:</strong> {subtask.subject}</p>
                      <p><strong>Deadline:</strong> {subtask.Deadline}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      {filteredTasks.length > tasksPerPage && (
        <Pagination
          current={currentPage}
          total={filteredTasks.length}
          pageSize={tasksPerPage}
          onChange={page => setCurrentPage(page)}
          style={{ marginTop: '20px', textAlign: 'center' }}
        />
      )}
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
