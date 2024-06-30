import { useEffect, useState } from "react";
import { AutoComplete, DatePicker } from "antd";
import { GlobalContext } from "./utils/GlobalContext";
import { useContext } from "react";

function TaskCreation() {
  const [numberOfFields, setNumberOfFields] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const {userRole} = useContext(GlobalContext);
  // Function to handle input value change
  const handleInputChange = (index, event) => {
    const values = [...inputValues];
    values[index] = event.target.value;
    setInputValues(values);
    console.log("inputValues >>>", inputValues);
  };

  

  // Function to handle adding fields
  const addFields = () => {
    setNumberOfFields(numberOfFields + 1);
    setInputValues([...inputValues, ""]); // Add an empty string for the new input field
  };

  const removeFields = (key) => {
    inputValues.splice(key, 1);
    setNumberOfFields(numberOfFields - 1);
    console.log("inputValues>>>>", inputValues);
  };
  const [options, setOptions] = useState([
    { value: "kumaran", label: "Kumaran" },
    { value: "dinesh", label: "Dinesh" },
    { value: "samuvel", label: "Samuvel" },
  ]);
  const getPanelValue = (searchText) =>
    !searchText
      ? []
      : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
  const onSelect = (data) => {
    console.log("onSelect", data);
  };

  const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
  });
  return (
    <div>
      <div>
        <h1>Task Creation</h1>
        <h3>Subject</h3>
        <input></input>
        <br></br>
        <br></br>
        <button onClick={addFields}>Add Subtopic</button>
        {Array.from({ length: numberOfFields }).map((_, index) => (
          <div key={index}>
            <h3>Add SubTopic{index}</h3>
            <input
              type="text"
              value={inputValues[index] || ""}
              onChange={(event) => handleInputChange(index, event)}
            />
            <button onClick={removeFields}>Remove</button>
          </div>
        ))}

        <h3>Assign to</h3>
        <AutoComplete
          options={options}
          style={{
            width: 200,
          }}
          onSelect={onSelect}
          onSearch={(text) => setOptions(getPanelValue(text))}
          placeholder="input here"
        />

        <h3>Deadline</h3>
        <DatePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />
        <br></br>
        <br></br>
        <button>Assign to Username</button>
      </div>
    </div>
  );
}

export default TaskCreation;
