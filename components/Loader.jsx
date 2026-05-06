import React from 'react';

const Loader = ({ className = "" }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
        Synchronizing...
      </p>
    </div>
  );
};

export default Loader;
