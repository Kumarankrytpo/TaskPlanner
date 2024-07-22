import React, { useState } from 'react';
import './ExtendRequest.css';

const data = [
  {
    member1: {
      taskid: 1,
      subject: "subject 1",
      deadline: "2024-07-21 10:00",
      extendeddate: "2024-07-23 10:00",
      subtaskCount: 0
    },
    member2: {
      taskid: 2,
      subject: "subject 1",
      deadline: "2024-07-21 10:00",
      extendeddate: "2024-07-23 10:00",
      subtaskCount: 1,
      subtaskdetails: {
        subtaskid: 1,
        subject: "subtask 1",
        deadline: "2024-07-21 01:00",
        extenddate: "2024-07-22 03:00"
      }
    }
  }
];

const ExtendRequest=()=> {
  const [selectedSubtask, setSelectedSubtask] = useState(null);

  const handleSubtaskClick = (subtask) => {
    setSelectedSubtask(subtask);
  };

  const closeModal = () => {
    setSelectedSubtask(null);
  };

  return (
    <div className="App">
      <div className="container">
        {data.map((memberData, index) => {
          const members = Object.values(memberData);
          return members.map((member, idx) => (
            <div key={`${index}-${idx}`} className="task-container">
              <div className="task-header">
                <h3>{member.subject}</h3>
              </div>
              <p>Deadline: {member.deadline}</p>
              <p>Extended Date: {member.extendeddate}</p>
              <div className="button-group">
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
                {member.subtaskCount > 0 && (
                  <button onClick={() => handleSubtaskClick(member.subtaskdetails)}>
                    View Subtask
                  </button>
                )}
              </div>
            </div>
          ));
        })}
      </div>
      {selectedSubtask && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedSubtask.subject}</h3>
            <p>Deadline: {selectedSubtask.deadline}</p>
            <p>Extended Date: {selectedSubtask.extenddate}</p>
            <div className="modal-buttons">
              <button>Accept</button>
              <button>Extend Date</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExtendRequest;
