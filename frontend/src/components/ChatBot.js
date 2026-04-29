import { useState } from "react";
import API from "../api";  

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { type: "user", text: input };

    try {
      const res = await fetch(`${API}/ask`, {   
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      const botMsg = {
        type: "bot",
        text: data.answer || "No answer found 🤖",
      };
      setMessages((prev) => [...prev, userMsg, botMsg]);
      setInput("");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        userMsg,
        { type: "bot", text: "Something went wrong. Try again!" },
      ]);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* 💬 Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full cursor-pointer shadow-lg z-50"
      >
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-xl rounded-lg flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">College Assistant 🤖</h3>
            <span
              onClick={() => setOpen(false)}
              className="cursor-pointer text-white font-bold"
            >
              ✕
            </span>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm">
                Ask anything about colleges...
              </p>
            )}
            {messages.map((m, i) => (   
              <div
                key={i}
                className={`mb-2 ${m.type === "user" ? "text-right" : "text-left"}`}
              >
                <p
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}  
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="border p-2 w-full rounded mb-2"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white w-full py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
