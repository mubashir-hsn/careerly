"use client"
import { useState, useRef, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BrainCircuit } from "lucide-react";

// FormattedMessage component remains the same
const FormattedMessage = ({ text }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold text-purple-600 border-b-2 border-purple-400 pb-1 mt-4 mb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold text-blue-600 border-l-4 border-blue-400 pl-2 mt-4 mb-2" {...props} />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-gray-200 px-1 rounded text-sm" {...props} />
          ) : (
            <pre className="bg-slate-200 text-red-500 p-4 rounded-xl overflow-x-auto">
              <code {...props} />
            </pre>
          ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc ml-6 space-y-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal ml-6 space-y-1" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a className="text-blue-600 underline hover:text-blue-800" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-2 leading-relaxed" {...props} />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stopTyping, setStopTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const callApi = async (prompt) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong");
    }
    return response.json();
  };

  const { data, loading, fn: fetchData } = useFetch(callApi);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (data && !loading) {
      handleTypingEffect(data.response);
    }
  }, [data, loading]);

  const handleTypingEffect = (text) => {
    return new Promise((resolve) => {
      let fullText = "";
      let i = 0;
      setStopTyping(false);
      const typingInterval = setInterval(() => {
        if (stopTyping) {
          clearInterval(typingInterval);
          resolve();
          return;
        }
        if (i < text.length) {
          fullText += text.charAt(i);
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last) {
              last.text = fullText;
              return [...prev.slice(0, -1), { ...last }];
            }
            return prev;
          });
          i++;
        } else {
          clearInterval(typingInterval);
          resolve();
        }
      }, 10);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
    fetchData(input);
    setInput("");
  };

  return (
    <div className="w-full mx-auto flex flex-col text-gray-800 font-sans px-2 md:px-5">
      {messages.length === 0 && (
        <div className="flex-1 w-fit mx-auto flex flex-col gap-2 items-center justify-center px-14 py-10 rounded-md mt-6 text-center bg-slate-100">
           <div className="p-10 rounded-full bg-white">
             <BrainCircuit className="w-24 h-24 text-purple-600"/>
           </div>
          <h1 className="text-4xl gradient-title font-bold tracking-normal">
            AI Career Guide
          </h1>
          <p className="text-lg mt-1">
            Ask me anything about technology, skills, and career paths.
          </p>
        </div>
      )}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 min-h-screen">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 font-medium ${
                  msg.sender === "user"
                    ? "text-gray-800 max-w-fit bg-slate-200 rounded-lg"
                    : "text-gray-800 w-full"
                }`}
              >
                <FormattedMessage text={msg.text} />
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="p-4 text-gray-800 flex items-center space-x-2">
                <div className="border-5 border-blue-200 border-t-blue-600 rounded-full w-6 h-6 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex w-full p-4 bg-white fixed bottom-0 left-0 right-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 bg-slate-200 text-gray-800 rounded-full py-3 px-6 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={loading}
        />
        {loading ? (
          <button
            type="button"
            onClick={() => setStopTyping(true)}
            className="bg-red-500 text-white rounded-full py-3 px-6 font-semibold hover:bg-red-600 transition-all"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full py-3 px-6 font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}