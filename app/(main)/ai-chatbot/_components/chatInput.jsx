export const ChatInput = ({ input, setInput, handleSubmit, loading, setStopTyping }) => {
    return (
      <form onSubmit={handleSubmit} className="p-4 flex gap-3 bg-white">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-slate-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
      />
      <button
        type={loading ? "button" : "submit"}
        onClick={loading ? () => setStopTyping(true) : undefined}
        className={`${loading ? "bg-red-500" : "bg-blue-500"} text-white px-6 rounded-full transition-colors`}
      >
        {loading ? "Stop" : "Send"}
      </button>
    </form>
    )
  }
  