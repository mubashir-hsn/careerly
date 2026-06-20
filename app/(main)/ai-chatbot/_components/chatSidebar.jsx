import { Edit, MessageSquare, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ChatSidebar = ({ isSidebarOpen, chatId, setChatId, setMessages, setIsHistoryLoading }) => {
  const [chats, setChats] = useState([])

  useEffect(() => {
    fetch("/api/chat/history")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChats(data)
      })
  }, [chatId])

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
    }
  }, [chatId])

  const handleDeleteChat = async (id) => {
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
       bg-slate-50 border-r border-slate-200 transition-all h-full duration-300
       overflow-hidden flex flex-col
       ${isSidebarOpen ? "w-72" : "w-0"}
     `}
    >
      <div className="p-4 border-b border-slate-200 bg-white/50">
        <button
          onClick={() => setChatId(null)}
          className="w-full flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest p-4 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          <Edit size={18} /> New Session
        </button>
      </div>

      <div id="hideScrollbar" className="flex-1 p-3 space-y-2 overflow-y-auto bg-slate-50/50">
        <div className="px-2 pb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Previous Conversations</h3>
        </div>
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                chatId === chat.id 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white border border-slate-100 text-slate-600 hover:border-primary/30 hover:bg-slate-50'
            }`}
             onClick={() => loadChat(chat.id)}
          >
            <div className="flex-1 text-sm font-bold truncate flex items-center gap-3">
              <MessageSquare size={16} className={`${chatId === chat.id ? 'text-white' : 'text-primary'}`} />
              <span className="truncate">{chat.title || "New Chat"}</span>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                            chatId === chat.id 
                            ? 'bg-white/10 hover:bg-white/20 text-white' 
                            : 'hover:bg-red-50 hover:text-red-500 text-slate-400'
                        }`}
                    >
                        <Trash2 size={14} />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight text-slate-800">Clear Conversation?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed mt-2 text-base">
                            This will permanently remove the chat session <strong>"{chat.title || "Untitled"}"</strong>. This action is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3 flex-col sm:flex-row">
                        <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-slate-200 hover:bg-slate-50">Keep Session</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteChat(chat.id)}
                            className="h-12 bg-red-500 text-white hover:bg-red-600 rounded-2xl font-black uppercase tracking-widest px-8 shadow-xl shadow-red-200"
                        >
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
        {chats.length === 0 && (
            <div className="p-4 text-center">
                <p className="text-xs font-semibold text-slate-400 italic">No history yet</p>
            </div>
        )}
      </div>
    </aside>
  )
}

export default ChatSidebar
