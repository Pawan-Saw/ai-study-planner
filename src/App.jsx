import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pomodoro from "./pages/Pomodoro";
import AiChat from "./pages/AiChat";

import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* 🔥 Navbar */}
      <Navbar />

      {/* 🔥 Toast System */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "3px solid black",
            padding: "10px",
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
          },
        }}
      />

      {/* 🔥 Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/chat" element={<AiChat />} />
      </Routes>
    </>
  );
}

export default App;