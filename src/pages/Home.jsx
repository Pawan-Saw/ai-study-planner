import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "📅",
    title: "Smart Planner",
    desc: "Add, edit, delete tasks with priority, due dates & categories",
    link: "/planner",
    color: "bg-green-300",
    stats: "Priority & Due Dates",
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    desc: "Chat with Gemini AI for study help & generate smart study plans",
    link: "/chat",
    color: "bg-purple-300",
    stats: "Powered by Gemini",
  },
  {
    icon: "🍅",
    title: "Pomodoro Timer",
    desc: "Stay focused with 25min sessions & automatic break reminders",
    link: "/pomodoro",
    color: "bg-red-300",
    stats: "25min Focus Sessions",
  },
  {
    icon: "📊",
    title: "Dashboard",
    desc: "Track your progress with beautiful charts & analytics",
    link: "/dashboard",
    color: "bg-yellow-300",
    stats: "Charts & Analytics",
  },
];

const steps = [
  { num: "01", title: "Create Account", desc: "Sign up for free in seconds", icon: "🔐" },
  { num: "02", title: "Add Your Tasks", desc: "Plan your study goals", icon: "📝" },
  { num: "03", title: "Use AI Help", desc: "Get AI-powered suggestions", icon: "🤖" },
  { num: "04", title: "Track Progress", desc: "Monitor your achievements", icon: "📈" },
];

const tips = [
  { emoji: "📖", tip: "Study in 25-minute focused sessions" },
  { emoji: "✅", tip: "Break big tasks into smaller ones" },
  { emoji: "🔄", tip: "Review notes within 24 hours" },
  { emoji: "💤", tip: "Sleep 7-8 hours for better memory" },
  { emoji: "🥤", tip: "Stay hydrated while studying" },
  { emoji: "📵", tip: "Keep phone away during focus time" },
];

function Home() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  return (
    <div className="min-h-screen bg-yellow-50">

      {/* Hero Section */}
      <div className="bg-yellow-300 border-b-4 border-black px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">

          {/* Welcome badge */}
          {name && (
            <div className="border-4 border-black bg-white px-4 py-2 text-sm font-black mb-4 shadow-[4px_4px_0px_black] inline-block">
              👋 Welcome back, {name}!
            </div>
          )}

          <div className="border-4 border-black bg-white px-4 py-2 text-sm font-black mb-6 shadow-[4px_4px_0px_black] inline-block">
            🚀 AI-Powered Study App — Free Forever
          </div>

          <h1 className="text-5xl md:text-7xl font-black border-4 border-black bg-white px-6 py-4 shadow-[10px_10px_0px_black] mb-6 inline-block">
            AI Study Planner 📚
          </h1>

          <p className="text-lg md:text-xl font-bold max-w-2xl mx-auto mb-10 opacity-80">
            Plan smarter, study better! AI-powered tools to boost your productivity, stay focused, and ace your exams 🎯
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate(name ? "/planner" : "/login")}
              className="border-4 border-black bg-black text-white px-8 py-4 text-lg font-black shadow-[6px_6px_0px_#666] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#666] transition"
            >
              {name ? "Open Planner 📅" : "Get Started Free 🚀"}
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="border-4 border-black bg-purple-300 px-8 py-4 text-lg font-black shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition"
            >
              Try AI Chat 🤖
            </button>
            <button
              onClick={() => navigate("/pomodoro")}
              className="border-4 border-black bg-red-300 px-8 py-4 text-lg font-black shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition"
            >
              Start Timer 🍅
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-black text-white border-b-4 border-yellow-300 px-6 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "🆓", label: "Free Forever" },
            { num: "🤖", label: "Gemini AI" },
            { num: "🍅", label: "Pomodoro Timer" },
            { num: "📊", label: "Analytics" },
          ].map((s, i) => (
            <div key={i} className="border-2 border-yellow-300 p-3">
              <div className="text-3xl">{s.num}</div>
              <div className="text-xs font-bold opacity-70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 md:px-16 py-16 bg-yellow-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black border-4 border-black bg-white inline-block px-6 py-3 shadow-[8px_8px_0px_black]">
              Features ✨
            </h2>
            <p className="mt-4 font-bold opacity-60">Everything you need to study smarter</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                onClick={() => navigate(f.link)}
                className={`border-4 border-black p-6 cursor-pointer shadow-[8px_8px_0px_black] hover:translate-x-2 hover:translate-y-2 hover:shadow-[2px_2px_0px_black] transition-all duration-150 ${f.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl border-4 border-black bg-white w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_black] flex-shrink-0">
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black border-b-4 border-black pb-2 mb-2">{f.title}</h3>
                    <p className="font-bold opacity-70 mb-3">{f.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="border-2 border-black bg-white px-3 py-1 text-xs font-black">
                        {f.stats}
                      </span>
                      <span className="border-2 border-black bg-black text-white px-3 py-1 text-xs font-black">
                        Open →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-black text-white px-6 md:px-16 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black border-4 border-yellow-300 inline-block px-6 py-3">
              How It Works 🔥
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="border-4 border-yellow-300 p-4 text-center relative">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-yellow-300 font-black text-lg mb-1">{s.num}</div>
                <h3 className="font-black text-lg mb-2">{s.title}</h3>
                <p className="text-sm opacity-60 font-bold">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-yellow-300 font-black text-xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="px-6 md:px-16 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black border-4 border-black inline-block px-6 py-3 shadow-[6px_6px_0px_black]">
              Study Tips 💡
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((t, i) => (
              <div
                key={i}
                className="border-4 border-black p-4 shadow-[4px_4px_0px_black] flex gap-3 items-center bg-yellow-50 hover:bg-yellow-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all cursor-default"
              >
                <span className="text-3xl border-2 border-black bg-white w-12 h-12 flex items-center justify-center flex-shrink-0">
                  {t.emoji}
                </span>
                <p className="font-bold">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-300 border-t-4 border-black px-6 md:px-16 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 border-4 border-black bg-white inline-block px-6 py-3 shadow-[8px_8px_0px_black]">
            Ready? 🧠
          </h2>
          <p className="text-lg font-bold mb-8 opacity-80 mt-6">
            Join students using AI to study smarter and ace their exams!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate(name ? "/planner" : "/login")}
              className="border-4 border-black bg-black text-white px-10 py-4 text-xl font-black shadow-[6px_6px_0px_#333] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#333] transition"
            >
              {name ? "Go to Planner 📅" : "Start Free Now 🚀"}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border-4 border-black bg-white px-10 py-4 text-xl font-black shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition"
            >
              View Dashboard 📊
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black text-white py-8 border-t-4 border-yellow-300">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-black text-lg">AI STUDY PLANNER 🚀</div>
          <div className="flex gap-4 flex-wrap justify-center">
            {["/", "/planner", "/dashboard", "/pomodoro", "/chat"].map((path, i) => (
              <button
                key={i}
                onClick={() => navigate(path)}
                className="text-sm font-bold opacity-60 hover:opacity-100 transition"
              >
                {["Home", "Planner", "Dashboard", "Pomodoro", "AI Chat"][i]}
              </button>
            ))}
          </div>
          <p className="text-sm opacity-50 font-bold">Made with ❤️ | Powered by Gemini AI 🤖</p>
        </div>
      </div>

    </div>
  );
}

export default Home;