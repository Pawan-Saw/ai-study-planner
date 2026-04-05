import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MODES = {
  work: { label: "Focus 🎯", time: 25 * 60, color: "bg-gradient-to-br from-red-200 to-orange-200", ring: "#f87171" },
  short: { label: "Short Break ☕", time: 5 * 60, color: "bg-gradient-to-br from-green-200 to-emerald-200", ring: "#4ade80" },
  long: { label: "Long Break 🛌", time: 15 * 60, color: "bg-gradient-to-br from-blue-200 to-indigo-200", ring: "#60a5fa" },
};

function Pomodoro() {
  const [mode, setMode] = useState("work");
  const [seconds, setSeconds] = useState(MODES.work.time);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [dark, setDark] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Update tab title
  useEffect(() => {
    document.title = running ? `${formatTime(seconds)} — ${MODES[mode].label}` : "Pomodoro 🍅";
    return () => { document.title = "AI Study Planner 🚀"; };
  }, [seconds, running]);

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
          if (mode === "work") {
            setTotalFocusTime((t) => t + 1);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const handleTimerEnd = () => {
    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Timer 🍅", {
        body: mode === "work" ? "Focus session complete! Take a break! ☕" : "Break over! Time to focus! 🎯",
      });
    }

    if (mode === "work") {
      setSessions((prev) => {
        const newSessions = prev + 1;
        toast.success(`Session ${newSessions} complete! 🎉`, { duration: 4000 });
        if (newSessions % 4 === 0) {
          switchMode("long");
          toast("Long Break time! 🛌", { icon: "🛌" });
        } else {
          switchMode("short");
          toast("Short Break time! ☕", { icon: "☕" });
        }
        return newSessions;
      });
    } else {
      toast("Break over! Back to work 💪", { icon: "💪" });
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

  const setCustomTimer = () => {
    const mins = parseInt(customMinutes);
    if (!mins || mins < 1 || mins > 120) {
      toast.error("Enter 1-120 minutes!");
      return;
    }
    setSeconds(mins * 60);
    setRunning(false);
    setShowCustom(false);
    setCustomMinutes("");
    toast.success(`Custom timer set: ${mins} minutes! ⏱️`);
  };

  const requestNotification = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const formatFocusTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const totalTime = MODES[mode].time;
  const currentProgress = ((totalTime - seconds) / totalTime) * 100;

  const bg = dark ? "bg-gray-900 text-white" : MODES[mode].color;
  const card = dark ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${bg}`}>

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <h1 className={`text-2xl md:text-3xl font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_black] ${card}`}>
          🍅 Pomodoro Timer
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] ${dark ? "bg-yellow-300 text-black" : "bg-gray-800 text-white"}`}
        >
          {dark ? "☀️" : "🌑"}
        </button>
        <button
          onClick={requestNotification}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] bg-purple-300`}
          title="Enable notifications"
        >
          🔔 Notify
        </button>
        <button
          onClick={() => navigate("/planner")}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] ${card}`}
        >
          📅 Planner
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] ${
              mode === key ? "bg-black text-white" : `${card}`
            }`}
          >
            {val.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] bg-yellow-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition`}
        >
          ⏱️ Custom
        </button>
      </div>

      {/* Custom Timer Input */}
      {showCustom && (
        <div className={`border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_black] ${card} flex gap-2 items-center flex-wrap`}>
          <span className="font-black">Set custom time:</span>
          <input
            type="number"
            min="1"
            max="120"
            className="border-4 border-black p-2 w-24 font-bold text-black"
            placeholder="mins"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setCustomTimer()}
          />
          <span className="font-bold">minutes</span>
          <button
            onClick={setCustomTimer}
            className="border-4 border-black bg-green-400 px-4 py-2 font-bold shadow-[3px_3px_0px_black]"
          >
            ✅ Set
          </button>
        </div>
      )}

      {/* Main Timer */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

        {/* Timer Circle */}
        <div className="flex flex-col items-center">
          <div className={`relative border-8 border-black w-64 h-64 md:w-72 md:h-72 rounded-full flex items-center justify-center shadow-[10px_10px_0px_black] ${card}`}>
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="5" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={MODES[mode].ring}
                strokeWidth="5"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * currentProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            <div className="text-center z-10">
              <div className={`text-5xl md:text-6xl font-black ${running ? "text-black" : "opacity-70"}`}>
                {formatTime(seconds)}
              </div>
              <div className="text-sm font-bold mt-2 opacity-60">{MODES[mode].label}</div>
              {running && (
                <div className="mt-2 flex justify-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setRunning(!running)}
              className={`border-4 border-black px-8 py-3 text-xl font-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition ${
                running ? "bg-yellow-400" : "bg-green-400"
              }`}
            >
              {running ? "⏸ Pause" : "▶ Start"}
            </button>
            <button
              onClick={reset}
              className={`border-4 border-black px-6 py-3 text-xl font-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition ${card}`}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="flex flex-col gap-4 w-full max-w-xs">

          {/* Sessions */}
          <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
            <p className="text-xs font-black opacity-60 mb-2">SESSIONS TODAY</p>
            <p className="text-4xl font-black text-red-500">🍅 {sessions}</p>
            <p className="text-xs font-bold opacity-60 mt-1">
              {sessions < 4 ? `${4 - sessions} more until long break` : "Amazing work! 🎉"}
            </p>
          </div>

          {/* Focus Time */}
          <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
            <p className="text-xs font-black opacity-60 mb-2">TOTAL FOCUS TIME</p>
            <p className="text-3xl font-black text-blue-500">⏱️ {formatFocusTime(totalFocusTime)}</p>
            <p className="text-xs font-bold opacity-60 mt-1">Keep it up! 💪</p>
          </div>

          {/* Current Mode */}
          <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${
            mode === "work" ? "bg-red-200" : mode === "short" ? "bg-green-200" : "bg-blue-200"
          }`}>
            <p className="text-xs font-black opacity-60 mb-2">CURRENT MODE</p>
            <p className="text-2xl font-black">{MODES[mode].label}</p>
            <p className="text-xs font-bold opacity-60 mt-1">
              {mode === "work" ? "Stay focused! 🎯" : mode === "short" ? "Rest your eyes 👀" : "Take a proper break! 🛌"}
            </p>
          </div>

          {/* Session Progress */}
          <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
            <p className="text-xs font-black opacity-60 mb-3">SESSION PROGRESS</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 border-4 border-black flex items-center justify-center font-black text-sm transition-all ${
                    sessions % 4 >= i ? "bg-red-500 text-white" : dark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {sessions % 4 >= i ? "🍅" : i}
                </div>
              ))}
            </div>
            <p className="text-xs font-bold opacity-60 mt-2 text-center">Every 4 🍅 = Long Break 🛌</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={`mt-8 border-4 border-black p-4 shadow-[4px_4px_0px_black] ${card}`}>
        <p className="font-black mb-3">💡 Pomodoro Tips:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: "🎯", tip: "Focus on ONE task per session" },
            { icon: "📵", tip: "No phone during focus time" },
            { icon: "☕", tip: "Use breaks to stretch & hydrate" },
          ].map((t, i) => (
            <div key={i} className={`border-2 border-black p-3 flex gap-2 items-center ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
              <span className="text-2xl">{t.icon}</span>
              <span className="font-bold text-sm">{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Pomodoro;