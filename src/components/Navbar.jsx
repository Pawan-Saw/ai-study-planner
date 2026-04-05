import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const [menuOpen, setMenuOpen] = useState(false);

  const active = "bg-black text-white";
  const normal = "bg-white text-black hover:bg-black hover:text-white";
  const base = "px-3 py-2 border-4 border-black font-bold transition text-xs";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    toast.success("Logged out! 👋");
    navigate("/login");
    setMenuOpen(false);
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/planner", label: "📅 Planner" },
    { to: "/dashboard", label: "📊 Dashboard" },
    { to: "/pomodoro", label: "🍅 Pomodoro" },
    { to: "/chat", label: "🤖 AI Chat" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-yellow-300 border-b-4 border-black shadow-[0_6px_0_black]">
      <div className="px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-3 h-3 bg-black hidden sm:block"></div>
          <h1 className="text-xs font-black border-4 border-black px-2 py-1 bg-white hover:bg-black hover:text-white transition">
            AI STUDY PLANNER 🚀
          </h1>
        </NavLink>

        {/* Desktop Nav — only on large screens */}
        <div className="hidden lg:flex gap-2 items-center">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `${base} ${isActive ? active : normal}`}>
              {l.label}
            </NavLink>
          ))}
          {token ? (
            <div className="flex items-center gap-2">
              <div className="border-4 border-black bg-white px-3 py-2 font-bold text-xs">
                👤 {name || "User"}
              </div>
              <button onClick={handleLogout} className="border-4 border-black bg-red-400 px-3 py-2 font-bold text-xs hover:bg-red-600 hover:text-white transition">
                Logout 🚪
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `${base} ${isActive ? active : "bg-green-300 text-black hover:bg-black hover:text-white"}`}>
              Login 🔐
            </NavLink>
          )}
        </div>

        {/* Hamburger — tablet + mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden border-4 border-black bg-white px-3 py-2 font-black text-xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile/Tablet Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t-4 border-black bg-yellow-200 flex flex-col p-4 gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${base} text-center ${isActive ? active : normal}`}
            >
              {l.label}
            </NavLink>
          ))}
          {token ? (
            <>
              <div className="border-4 border-black bg-white px-3 py-2 font-bold text-sm text-center">
                👤 {name || "User"}
              </div>
              <button onClick={handleLogout} className="border-4 border-black bg-red-400 px-3 py-2 font-bold text-sm hover:bg-red-600 transition">
                Logout 🚪
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="border-4 border-black bg-green-300 px-3 py-2 font-bold text-sm text-center">
              Login 🔐
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;