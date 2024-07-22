import React, { useState , useEffect,useContext } from 'react';
import { Table, Input, Button, Rate, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { GlobalContext } from './utils/GlobalContext';
import { useNavigate } from "react-router-dom";

const data = [
  {
    taskid: 1,
    subject: 'Subject 1',
    deadline: '2024-07-21 10:00',
    completeddate: '2024-07-20 11:00',
    subtaskcount: 2,
    rating: 3,
  },
  {
    taskid: 2,
    subject: 'Subject 2',
    deadline: '2024-07-22 11:00',
    completeddate: '2024-07-21 12:00',
    subtaskcount: 3,
    rating: 4,
  },
  {
    taskid: 3,
    subject: 'Subject 3',
    deadline: '2024-07-23 12:00',
    completeddate: '2024-07-22 13:00',
    subtaskcount: 1,
    rating: 5,
  },
  // Add more data as needed
];

const TaskHistory = ({mainPageHandle}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { empCode, userName } = useContext(GlobalContext);
  const navigation = useNavigate();

  const handleSearch = () => {
    const filtered = data.filter(item =>
      item.subject.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(()=>{
    const fetchtaskdata = async ()=>{
      const data =await taskdata(userName,empCode,navigation);
      setFilteredData(data);
    }

    fetchtaskdata();
  },[])

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'taskid',
      key: 'taskid',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Subject"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: '100%' }}
          >
            Search
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.subject.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Completed Date',
      dataIndex: 'completeddate',
      key: 'completeddate',
    },
    {
      title: 'Subtask Count',
      dataIndex: 'subtaskcount',
      key: 'subtaskcount',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: rating => (
        <Rate value={rating} disabled allowHalf />
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Subject"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
          Search
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 11 }}
        scroll={{ x: '100%' }}
        rowKey="taskid"
      />
    </div>
  );
};

export default TaskHistory;

const taskdata =async (userName,empCode,navigation)=>{
  var taskarr = [];
  try{
    const response = await fetch("http://localhost:8080/webapi/auth/getCompleteTask",{
      method: "POST",
      body: JSON.stringify({
        username: userName,
        Accesstoken: sessionStorage.getItem("accesstoken"),
        RefreshToken: sessionStorage.getItem("refreshtoken"),
        empcode: empCode
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if(!response.ok){
      throw new Error("API Not Hit");
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
      if (Array.isArray(respData.taskdata.myArrayList)) {
        taskarr = respData.taskdata.myArrayList.map((item) => item.map);
      }
    }
  }catch(e){
    console.log(e);
  }
  console.log("after api ht",taskarr);
  return taskarr;
}