import React, { useState } from 'react';
import { Card, Typography, Button, List, Modal } from 'antd';

const { Title, Text } = Typography;

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
};

const TaskDetailsCard = ({ task }) => {
  const { taskid, Subject, Subtopiccount, subtasks, deadline, completed } = task;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCompleteTask = () => {
    // Handle completing the task, e.g., update state or make an API call
    alert(`Task ${taskid} completed!`);
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
