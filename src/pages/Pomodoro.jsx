import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const MODES = {
  work: { label: "Focus 🎯", time: 25 * 60, color: "bg-red-200" },
  short: { label: "Short Break ☕", time: 5 * 60, color: "bg-green-200" },
  long: { label: "Long Break 🛌", time: 15 * 60, color: "bg-blue-200" },
};

function Pomodoro() {
  const [mode, setMode] = useState("work");
  const [seconds, setSeconds] = useState(MODES.work.time);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [dark, setDark] = useState(false);
  const intervalRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleTimerEnd = () => {
    if (mode === "work") {
      setSessions((prev) => {
        const newSessions = prev + 1;
        toast.success(`Session ${newSessions} complete! 🎉`);
        // Every 4 sessions — long break
        if (newSessions % 4 === 0) {
          switchMode("long");
          toast("Long Break time! 🛌");
        } else {
          switchMode("short");
          toast("Short Break time! ☕");
        }
        return newSessions;
      });
    } else {
      toast("Break over! Back to work 💪");
      switchMode("work");
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setSeconds(MODES[newMode].time);
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSeconds(MODES[mode].time);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const totalTime = MODES[mode].time;
  const progress = ((totalTime - seconds) / totalTime) * 100;

  const bg = dark ? "bg-gray-900 text-white" : `${MODES[mode].color}`;
  const card = dark ? "bg-gray-800" : "bg-white";

  return (
    <div className={`min-h-screen p-10 transition-all duration-300 ${bg}`}>

      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap mb-8">
        <h1 className={`text-4xl font-bold border-4 border-black px-6 py-3 ${card}`}>
          Pomodoro Timer 🍅
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className={`border-4 border-black px-4 py-2 font-bold ${dark ? "bg-yellow-300 text-black" : "bg-gray-800 text-white"}`}
        >
          {dark ? "☀️ Light" : "🌑 Dark"}
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-3 flex-wrap mb-8">
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`border-4 border-black px-4 py-2 font-bold transition ${mode === key ? "bg-black text-white" : `${card} text-black`}`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex flex-col items-center">
        <div className={`relative border-8 border-black w-64 h-64 rounded-full flex items-center justify-center shadow-[8px_8px_0px_black] ${card}`}>
          {/* Progress Ring */}
          <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={mode === "work" ? "#f87171" : mode === "short" ? "#4ade80" : "#60a5fa"}
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          <div className="text-center z-10">
            <div className="text-5xl font-bold">{formatTime(seconds)}</div>
            <div className="text-sm font-bold mt-1 opacity-60">{MODES[mode].label}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setRunning(!running)}
            className={`border-4 border-black px-8 py-3 text-xl font-bold shadow-[4px_4px_0px_black] ${running ? "bg-yellow-400" : "bg-green-400"}`}
          >
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button
            onClick={reset}
            className={`border-4 border-black px-6 py-3 text-xl font-bold shadow-[4px_4px_0px_black] ${card}`}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Sessions Counter */}
      <div className="flex flex-col items-center mt-8">
        <div className={`border-4 border-black px-8 py-4 text-center shadow-[6px_6px_0px_black] ${card}`}>
          <p className="text-sm font-bold opacity-60">Sessions Completed</p>
          <p className="text-5xl font-bold text-red-500">🍅 {sessions}</p>
          <p className="text-sm mt-2 opacity-60">
            {sessions < 4 ? `${4 - sessions} more until long break!` : "Great work today! 🎉"}
          </p>
        </div>

        {/* Session dots */}
        <div className="flex gap-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-6 h-6 border-4 border-black rounded-full ${sessions % 4 >= i ? "bg-red-500" : card}`}
            />
          ))}
        </div>
        <p className="text-sm font-bold mt-2 opacity-60">Every 4 🍅 = Long Break</p>
      </div>

    </div>
  );
}

export default Pomodoro;