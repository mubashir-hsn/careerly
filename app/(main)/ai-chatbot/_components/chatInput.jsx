export const ChatInput = ({ input, setInput, handleSubmit, loading, setStopTyping }) => {
    return (
      <form onSubmit={handleSubmit} className="relative flex items-end gap-3 p-2 bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] transition-all focus-within:border-primary/30 focus-within:shadow-primary/5 group">
        <textarea
          value={input}
          rows={1}
          onChange={e => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Message AI Assistant..."
          className="flex-1 bg-transparent rounded-2xl px-6 py-4 outline-none resize-none min-h-[56px] max-h-[200px] text-[15px] font-medium text-slate-700 placeholder:text-slate-400 placeholder:font-bold"
          disabled={loading}
        />
        <button
          type={loading ? "button" : "submit"}
          onClick={loading ? () => setStopTyping(true) : undefined}
          className={`h-[56px] px-8 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
            loading 
            ? "bg-slate-100 text-slate-500 shadow-none border border-slate-200" 
            : "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              Stop
            </>
          ) : (
            "Send"
          )}
        </button>
      </form>
    )
  }
  