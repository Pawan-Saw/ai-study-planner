import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ ENV se API URL lo
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!email || !password) { toast.error("Fill all fields! 😑"); return; }
    if (isSignup && !name) { toast.error("Enter your name! 😑"); return; }

    setLoading(true);
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup ? { name, email, password } : { email, password };

      const res = await fetch(`${API}${endpoint}`, {   // 🔥 FIXED LINE
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);

        toast.success(isSignup ? "Account created! 🎉" : "Welcome back! 👋");
        navigate("/planner");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error 😢");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-6">
      <div className="border-4 border-black bg-white p-8 w-full max-w-md shadow-[8px_8px_0px_black]">

        <h1 className="text-3xl font-black text-center border-b-4 border-black pb-4 mb-6">
          {isSignup ? "Create Account 🚀" : "Welcome Back 👋"}
        </h1>

        <div className="flex border-4 border-black mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 font-bold text-lg ${!isSignup ? "bg-black text-white" : "bg-white text-black"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 font-bold text-lg ${isSignup ? "bg-black text-white" : "bg-white text-black"}`}
          >
            Sign Up
          </button>
        </div>

        {isSignup && (
          <div className="mb-4">
            <label className="font-black block mb-1">Name 👤</label>
            <input
              className="border-4 border-black p-3 w-full text-lg"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="font-black block mb-1">Email 📧</label>
          <input
            className="border-4 border-black p-3 w-full text-lg"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="font-black block mb-1">Password 🔒</label>
          <input
            className="border-4 border-black p-3 w-full text-lg"
            placeholder="Password..."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="border-4 border-black bg-yellow-300 w-full py-3 text-xl font-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 transition"
        >
          {loading ? "⏳ Loading..." : isSignup ? "Create Account 🚀" : "Login 👋"}
        </button>

        <p className="text-center mt-4 font-bold">
          {isSignup ? "Already have account?" : "Don't have account?"}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="ml-2 underline font-black"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;