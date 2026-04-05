import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid
} from "recharts";

const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24"];

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

      const res = await fetch("http://localhost:8080/api/tasks", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) { toast.error("Failed to fetch!"); return; }
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Backend error 😢");
      setTasks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, []);

  // Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const highPriority = tasks.filter((t) => t.priority === "HIGH" && !t.done).length;
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.done).length;

  // Chart Data
  const pieData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const barData = [
    { name: "Total", value: total, fill: "#60a5fa" },
    { name: "Done", value: completed, fill: "#4ade80" },
    { name: "Pending", value: pending, fill: "#f87171" },
    { name: "High 🔴", value: highPriority, fill: "#f97316" },
  ];

  // Priority breakdown
  const priorityData = [
    { name: "🔴 High", value: tasks.filter((t) => t.priority === "HIGH").length, fill: "#f87171" },
    { name: "🟡 Medium", value: tasks.filter((t) => t.priority === "MEDIUM").length, fill: "#fbbf24" },
    { name: "🟢 Low", value: tasks.filter((t) => t.priority === "LOW").length, fill: "#4ade80" },
  ];

  // Category breakdown
  const categories = ["Study", "Assignment", "Revision", "Project", "Other"];
  const categoryData = categories.map((c) => ({
    name: c,
    value: tasks.filter((t) => t.category === c).length,
  })).filter((c) => c.value > 0);

  const bg = dark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-yellow-50 to-orange-50 text-black";
  const card = dark ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${bg}`}>

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <h1 className={`text-2xl md:text-3xl font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_black] ${card}`}>
          📊 Dashboard
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] ${dark ? "bg-yellow-300 text-black" : "bg-gray-800 text-white"}`}
        >
          {dark ? "☀️" : "🌑"}
        </button>
        <button
          onClick={fetchTasks}
          className="border-4 border-black px-4 py-2 font-bold bg-blue-300 shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition"
        >
          🔄 Refresh
        </button>
        <div className="border-4 border-black bg-yellow-300 px-4 py-2 font-bold shadow-[4px_4px_0px_black]">
          👤 {localStorage.getItem("name") || "User"}
        </div>
        <button
          onClick={() => navigate("/planner")}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] ${card} hover:bg-black hover:text-white transition`}
        >
          📅 Go to Planner
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-4xl animate-bounce">📊</div>
          <span className="font-black text-xl ml-4">Loading...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: "Total", value: total, color: "bg-blue-300", icon: "📋" },
              { label: "Completed", value: completed, color: "bg-green-300", icon: "✅" },
              { label: "Pending", value: pending, color: "bg-red-300", icon: "⏳" },
              { label: "Progress", value: `${progress}%`, color: "bg-purple-300", icon: "📈" },
              { label: "High Priority", value: highPriority, color: "bg-orange-300", icon: "🔴" },
              { label: "Overdue", value: overdue, color: overdue > 0 ? "bg-red-500 text-white" : "bg-gray-200", icon: "⚠️" },
            ].map((s, i) => (
              <div key={i} className={`border-4 border-black p-3 text-center shadow-[4px_4px_0px_black] ${s.color}`}>
                <div className="text-2xl">{s.icon}</div>
                <div className="text-2xl font-black mt-1">{s.value}</div>
                <div className="text-xs font-bold opacity-70">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className={`border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_black] ${card}`}>
            <div className="flex justify-between mb-2">
              <span className="font-black">Overall Progress</span>
              <span className="font-black">{progress}%</span>
            </div>
            <div className="border-4 border-black bg-gray-200 h-8 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 flex items-center justify-center font-black text-white text-sm ${
                  progress === 100 ? "bg-green-500" : progress > 50 ? "bg-blue-500" : "bg-orange-500"
                }`}
                style={{ width: `${progress}%` }}
              >
                {progress > 10 ? `${progress}%` : ""}
              </div>
            </div>
            <p className="text-xs font-bold opacity-60 mt-2">
              {progress === 100 ? "🎉 All tasks completed!" : progress > 50 ? "💪 More than halfway there!" : "🚀 Keep going!"}
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Pie Chart */}
            <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
              <h2 className="text-xl font-black mb-4 border-b-4 border-black pb-2">
                🥧 Tasks Distribution
              </h2>
              {total === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl">😴</div>
                  <p className="font-bold opacity-50 mt-2">No tasks yet!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar Chart */}
            <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
              <h2 className="text-xl font-black mb-4 border-b-4 border-black pb-2">
                📊 Task Stats
              </h2>
              {total === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl">📭</div>
                  <p className="font-bold opacity-50 mt-2">No data yet!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontWeight: "bold", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontWeight: "bold" }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Priority Chart */}
            <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
              <h2 className="text-xl font-black mb-4 border-b-4 border-black pb-2">
                🎯 Priority Breakdown
              </h2>
              {total === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl">📭</div>
                  <p className="font-bold opacity-50 mt-2">No data yet!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={priorityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontWeight: "bold" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontWeight: "bold", fontSize: 12 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {priorityData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Chart */}
            <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
              <h2 className="text-xl font-black mb-4 border-b-4 border-black pb-2">
                📁 Category Breakdown
              </h2>
              {categoryData.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl">📭</div>
                  <p className="font-bold opacity-50 mt-2">No data yet!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] ${card}`}>
            <h2 className="text-xl font-black mb-4 border-b-4 border-black pb-2">
              📋 All Tasks ({total})
            </h2>
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl">😴</div>
                <p className="font-bold opacity-50 mt-2">No tasks yet — Add some in Planner!</p>
                <button
                  onClick={() => navigate("/planner")}
                  className="mt-4 border-4 border-black bg-yellow-300 px-6 py-2 font-black shadow-[4px_4px_0px_black]"
                >
                  Go to Planner 📅
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className={`border-2 border-black p-3 flex justify-between items-center ${t.done ? "opacity-50" : ""} ${
                      t.priority === "HIGH" && !t.done ? "border-l-4 border-l-red-500" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{t.done ? "✅" : "⏳"}</span>
                      <span className={`font-bold text-sm ${t.done ? "line-through" : ""}`}>{t.text}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <span className={`border-2 border-black px-2 text-xs font-bold ${
                        t.priority === "HIGH" ? "bg-red-300" : t.priority === "MEDIUM" ? "bg-yellow-300" : "bg-green-300"
                      }`}>
                        {t.priority}
                      </span>
                      <span className="border-2 border-black px-2 text-xs font-bold bg-blue-200">{t.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;