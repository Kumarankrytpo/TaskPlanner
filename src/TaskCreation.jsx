import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  LinearProgress,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "antd";
import { GlobalContext } from "./utils/GlobalContext";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";

const { TextArea } = Input;

const steps = ["Task Details", "Subtasks", "Deadline", "Summary"];

const TaskCreation = ({ mainPageHandle }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [subTaskCount, setSubTaskCount] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [subtasks, setSubtasks] = useState([{ subtaskheader: "", subtaskDeadline: null }]);
  const [selectedOptions, setSelectedOptions] = useState([]); // State for multiple selections
  const [options, setOptions] = useState([]);
  const { userName } = useContext(GlobalContext);
  const navigation = useNavigate();
  const [taskNameError, setTaskNameError] = useState("");
  const [subTaskCountError, setSubTaskCountError] = useState("");
  const [deadlinedis,setDeadeLineDis] = useState(false);
  const [deadlineError, setDeadlineError] = useState("");
  const [summary,setSummary] = useState("");

  const handleNext = () => {
    let valid = true;

    if (activeStep === 0) {
      if (!taskName) {
        setTaskNameError("Task Name is required");
        valid = false;
      } else {
        setTaskNameError("");
      }
    }else if(activeStep===1){
      console.log("INSIDE STEP 1",subtasks);
      if(subtasks.length>=1 && subtasks[0].subtaskDeadline!==null){
         setDeadline(subtasks[subtasks.length-1].subtaskDeadline);
         setDeadeLineDis(true);
      }
      console.log(deadline);
    } else if (activeStep === 2) {
      if (!deadline) {
        setDeadlineError("Deadline is required");
        valid = false;
      } else {
        setDeadlineError("");
      }
    }

    if (activeStep === 3) {
      console.log(options);
      const taskdetails = {
        subject: taskName,
        assignee: selectedOptions,
        reportto: userName,
        deadline: deadline,
        subtopicount: subtasks[0].subtaskDeadline!==null ? subtasks.length : 0,
        subtask: subtasks,
        summary : summary
      };
      savetaskdetails(taskdetails).then(() => {
        mainPageHandle();
      });
    } else {
      if (valid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleSubtaskChange = (index, field, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index][field] = value;
    setSubtasks(newSubtasks);
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, subIndex) => subIndex !== index));
  };

  useEffect(() => {
    console.log("dgdfg", userName);
    fetch("http://localhost:8080/webapi/auth/getTeamMember", {
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
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const respData = JSON.parse(JSON.stringify(data));
        console.log("Status >>", respData);
        if (respData.status === "sessionexpired") {
          sessionStorage.removeItem("accesstoken");
          sessionStorage.removeItem("refreshtoken");
          sessionStorage.removeItem("username");
          navigation("/");
        } else if (respData.status === "tokenrefreshed") {
          sessionStorage.removeItem("accesstoken");
          sessionStorage.setItem("accesstoken", data.token);
          console.log(
            "session storge accesstocken refreshed ",
            sessionStorage.getItem("accesstoken")
          );
        } else if (respData.status === "success") {
          const userList = data.userlist.myArrayList; // Extract the array
          if (Array.isArray(userList)) {
            const formattedOptions = userList.map((item) => item.map); // Extract the 'map' object
            setOptions(formattedOptions);
          } else {
            console.error("Expected userList to be an array:", userList);
          }
        }
      })
      .catch((e) => {
        console.log("Error in API", e);
      });
  }, []);

  const addSubtask = () => setSubtasks([...subtasks, { subtaskheader: "", subtaskDeadline: null }]);

  const summaryChange = (e)=>{
    setSummary(e.target.value);
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "70vh", p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {activeStep === 0 && (
          <>
          <br></br>
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              error={!!taskNameError}
              helperText={taskNameError}
            />
            <br></br>
            <br></br>
            <TextArea rows={4} value={summary} onChange={summaryChange} placeholder="maxLength is 500" maxLength={500} />
          </>
        )}
        {activeStep === 1 && (
          <>
            {subtasks.map((subtask, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TextField
                  label={`Subtask ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={subtask.subtaskheader}
                  onChange={(e) => handleSubtaskChange(index, "subtaskheader", e.target.value)}
                  sx={{ flex: 1 }}
                />
                <DatePicker
                  showTime
                  onChange={(value) => handleSubtaskChange(index, "subtaskDeadline", value)}
                  style={{ marginLeft: 16, flex: 1 }}
                />
                <Button
                  onClick={() => handleRemoveSubtask(index)}
                  color="error"
                  sx={{ ml: 2 }}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button onClick={addSubtask}>Add Another Subtask</Button>
          </>
        )}
        {activeStep === 2 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Autocomplete
              multiple
              limitTags={2}
              value={selectedOptions}
              onChange={(event, newValue) => {
                setSelectedOptions(newValue);
              }}
              options={options}
              getOptionLabel={(option) => option.value} // Ensure you are using the correct property to display
              renderOption={(props, option) => (
                <li {...props}>
                  {option.value} ({option.empid}) {/* Render the value and empid */}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Assign To" variant="outlined" />
              )}
              sx={{ mb: 2, width: "100%" }}
            />
            <DatePicker
              showTime
              value={deadline}
              onChange={(value) => {
                setDeadline(value);
              }}
              disabled={deadlinedis}
              onOk={(value) => {
                console.log("OK Selected Time: ", value);
              }}
              style={{ width: "100%" }}
            />
            {deadlineError && (
              <Typography color="error" variant="body2">
                {deadlineError}
              </Typography>
            )}
          </Box>
        )}
        {activeStep === 3 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            {/* Center the Box */}
            <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
              <Typography variant="h6">Summary</Typography>
              <Typography>Task Name: {taskName}</Typography>
              <Typography>Subtasks: {subTaskCount}</Typography>
              <Typography>
                Deadline: {deadline ? deadline.format("YYYY-MM-DD HH:mm:ss") : ""}
              </Typography>
              <Typography>
                Selected Options: {selectedOptions.map((option) => option.value).join(", ")}
              </Typography>
              {subtasks.map((subtask, index) => (
                <Typography key={index}>
                  Subtask {index + 1} Deadline: {subtask.subtaskDeadline ? subtask.subtaskDeadline.format("YYYY-MM-DD HH:mm:ss") : "No Deadline"}
                </Typography>
              ))}
            </Box>
          </div>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>

      <LinearProgress
        variant="determinate"
        value={(activeStep / (steps.length - 1)) * 100}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default TaskCreation;

function savetaskdetails(taskdetails) {
  return fetch("http://localhost:8080/webapi/auth/saveTaskDetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      taskdata: taskdetails,
      Accesstoken: sessionStorage.getItem("accesstoken"),
      RefreshToken: sessionStorage.getItem("refreshtoken"),
      username: sessionStorage.getItem("username"),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const respData = JSON.parse(JSON.stringify(data));
      console.log("Status >>", respData);
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
        savetaskdetails(taskdetails);
      } else if (respData.status === "success") {
        console.log("inside success methd");
      }
    })
    .catch((e) => {
      console.log("Error in API", e);
    });
}
