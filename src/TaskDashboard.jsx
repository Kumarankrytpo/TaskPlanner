import { useEffect, useState } from "react";
import { FaAnglesDown ,FaCheck   } from "react-icons/fa6";

function TaskDashboard(){
    console.log("inside task dashboard");
    const [taskdetails,setTaskDetails] = useState([]);
    const [expandedTaskIndex, setExpandedTaskIndex] = useState(null); 
    useEffect(()=>{
      setTaskDetails([{
        TaskName : "Task 1",
        SubTaskCount : 0,
        Deadline : "2024-07-13 22:00"
      },
      {
        TaskName : "Task 2",
        SubTaskCount : 1,
        Subtaskdetails :[{
          subtaskheader : "SUBTASK1",
          Deadline : "2024-07-13 22:00"
        },{
          subtaskheader : "SUBTASK2",
          Deadline : "2024-07-13 22:00"
        }]
      },
      {
        TaskName : "Task 3",
        SubTaskCount : 0,
        Deadline : "2024-07-13 22:00"
      },
    ])
    }, [])

    const toggleSubtasks = (index) => {
      // Toggle the expanded state for the clicked task
      if (expandedTaskIndex === index) {
        setExpandedTaskIndex(null);
      } else {
        setExpandedTaskIndex(index);
      }
    };

    const getDeviation = (deadline)=>{
       const currentDate = new Date();
       const deadlinedate = new Date(deadline);
       console.log("currentDate<deadlinedate",currentDate<deadlinedate)
       return currentDate >= deadlinedate;
    }

  return (
    <div>
      <div>
        {taskdetails.map((item, index) => (
          <div key={index}>
            {getDeviation(item.deadline) && <div><div>
            <h3>{item.TaskName}  {item.SubTaskCount!==0 && <button onClick={() => toggleSubtasks(index)}><span><FaAnglesDown /></span></button>}
            {item.SubTaskCount===0  && <p>Deviation in : {item.Deadline}</p>}
            {item.SubTaskCount===0 && 
              <button>Completed<span><FaCheck /></span></button>
              }</h3>
            </div>
            {expandedTaskIndex === index && item.Subtaskdetails && (
            <div>
              {item.Subtaskdetails.map((subtask, subIndex) => (
                <div key={subIndex}>
                  <p>{subtask.subtaskheader} <button>Completed<span><FaCheck /></span></button></p>
                </div>
              ))}
            </div>
          )}</div>
          }
           
          </div>
        ))}
      </div>
    </div>
  )
}


export default TaskDashboard;