"use client"

import { useState, useRef, useEffect } from "react"
import { BrainCircuit, Menu, X, Loader2 } from "lucide-react"
import useFetch from "@/hooks/useFetch"
import ChatSidebar from "./chatSidebar"
import { FormattedMessage } from "./formatedMessage"
import { ChatInput } from "./chatInput"
import { BarLoader } from "react-spinners"

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
    if (data.chatId) setChatId(data.chatId)
      return data
  }
  
  const { data, loading, fn: fetchData } = useFetch(callApi)
  
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
    <div className="flex h-screen bg-white overflow-hidden relative">
      
      <div>
      <ChatSidebar
        chatId={chatId}
        setChatId={setChatId}
        isSidebarOpen={isSidebarOpen}
        setMessages={setMessages}
        setIsHistoryLoading={setIsHistoryLoading}
      />
      </div>

      <div className="flex-1 flex flex-col relative">

        <div className="h-14 border-b flex items-center px-3 gap-2 bg-white z-10">
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="p-2 rounded-md border hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* History Loading Overlay */}
        {isHistoryLoading && (
          <div className="flex items-center justify-center">
            <BarLoader className='mt-4' width={'100%'} color='gray'/>
          </div>
        )}

        {/* Empty State */}
        {!chatId && messages.length === 0 && !isHistoryLoading && (
          <div className="flex-1 w-full flex flex-col items-center justify-center bg-slate-100 px-4">
            <BrainCircuit className="w-20 h-20 text-purple-600 mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold mb-2">AI Career Guide</h1>
            <p className="text-gray-600 mb-6 text-center">Ask anything about skills and careers</p>
          </div>
        )}

        {/* Messages Container */}
        {(messages.length > 0 || loading) && (
          <div id="hideScrollbar" className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              msg.text !== "" || msg.sender === "user" ? (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-lg max-w-[95%] text-justify ${msg.sender === "user" ? "bg-slate-300 text-slate-800" : " text-slate-600"}`}>
                    <FormattedMessage text={msg.text} />
                  </div>
                </div>
              ) : null
            ))}

            {/* Animation */}
            {loading && (
            <div className="flex justify-start w-full">
              <div className="p-4 text-gray-800 flex items-center space-x-2">
                <div className="border-5 border-blue-400 border-t-pink-400 border-l-purple-400 rounded-full w-5 h-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Form */}
        <ChatInput
          input={input}
          handleSubmit={handleSubmit}
          setInput={setInput}
          loading={loading}
          setStopTyping={setStopTyping}
        />

      </div>
    </div>
  )
}