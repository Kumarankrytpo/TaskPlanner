import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import { AreaChart, Area } from "recharts";
import './TaskDashboard.css';

const weeklyData = [
  [
    { name: "SUN", tasks: 60 },
    { name: "MON", tasks: 20 },
    { name: "TUE", tasks: 10 },
    { name: "WED", tasks: 80 },
    { name: "THU", tasks: 100 },
    { name: "FRI", tasks: 40 },
  ],
  [
    { name: "SUN", tasks: 30 },
    { name: "MON", tasks: 10 },
    { name: "TUE", tasks: 20 },
    { name: "WED", tasks: 40 },
    { name: "THU", tasks: 0 },
    { name: "FRI", tasks: 70 },
  ],
  [
    { name: "SUN", tasks: 20 },
    { name: "MON", tasks: 30 },
    { name: "TUE", tasks: 10 },
    { name: "WED", tasks: 20 },
    { name: "THU", tasks: 30 },
    { name: "FRI", tasks: 10 },
  ],
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const monthlyData = {
  JAN: {
    "member 1": 10,
    "member 2": 80,
    "member 3": 70,
    "member 4": 30,
  },
  FEB: {
    "member 1": 20,
    "member 2": 70,
    "member 3": 60,
    "member 4": 40,
  },
  MAR: {
    "member 1": 30,
    "member 2": 60,
    "member 3": 50,
    "member 4": 50,
  },
  APRIL: {
    "member 1": 40,
    "member 2": 50,
    "member 3": 40,
    "member 4": 60,
  },
};

const areaData = [
  {
    "Member 1": { JAN: 10, FEB: 20, MAR: 40, APR: 50 },
    "Member 2": { JAN: 10, FEB: 30, MAR: 90, APR: 10 },
    "Member 3": { JAN: 10, FEB: 70, MAR: 30, APR: 20 },
    "Member 4": { JAN: 10, FEB: 30, MAR: 47, APR: 53 },
  },
];

const multiLineData = [
  {
    name: "JAN",
    "Member 1": 40,
    "Member 2": 30,
    "Member 3": 20,
    "Member 4": 27,
  },
  {
    name: "FEB",
    "Member 1": 30,
    "Member 2": 20,
    "Member 3": 10,
    "Member 4": 28,
  },
  {
    name: "MAR",
    "Member 1": 20,
    "Member 2": 10,
    "Member 3": 40,
    "Member 4": 19,
  },
  {
    name: "APR",
    "Member 1": 27,
    "Member 2": 39,
    "Member 3": 30,
    "Member 4": 25,
  },
];

const TaskDashboard = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("JAN");
  const [selectedOption, setSelectedOption] = useState("Option 1");
  const [selectedMember, setSelectedMember] = useState("Member 1");

  useEffect(() => {
    console.log(`Rendering week ${currentWeek + 1}`);
  }, [currentWeek]);

  useEffect(() => {
    console.log(`Rendering month ${currentMonth}`);
  }, [currentMonth]);

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => (prevWeek > 0 ? prevWeek - 1 : 0));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) =>
      prevWeek < weeklyData.length - 1 ? prevWeek + 1 : prevWeek
    );
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleMemberChange = (event) => {
    setSelectedMember(event.target.value);
  };

  const memberData = Object.entries(areaData[0][selectedMember]).map(([month, tasks]) => ({
    month,
    tasks,
  }));

  return (
    <div className="task-chart-container">
      <div className="chart-row">
        <div className="chart-column">
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              style={{
                backgroundColor: "#e94560",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
            </select>
          </div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              style={{
                backgroundColor: "#e94560",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                marginRight: "10px",
                pointerEvents: "auto",
              }}
              onClick={handlePrevWeek}
              disabled={currentWeek === 0}
            >
              &lt;
            </button>
            <span>Week {currentWeek + 1}</span>
            <button
              style={{
                backgroundColor: "#e94560",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                marginLeft: "10px",
                pointerEvents: "auto",
              }}
              onClick={handleNextWeek}
              disabled={currentWeek === weeklyData.length - 1}
            >
              &gt;
            </button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer className={'chart-container'}>
              <BarChart
                data={weeklyData[currentWeek]}
                margin={{ top: 50, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2c2c54", border: "none" }}
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                />
                <Bar dataKey="tasks" fill="#e94560" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-column">
        <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {Object.keys(monthlyData).map((month) => (
              <button
                key={month}
                onClick={() => setCurrentMonth(month)}
                style={{
                  backgroundColor:
                    currentMonth === month ? "#e94560" : "#333",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  margin: "0 5px",
                }}
              >
                {month}
              </button>
            ))}
          </div>
          <ResponsiveContainer className={'chart-container'}>
            <PieChart>
              <Pie
                dataKey="value"
                data={Object.entries(monthlyData[currentMonth]).map(
                  ([name, value]) => ({ name, value })
                )}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#e94560"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {Object.entries(monthlyData[currentMonth]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip
                contentStyle={{ backgroundColor: "#2c2c54", border: "none" }}
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-column">
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              value={selectedMember}
              onChange={handleMemberChange}
              style={{
                backgroundColor: "#e94560",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              <option value="Member 1">Member 1</option>
              <option value="Member 2">Member 2</option>
              <option value="Member 3">Member 3</option>
              <option value="Member 4">Member 4</option>
            </select>
          </div>
          <ResponsiveContainer className={'chart-container'}>
            <AreaChart data={memberData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" tick={{ fill: "#ccc" }} />
              <YAxis tick={{ fill: "#ccc" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#2c2c54", border: "none" }}
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#e94560"
                fill="#e94560"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="full-width-chart">
        <ResponsiveContainer>
          <LineChart data={multiLineData} margin={{ top: 50, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#2c2c54", border: "none" }}
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
            <Line type="monotone" dataKey="Member 1" stroke="#e94560" />
            <Line type="monotone" dataKey="Member 2" stroke="#8884d8" />
            <Line type="monotone" dataKey="Member 3" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Member 4" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskDashboard;
