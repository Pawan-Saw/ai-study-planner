import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];
const CATEGORIES = ["Study", "Assignment", "Revision", "Project", "Other"];

const priorityColor = {
  HIGH: "bg-red-400 text-white",
  MEDIUM: "bg-yellow-400 text-black",
  LOW: "bg-green-400 text-black",
};

const priorityIcon = {
  HIGH: "🔴",
  MEDIUM: "🟡",
  LOW: "🟢",
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

const getAuthHeader = () => ({
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

function Planner() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Study");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login first! 🔐");
      navigate("/login");
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tasks", {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data.map((t) => ({
        id: t.id.toString(),
        text: t.text,
        done: t.done,
        priority: t.priority || "MEDIUM",
        dueDate: t.dueDate || "",
        category: t.category || "Study",
      })) : []);
    } catch {
      toast.error("Backend error 😢");
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!task) { toast.error("Enter something 😑"); return; }
    await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ text: task, done: false, priority, dueDate: dueDate || null, category }),
    });
    toast.success("Task Added 🚀");
    setTask("");
    setDueDate("");
    setShowForm(false);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    toast("Deleted ❌");
    fetchTasks();
  };

  const toggleTask = async (t) => {
    await fetch(`http://localhost:8080/api/tasks/${t.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ ...t, done: !t.done }),
    });
    fetchTasks();
  };

  const saveEdit = async (id) => {
    const t = tasks.find((x) => x.id === id);
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ ...t, text: editText }),
    });
    toast.success("Updated ✏️");
    setEditId(null);
    fetchTasks();
  };

  const getAISuggestion = async (task) => {
    setSelectedTask(task);
    setSuggestion("");
    setSuggestionLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `I have a study task: "${task.text}". Give me 3 specific, actionable tips to complete this task effectively. Keep each tip short (1-2 lines max). Format as numbered list.`,
        }),
      });
      const raw = await res.text();
      const parsed = JSON.parse(raw);
      const text = parsed.candidates[0].content.parts[0].text;
      setSuggestion(text.replace(/\*\*/g, "").replace(/\*/g, ""));
    } catch {
      setSuggestion("Error getting suggestions 😢");
    }
    setSuggestionLoading(false);
  };

  const generateAIPlan = async () => {
    if (!task) { toast.error("Enter topic first 🤖"); return; }
    setAiLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Give me 5 short study tasks for: ${task}. Return ONLY a numbered list, nothing else.`,
        }),
      });
      const raw = await res.text();
      const parsed = JSON.parse(raw);
      const text = parsed.candidates[0].content.parts[0].text;
      const lines = text.split("\n")
        .map((l) => l.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "").trim())
        .filter((l) => l.length > 0);
      for (const line of lines) {
        await fetch("http://localhost:8080/api/tasks", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ text: line, done: false, priority, category }),
        });
      }
      toast.success("AI Plan Generated 🤖");
      setTask("");
      setShowForm(false);
      fetchTasks();
    } catch {
      toast.error("AI Error 😢");
    }
    setAiLoading(false);
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const completed = tasks.filter((t) => t.done).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.done;
      if (filter === "pending") return !t.done;
      if (["HIGH", "MEDIUM", "LOW"].includes(filter)) return t.priority === filter;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...filteredTasks];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTasks(reordered);
  };

  const bg = dark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-green-100 to-emerald-200 text-black";
  const card = dark ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${bg}`}>

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <h1 className={`text-2xl md:text-3xl font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_black] ${card}`}>
          📅 Study Planner
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] ${dark ? "bg-yellow-300 text-black" : "bg-gray-800 text-white"}`}
        >
          {dark ? "☀️" : "🌑"}
        </button>
        <div className="border-4 border-black bg-yellow-300 px-4 py-2 font-bold shadow-[4px_4px_0px_black]">
          👤 {localStorage.getItem("name") || "User"}
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] ${card}`}
        >
          📊 Dashboard
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: tasks.length, color: "bg-blue-300" },
          { label: "Done ✅", value: completed, color: "bg-green-300" },
          { label: "Pending ⏳", value: tasks.length - completed, color: "bg-red-300" },
        ].map((s, i) => (
          <div key={i} className={`border-4 border-black p-3 text-center shadow-[4px_4px_0px_black] ${s.color}`}>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs font-bold opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className={`border-4 border-black mb-6 p-3 shadow-[4px_4px_0px_black] ${card}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-black text-sm">Overall Progress</span>
          <span className="font-black text-sm">{progress}%</span>
        </div>
        <div className="border-4 border-black bg-gray-200 h-6 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 flex items-center justify-center text-white font-black text-xs ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${progress}%` }}
          >
            {progress > 15 ? `${progress}%` : ""}
          </div>
        </div>
      </div>

      {/* Search + Add Button Row */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          className={`flex-1 border-4 border-black p-3 font-bold min-w-[200px] shadow-[4px_4px_0px_black] ${card}`}
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="border-4 border-black bg-yellow-300 px-6 py-3 font-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition"
        >
          {showForm ? "✕ Close" : "+ Add Task"}
        </button>
      </div>

      {/* Add Task Form — Collapsible */}
      {showForm && (
        <div className={`border-4 border-black p-4 mb-4 shadow-[6px_6px_0px_black] ${card}`}>
          <h3 className="font-black text-lg mb-3">➕ New Task</h3>
          <div className="flex flex-wrap gap-2">
            <input
              className={`border-4 border-black p-2 font-bold flex-1 min-w-[200px] ${card}`}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Enter task or topic..."
            />
            <select className="border-4 border-black p-2 font-bold text-black" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{priorityIcon[p]} {p}</option>)}
            </select>
            <select className="border-4 border-black p-2 font-bold text-black" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="date"
              className="border-4 border-black p-2 font-bold text-black"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={addTask}
              className="border-4 border-black bg-yellow-300 px-6 py-2 font-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition"
            >
              ✅ Add Task
            </button>
            <button
              onClick={generateAIPlan}
              disabled={aiLoading}
              className="border-4 border-black bg-purple-300 px-6 py-2 font-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition"
            >
              {aiLoading ? "⏳ Generating..." : "🤖 AI Generate"}
            </button>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-4">
        {[
          { key: "all", label: "All 📋" },
          { key: "completed", label: "Done ✅" },
          { key: "pending", label: "Pending ⏳" },
          { key: "HIGH", label: "🔴 High" },
          { key: "MEDIUM", label: "🟡 Medium" },
          { key: "LOW", label: "🟢 Low" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`border-4 border-black px-3 py-1 font-bold text-sm shadow-[3px_3px_0px_black] transition ${
              filter === f.key ? "bg-black text-white" : `${card} hover:bg-black hover:text-white`
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task Count */}
      <p className="font-bold text-sm opacity-60 mb-3">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {/* Task List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
              {filteredTasks.length === 0 && (
                <div className={`border-4 border-black p-8 text-center shadow-[4px_4px_0px_black] ${card}`}>
                  <div className="text-4xl mb-2">😴</div>
                  <p className="font-black text-lg">No tasks found!</p>
                  <p className="font-bold opacity-60 text-sm">Add a task or change filter</p>
                </div>
              )}
              {filteredTasks.map((t, index) => (
                <Draggable key={t.id} draggableId={t.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`border-4 border-black p-4 shadow-[6px_6px_0px_black] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] ${card} ${
                        t.done ? "opacity-70" : ""
                      } ${isOverdue(t.dueDate) && !t.done ? "border-red-500 border-l-8" : ""}`}
                    >
                      {editId === t.id ? (
                        <div className="flex gap-2 flex-wrap">
                          <input
                            className="border-2 border-black p-2 flex-1 text-black font-bold min-w-[150px]"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit(t.id)}
                          />
                          <button onClick={() => saveEdit(t.id)} className="border-2 border-black bg-green-400 px-3 py-1 font-bold">Save ✅</button>
                          <button onClick={() => setEditId(null)} className="border-2 border-black bg-gray-300 px-3 py-1 font-bold">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex gap-3 items-start flex-1">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={t.done}
                              onChange={() => toggleTask(t)}
                              className="w-6 h-6 cursor-pointer mt-1 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className={`font-bold text-base md:text-lg ${t.done ? "line-through opacity-50" : ""}`}>
                                {t.text}
                              </p>
                              {/* Badges */}
                              <div className="flex gap-2 mt-2 flex-wrap">
                                <span className={`border-2 border-black px-2 py-0.5 text-xs font-black ${priorityColor[t.priority]}`}>
                                  {priorityIcon[t.priority]} {t.priority}
                                </span>
                                <span className="border-2 border-black px-2 py-0.5 text-xs font-black bg-blue-200">
                                  📁 {t.category}
                                </span>
                                {t.dueDate && (
                                  <span className={`border-2 border-black px-2 py-0.5 text-xs font-black ${isOverdue(t.dueDate) && !t.done ? "bg-red-300 animate-pulse" : "bg-gray-200"}`}>
                                    📅 {t.dueDate} {isOverdue(t.dueDate) && !t.done ? "⚠️ OVERDUE" : ""}
                                  </span>
                                )}
                                {t.done && (
                                  <span className="border-2 border-black px-2 py-0.5 text-xs font-black bg-green-300">
                                    ✅ Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => { setEditId(t.id); setEditText(t.text); }}
                              className="border-2 border-black bg-blue-300 px-2 py-1 font-bold text-sm hover:bg-blue-400 transition"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => getAISuggestion(t)}
                              className="border-2 border-black bg-purple-300 px-2 py-1 font-bold text-sm hover:bg-purple-400 transition"
                              title="AI Suggestion"
                            >
                              🤖
                            </button>
                            <button
                              onClick={() => deleteTask(t.id)}
                              className="border-2 border-black bg-red-400 px-2 py-1 font-bold text-sm hover:bg-red-500 transition"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* AI SUGGESTION PANEL */}
      {selectedTask && (
        <div className={`mt-6 border-4 border-black p-6 shadow-[6px_6px_0px_black] ${card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black">🤖 AI Suggestions</h3>
            <button
              onClick={() => { setSelectedTask(null); setSuggestion(""); }}
              className="border-2 border-black bg-red-300 px-3 py-1 font-bold hover:bg-red-400 transition"
            >
              ✕ Close
            </button>
          </div>

          <div className={`border-2 border-black p-3 mb-4 ${dark ? "bg-gray-700" : "bg-purple-100"}`}>
            <p className="font-bold text-xs opacity-60 mb-1">📋 Task:</p>
            <p className="font-bold">{selectedTask.text}</p>
          </div>

          {suggestionLoading ? (
            <div className="flex gap-2 items-center py-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="font-bold ml-2 opacity-60">AI thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-bold leading-relaxed text-sm md:text-base">
              {suggestion}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => getAISuggestion(selectedTask)}
              className="border-2 border-black bg-purple-300 px-4 py-2 font-bold text-sm hover:bg-purple-400 transition shadow-[3px_3px_0px_black]"
            >
              🔄 Regenerate
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Task: ${selectedTask.text}\n\nAI Tips:\n${suggestion}`);
                toast.success("Copied! 📋");
              }}
              className="border-2 border-black bg-green-300 px-4 py-2 font-bold text-sm hover:bg-green-400 transition shadow-[3px_3px_0px_black]"
            >
              📋 Copy Tips
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Planner;