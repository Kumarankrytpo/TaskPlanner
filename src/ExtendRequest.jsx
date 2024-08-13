import React, { useState, useEffect, useContext } from 'react';
import './ExtendRequest.css';
import { Autocomplete, TextField } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { GlobalContext } from './utils/GlobalContext';

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
      subtaskdetails: [
        {
          subtaskid: 1,
          subject: "subtask 1",
          deadline: "2024-07-21 01:00",
          extenddate: "2024-07-22 03:00"
        },
        {
          subtaskid: 2,
          subject: "subtask 2",
          deadline: "2024-07-21 01:00",
          extenddate: "2024-07-22 03:00"
        }
      ]
    }
  }
];

const ExtendRequest = () => {
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const navigation = useNavigate();
  const {userName} = useContext(GlobalContext);

  useEffect(() => {
    var teams = async()=>{
      var teamlist = await getTeam(navigation,userName);
      if (Array.isArray(teamlist)) {
        const formattedOptions = teamlist.map((item) => item.map); // Extract the 'map' object
        setOptions(formattedOptions);
      } else {
        toast.error("Something Went Wrong");
        console.error("Expected userList to be an array:", teamlist);
      }
    }

    teams();
  }, []);

  const handleSubtaskClick = (subtasks) => {
    setSelectedSubtask(subtasks);
  };

  const closeModal = () => {
    setSelectedSubtask(null);
  };

  return (
    <div className="App">
       <ToastContainer position="top-right" reverseOrder={false} />
      <Autocomplete
        multiple
        limitTags={2}
        value={selectedOptions}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue);
        }}
        options={options}
        getOptionLabel={(option) => option.value}
        renderOption={(props, option) => (
          <li {...props}>
            {option.value} ({option.empid})
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Filter Team Members" sx={{color : "#fff"}} variant="outlined" />
        )}
        sx={{ mb: 2, width: "100%" }}
      />

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
                <button>Accept</button>
                <button>New Extend Deadline</button>
                <button>Reject</button>
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
            {selectedSubtask.map((subtask, idx) => (
              <div key={idx}>
                <h3>{subtask.subject}</h3>
                <p>Deadline: {subtask.deadline}</p>
                <p>Extended Date: {subtask.extenddate}</p>
                <div className="modal-buttons">
                  <button>Accept</button>
                  <button>Extend Date</button>
                </div>
              </div>
            ))}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExtendRequest;

const getTeam =async (navigation,userName)=>{
  var teamlist = [];
  try{
    const response = await fetch("http://localhost:8080/webapi/auth/getTeamMember",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username"),
      }),
    });

      if(!response.ok){
        toast.error("Someting Went Wrong");
        throw new Error("API NOT HOT for get teams");
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
        getTeam();
      } else if (respData.status === "success") {
        teamlist = data.userlist.myArrayList;
      }
  }catch(e){
    toast.error("Someting Went Wrong");
    console.log(e);
  }
  return teamlist;
}