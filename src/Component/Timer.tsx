import {useEffect, useState} from "react";

function Timer() {
  const mannualtimer = 1;
  const STORAGE_KEY = "timer_start_time";
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const storedStartTime = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    console.log(now);

    if (storedStartTime) {
      const elapsed = Math.floor((now - Number(storedStartTime)) / 1000);
      const totalSeconds = mannualtimer * 60;
      const remaining = totalSeconds - elapsed;

      if (remaining > 0) {
        setCount(remaining);
        setIsRunning(true);
      } else {
        setCount(0);
        setIsRunning(false);
      }
    } else {
      const startTime = now;
      localStorage.setItem(STORAGE_KEY, String(startTime));
      setCount(mannualtimer * 60);
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && count > 0) {
      timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }

    if (count === 0 && isRunning) {
      setIsRunning(false);
      localStorage.removeItem(STORAGE_KEY);
    }

    return () => clearTimeout(timer);
  }, [count, isRunning]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return (
    <>
      <div style={{fontSize: "2rem"}}>{formatTime(count)}</div>
    </>
  );
}

export default Timer;
