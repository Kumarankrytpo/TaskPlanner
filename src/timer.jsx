import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./timer.css";

const Timer = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1); // Increment key to force remount
    }, 60000); // Restart every 2 minutes (120000 milliseconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer-wrapper">
      <svg>
        <defs>
          <linearGradient id="gradient-color" x1="1" y1="0" x2="0" y2="0">
            <stop offset="10%" stopColor="#074173" />
            <stop offset="40%" stopColor="#1679AB" />
            <stop offset="60%" stopColor="#5DEBD7" />
            <stop offset="90%" stopColor="#C5FF95" />
          </linearGradient>
        </defs>
      </svg>
      <div className="timer-container">
        <CountdownCircleTimer
          key={key} // Change key to force remount and restart timer
          isPlaying
          duration={60}
          colors="url(#gradient-color)"
          size={70}
          strokeWidth={7}
          onComplete={() => {
            // do your stuff here
            return { shouldRepeat: true }; // repeat animation in 1.5 seconds
          }}
        >{({ remainingTime }) => remainingTime}</CountdownCircleTimer>
      </div>
    </div>
  );
};

export default Timer;
