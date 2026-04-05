import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const COLORS = ["#4ade80", "#f87171"];

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first! 🔐");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:8080/api/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Failed to fetch tasks!");
        return;
      }

      const data = await res.json();
      // ✅ Array check karo
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Backend error 😢");
      setTasks([]);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login first! 🔐");
      navigate("/login");
      return;
    }
    fetchTasks();
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const pieData = [
    { name: "Completed ✅", value: completed },
    { name: "Pending ⏳", value: pending },
  ];

  const barData = [
    { name: "Total", value: total },
    { name: "Done", value: completed },
    { name: "Pending", value: pending },
  ];

  const bg = dark ? "bg-gray-900 text-white" : "bg-yellow-100 text-black";
  const card = dark ? "bg-gray-800 border-black" : "bg-white border-black";

  return (
    <div className={`min-h-screen p-6 md:p-10 transition-all duration-300 ${bg}`}>

      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap mb-8">
        <h1 className={`text-3xl md:text-4xl font-bold border-4 border-black px-6 py-3 ${card}`}>
          Dashboard 🚀
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className={`border-4 border-black px-4 py-2 font-bold ${dark ? "bg-yellow-300 text-black" : "bg-gray-800 text-white"}`}
        >
          {dark ? "☀️ Light" : "🌑 Dark"}
        </button>
        <button onClick={fetchTasks} className="border-4 border-black px-4 py-2 font-bold bg-blue-300">
          🔄 Refresh
        </button>
        {/* User info */}
        <div className="border-4 border-black bg-yellow-300 px-4 py-2 font-bold">
          👤 {localStorage.getItem("name") || "User"}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
          <p className="text-sm font-bold opacity-60">Total Tasks</p>
          <p className="text-4xl font-bold">{total}</p>
        </div>
        <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
          <p className="text-sm font-bold opacity-60">Completed</p>
          <p className="text-4xl font-bold text-green-500">{completed}</p>
        </div>
        <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
          <p className="text-sm font-bold opacity-60">Pending</p>
          <p className="text-4xl font-bold text-red-500">{pending}</p>
        </div>
        <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
          <p className="text-sm font-bold opacity-60">Progress</p>
          <p className="text-4xl font-bold text-blue-500">{progress}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`border-4 border-black mb-8 ${card} p-4 shadow-[6px_6px_0px_black]`}>
        <p className="font-bold mb-2">Overall Progress</p>
        <div className="border-4 border-black bg-gray-200 h-8">
          <div
            className="bg-green-500 h-full transition-all duration-700 flex items-center justify-center text-white font-bold"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 ? `${progress}%` : ""}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
          <h2 className="text-xl font-bold mb-4">Tasks Distribution 🥧</h2>
          {total === 0 ? (
            <p className="text-center opacity-50 py-10">No tasks yet 😴</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
          <h2 className="text-xl font-bold mb-4">Task Stats 📊</h2>
          {total === 0 ? (
            <p className="text-center opacity-50 py-10">No tasks yet 😴</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] mt-6 ${card}`}>
        <h2 className="text-xl font-bold mb-4">All Tasks 📋</h2>
        {tasks.length === 0 ? (
          <p className="opacity-50">No tasks 😴 — Add some in Planner!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map((t) => (
              <div key={t.id} className={`border-2 border-black p-3 flex justify-between items-center ${t.done ? "opacity-50" : ""}`}>
                <span className={t.done ? "line-through" : ""}>{t.text}</span>
                <span className={`border-2 border-black px-2 py-1 text-sm font-bold ${t.done ? "bg-green-300" : "bg-yellow-300"}`}>
                  {t.done ? "Done ✅" : "Pending ⏳"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;