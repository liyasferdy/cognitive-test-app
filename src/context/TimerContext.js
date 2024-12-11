import React, { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Check if there's a saved timer in localStorage (if any)
    const savedTimer = localStorage.getItem("testTimer");
    return savedTimer ? parseInt(savedTimer, 10) : 900; // Default to 15 minutes (900 seconds)
  });

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isTimerRunning) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          localStorage.setItem("testTimer", newTimeLeft); // Store updated time in localStorage

          if (newTimeLeft <= 0) {
            clearInterval(timerInterval); // Stop timer at 0
            setIsTimerRunning(false);
          }
          return newTimeLeft;
        });
      }, 1000);

      // Cleanup the interval when the component unmounts or timer stops
      return () => clearInterval(timerInterval);
    }
  }, [isTimerRunning]);

  const startTimer = () => setIsTimerRunning(true);
  const stopTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setTimeLeft(900); // Reset to 15 minutes (900 seconds)
    localStorage.setItem("testTimer", 900);
    setIsTimerRunning(false);
  };

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        isTimerRunning,
        startTimer,
        stopTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  return useContext(TimerContext);
};
