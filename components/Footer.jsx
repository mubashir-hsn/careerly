import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/careerly.jpg" 
                alt="Careerly Logo" 
                width={120} 
                height={40} 
                className="brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
              Empowering professionals with AI-driven career coaching, resume insights, and interview preparation.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Discovery</h4>
            <ul className="space-y-4">
              <li><Link href="/ai-chatbot" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">AI Career Chatbot</Link></li>
              <li><Link href="/insights" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">Industry Insights</Link></li>
              <li><Link href="/interviews" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">Interview Prep</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">Career Dashboard</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/support" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">Support & Feedback</Link></li>
              <li><Link href="/pricing" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">Subscription Plans</Link></li>
              <li><Link href="#" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-400 font-bold text-sm hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Stay Updated</h4>
            <p className="text-slate-400 text-sm font-medium mb-4">
              Get the latest career trends and AI tools directly in your inbox.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-slate-800 border-0 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 w-full outline-none"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-xl transition-colors">
                <Mail className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} Careerly AI Platform. Crafted for Excellence.
          </p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">System Balanced & Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
