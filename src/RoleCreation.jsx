import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import { GlobalContext } from './utils/GlobalContext';
import { useNavigate } from "react-router-dom";

const getRoleDetails = async (userName, navigation) => {
  var arr = [];
  try {
    const response = await fetch("http://localhost:8080/webapi/auth/getRoleDetails", {
      method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username"),
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
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
        "Session storage accesstoken refreshed",
        sessionStorage.getItem("accesstoken")
      );
    } else if (respData.status === "success") {
      console.log("After user list API hit >>>", respData.roledetails);
      if (Array.isArray(respData.roledetails.myArrayList)) {
        arr = respData.roledetails.myArrayList.map((item) => item.map);
      }
    }
  } catch (e) {
    console.error("There was a problem with the fetch operation:", e);
  }
  return arr;
}

const saveroles = async (rows, userName, navigation) => {
  try {
    const response = await fetch("http://localhost:8080/webapi/auth/saveRoles", {
      method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        username: sessionStorage.getItem("username"),
        roledetails: rows,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    });

    if (!response.ok) {
      throw new Error("Error in API");
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
      console.log("details saved");
    }
  } catch (e) {
    console.log(e);
  }
}

const RoleCreation = ({ mainPageHandle }) => {
  console.log("INSIDE ROLE CREATION");

  const [rows, setRows] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIdx, setEditIdx] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const { userName } = useContext(GlobalContext);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const roleDetails = await getRoleDetails(userName, navigation);
      setRows(roleDetails);
    };
    fetchData();
  }, [userName, navigation]);

  const handleAdd = () => {
    setRows(prevRows => [...prevRows, { value: inputValue }]);
    console.log("ROWS>>",rows);
    setInputValue('');
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditValue(rows[idx].value);
  };

  const handleSave = (idx) => {
    const updatedRows = rows.map((row, i) => (i === idx ? { value: editValue } : row));
    setRows(updatedRows);
    setEditIdx(-1);
    setEditValue('');
  };

  const handleDelete = (idx) => {
    setRows(rows.filter((row, i) => i !== idx));
  };

  const savechange = () => {
    console.log("ROWS>>>",rows);
    saveroles(rows, userName, navigation);
    mainPageHandle();
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          label="Enter Value"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
        <Button variant="contained" color="primary" style={{ marginLeft: '20px' }} onClick={savechange}>
          Save Changes
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {editIdx === idx ? (
                    <TextField
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      variant="outlined"
                    />
                  ) : (
                    row.value
                  )}
                </TableCell>
                <TableCell align="right">
                  {editIdx === idx ? (
                    <Tooltip title="Save">
                      <IconButton color="primary" onClick={() => handleSave(idx)}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleEdit(idx)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="secondary" onClick={() => handleDelete(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RoleCreation;
