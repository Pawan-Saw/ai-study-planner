import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const formatText = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code style='background:#e9d5ff;padding:2px 6px;border-radius:4px;font-family:monospace'>$1</code>")
    .replace(/\n/g, "<br/>");
};

function AiChat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [
      { role: "ai", text: "Hi! I'm your AI Study Assistant 🤖 Ask me anything about your studies!" },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) { toast.error("Type something! 😑"); return; }

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a helpful study assistant. Answer clearly and concisely using simple language. User asks: ${input}`,
        }),
      });

      const text = await res.text();
      console.log("AI Response:", text);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // ✅ Direct text use karo — no JSON parsing needed!
      setMessages((prev) => [...prev, { role: "ai", text: text }]);

    } catch (err) {
      console.error("AI Error:", err);
      toast.error("AI Error 😢");
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, something went wrong 😢" }]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    const initial = [{ role: "ai", text: "Hi! I'm your AI Study Assistant 🤖 Ask me anything!" }];
    setMessages(initial);
    localStorage.removeItem("chatHistory");
    toast.success("Chat cleared! 🗑️");
  };

  const bg = dark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-100 to-pink-100 text-black";
  const card = dark ? "bg-gray-800 text-white" : "bg-white text-black";

  const quickPrompts = [
    { label: "⚡ Newton's Laws", text: "Explain Newton's laws simply" },
    { label: "📚 Study Tips", text: "How to study effectively?" },
    { label: "🌿 Photosynthesis", text: "What is photosynthesis?" },
    { label: "📝 Exam Prep", text: "Tips for exam preparation" },
    { label: "🧮 Maths Help", text: "How to get better at maths?" },
    { label: "💻 Coding Tips", text: "How to learn programming fast?" },
  ];

  return (
    <div className={`min-h-screen flex flex-col p-4 md:p-8 transition-all duration-300 ${bg}`}>

      <div className="flex items-center gap-3 flex-wrap mb-4">
        <h1 className={`text-2xl md:text-3xl font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_black] ${card}`}>
          🤖 AI Study Assistant
        </h1>
        <button onClick={() => setDark(!dark)}
          className={`border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_black] ${dark ? "bg-yellow-300 text-black" : "bg-gray-800 text-white"}`}>
          {dark ? "☀️" : "🌑"}
        </button>
        <button onClick={clearChat}
          className="border-4 border-black px-4 py-2 font-bold bg-red-300 shadow-[4px_4px_0px_black] hover:bg-red-400 transition">
          🗑️ Clear
        </button>
        <div className={`border-4 border-black px-3 py-2 font-bold text-sm shadow-[4px_4px_0px_black] ${card}`}>
          💬 {messages.length} messages
        </div>
        <div className="border-4 border-black bg-yellow-300 px-3 py-2 font-bold text-sm shadow-[4px_4px_0px_black]">
          👤 {localStorage.getItem("name") || "User"}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {quickPrompts.map((q, i) => (
          <button key={i} onClick={() => setInput(q.text)}
            className={`border-2 border-black px-3 py-1 text-sm font-bold hover:bg-purple-200 transition shadow-[2px_2px_0px_black] ${card}`}>
            {q.label}
          </button>
        ))}
      </div>

      <div className={`flex-1 border-4 border-black p-4 overflow-y-auto h-[52vh] flex flex-col gap-4 shadow-[6px_6px_0px_black] ${card}`}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] md:max-w-[65%] border-4 border-black px-4 py-3 shadow-[4px_4px_0px_black] ${
              msg.role === "user"
                ? "bg-yellow-300 text-black rounded-tl-2xl rounded-bl-2xl"
                : "bg-purple-200 text-black rounded-tr-2xl rounded-br-2xl"
            }`}>
              <div className="text-xs font-black mb-2 opacity-70">
                {msg.role === "user" ? "👤 You" : "🤖 AI Assistant"}
              </div>
              <div className="leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="border-4 border-black px-4 py-3 bg-purple-200 shadow-[4px_4px_0px_black] rounded-tr-2xl rounded-br-2xl">
              <div className="text-xs font-black mb-2 opacity-70">🤖 AI Assistant</div>
              <div className="flex gap-2 items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-sm font-bold opacity-60 ml-1">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className={`flex-1 border-4 border-black p-3 text-base md:text-lg shadow-[4px_4px_0px_black] focus:outline-none focus:ring-2 focus:ring-purple-400 ${card}`}
          placeholder="Ask anything about your studies..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}
          className={`border-4 border-black px-6 font-black text-lg shadow-[4px_4px_0px_black] transition ${
            loading ? "bg-gray-300 cursor-not-allowed" : "bg-purple-400 hover:bg-purple-500 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black]"
          }`}>
          {loading ? "⏳" : "Send 🚀"}
        </button>
      </div>

      <p className="text-center text-xs font-bold opacity-50 mt-3">
        💡 Press Enter to send • Chat history auto-saved
      </p>
    </div>
  );
}

export default AiChat;