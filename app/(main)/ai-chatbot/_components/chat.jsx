"use client"

import { useState, useRef, useEffect } from "react"
import { BrainCircuit, Menu, X, Loader2 } from "lucide-react"
import useFetch from "@/hooks/useFetch"
import ChatSidebar from "./chatSidebar"
import { FormattedMessage } from "./formatedMessage"
import { ChatInput } from "./chatInput"
import { BarLoader } from "react-spinners"
import Loader from "@/components/Loader";

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [chatId, setChatId] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [stopTyping, setStopTyping] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const messagesEndRef = useRef(null);


  const callApi = async (prompt) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, chatId })
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Failed to generate chat response");
    }
    if (data.chatId) setChatId(data.chatId)
    return data
  }

  const { data, loading, fn: fetchData, error } = useFetch(callApi)

  /* auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  /* typing effect */
  useEffect(() => {
    if (loading) return;
    if (!data?.response) return;

    const fullText = data.response;
    let timer;

    // add empty message for bot
    setMessages(prev => [...prev, { sender: "bot", text: "" }]);

    const typeText = () => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (!last || last.sender !== "bot") return prev;

        const currentLength = last.text.length;

        if (currentLength >= fullText.length) {
          clearTimeout(timer);
          return prev;
        }

        return [
          ...prev.slice(0, -1),
          {
            ...last,
            text: fullText.slice(0, currentLength + 1)
          }
        ];
      });

      timer = setTimeout(typeText, 15);
    };

    timer = setTimeout(typeText, 15);

    return () => clearTimeout(timer);
  }, [data?.response, loading]);

  /* handle error */
  useEffect(() => {
    if (error) {
      // Remove the last bot message if it's empty (pending response)
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].sender === "bot" && prev[prev.length - 1].text === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  }, [error]);

  const handleSubmit = e => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setMessages(prev => [
      ...prev,
      { sender: "user", text: input },
      { sender: "bot", text: "" }
    ])

    fetchData(input)
    setInput("")
  }

  return (
    <div className="flex h-[calc(100vh-65px)] mt-5 bg-slate-50/50 overflow-hidden relative">

      <ChatSidebar
        chatId={chatId}
        setChatId={setChatId}
        isSidebarOpen={isSidebarOpen}
        setMessages={setMessages}
        setIsHistoryLoading={setIsHistoryLoading}
      />

      <div className="flex-1 flex flex-col relative bg-white/50 backdrop-blur-sm">

        {/* Chat Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              {isSidebarOpen ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h2 className="font-black text-slate-800 tracking-tight leading-none text-lg">AI Career Assistant</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Online & Ready</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* History Loading Overlay */}
        {isHistoryLoading && (
          <div className="absolute top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm h-full flex items-center justify-center">
            <Loader />
          </div>
        )}

        {/* Empty State */}
        {!chatId && messages.length === 0 && !isHistoryLoading && (
          <div className="flex-1 w-full flex flex-col items-center justify-center px-4 relative overflow-hidden pb-28">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="w-24 h-24 rounded-xl bg-white shadow-xl flex items-center justify-center mb-5 border border-slate-100 rotate-3">
              <BrainCircuit className="w-14 h-14 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter mb-4">
              Careerly <span className="text-primary italic">AI</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed mb-5 text-center">
              Choose a topic to begin your career conversation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
              {[
                "Growth trends in my industry",
                "How to optimize my skills?",
                "Personalized interview tips"
              ].map((query) => (
                <button
                  key={query}
                  onClick={() => setInput(query)}
                  className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:border-primary/50 hover:bg-slate-50 hover:text-primary transition-all shadow-sm text-center flex items-center justify-center"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Container */}
        {(messages.length > 0 || loading) && (
          <div id="hideScrollbar" className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 pb-32">
            {messages.map((msg, i) => (
              msg.text !== "" || msg.sender === "user" ? (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm ${msg.sender === "user" ? "bg-slate-800" : "bg-primary"}`}>
                      {msg.sender === "user" ? <div className="text-[10px] font-black text-white">YOU</div> : <BrainCircuit size={16} className="text-white" />}
                    </div>
                    <div className={`px-5 py-4 rounded-3xl shadow-sm text-base leading-relaxed ${msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium"
                      }`}>
                      <FormattedMessage text={msg.text} />
                    </div>
                  </div>
                </div>
              ) : null
            ))}

            {/* Thinking Animation */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[75%]">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                    <BrainCircuit size={16} className="text-white" />
                  </div>
                  <div className="px-5 py-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">AI is thinking</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Form Floating */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <ChatInput
              input={input}
              handleSubmit={handleSubmit}
              setInput={setInput}
              loading={loading}
              setStopTyping={setStopTyping}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
