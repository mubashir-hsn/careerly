import { Edit, MessageSquare, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const ChatSidebar = ({ isSidebarOpen, chatId, setChatId, setMessages, setIsHistoryLoading }) => {
  const [chats, setChats] = useState([])

  useEffect(() => {
    fetch("/api/chat/history")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChats(data)
      })
  }, [chatId])

  const loadedChatsRef = useRef(new Set())
  const loadChat = async (id) => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(`/api/chat/${id}`);
      const data = await res.json();

      if (data.messages) {
        const formattedMessages = data.messages.map((m) => ({
          sender: m.role === "USER" ? "user" : "bot",
          text: m.content,
        }));
        setMessages(formattedMessages);
        setChatId(id);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  /* load chat history trigger */
  useEffect(() => {
    if (!chatId) {
      setMessages([])
      return
    }

    if (loadedChatsRef.current.has(chatId)) return

    loadedChatsRef.current.add(chatId)

    loadChat(chatId)
  }, [chatId])

  const handleDeleteChat = async (id) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const res = await fetch(`/api/chat/${id}`, { method: "DELETE" });
      if (res.ok) {
        // filter form sidebar
        setChats((prev) => prev.filter((c) => c.id !== id));
        toast.success('Chat deleted successfully.')

        if (chatId === id) {
          setChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete chat")
    }
  };

  return (
    <aside
      className={`
       bg-slate-200 transition-all h-full duration-300
       overflow-hidden
       ${isSidebarOpen ? "w-64" : "w-0"}
     `}
    >
      <div className="px-2 py-4 border-b flex justify-between items-center">
        <button
          onClick={() => setChatId(null)}
          className="w-full flex items-center gap-2 text-sm p-3 bg-slate-300 hover:bg-slate-100 rounded-lg"
        >
          <Edit size={18} /> New Chat
        </button>
      </div>

      <div id="hideScrollbar" className="p-2 space-y-1 overflow-y-auto h-full border-t border-slate-300">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between p-2 rounded-md hover:bg-slate-100 ${chatId === chat.id ? 'bg-slate-200' : ''}`}
          >
            <button
              onClick={() => loadChat(chat.id)}
              className="flex-1 text-left text-sm truncate flex items-center gap-2"
            >
              <MessageSquare size={14} className="shrink-0" />
              {chat.title || "New Chat"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop to Chat load
                handleDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>

          </div>
        ))}
      </div>


    </aside>
  )
}

export default ChatSidebar
