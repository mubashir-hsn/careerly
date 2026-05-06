import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { BrainCircuit, ChevronDown, CreditCard, FileText, GraduationCap, LayoutDashboard, PenBox, StarIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { checkUser } from '@/lib/checkUser.js';
import Image from 'next/image'

const Header = async () => {

  // Ensure user check runs before rendering
  const user = await checkUser()



  return (
    <header className="fixed top-0 border-b border-slate-200/50 w-full bg-white/70 backdrop-blur-2xl z-50 transition-all duration-500 shadow-sm">
      <nav className="container md:max-w-7xl mx-auto h-20 flex items-center justify-between px-6">
        {/* Logo / Brand */}
        <Link
          href={user?.adminUser ? "/admin" : (user ? "/dashboard" : "/")}
          className="flex items-center gap-2 hover:opacity-80 transition-all active:scale-95"
        >
          <Image
            src={'/careerly.jpg'}
            alt='careerly'
            width={130}
            height={45}
            className="h-11 w-auto object-contain brightness-105"
          />
        </Link>

        {/* Navigation & User Controls */}
        <div className="flex items-center gap-4">
          <SignedIn>
            {user?.adminUser ? (
              <>
                {/* Admin ONLY view */}
                <Link href="/admin">
                  <Button
                    variant="destructive"
                    className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 font-bold active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    <span>Admin Panel</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Regular User View */}
                <Link href="/dashboard">
                  <Button variant="ghost" className="h-11 px-5 rounded-xl border border-transparent hover:bg-slate-100/50 active:scale-95 transition-all text-slate-600 font-bold">
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    <span className="hidden md:block">Dashboard</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-11 px-6 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 rounded-xl active:scale-95 transition-all font-bold">
                      <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                      <span className="hidden md:block uppercase text-[11px] tracking-widest">Growth Engine</span>
                      <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64 p-3 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-slate-100 bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                    <div className="px-3 pb-2 mb-2 border-b border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Tools</p>
                    </div>
                    <DropdownMenuItem className="rounded-xl focus:bg-slate-50 p-0 overflow-hidden mb-1">
                      <Link href="/ai-chatbot" className="flex items-center gap-4 w-full px-3 py-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <BrainCircuit className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">AI Assistant</p>
                          <p className="text-[10px] text-slate-400 font-medium">Real-time career help</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="rounded-xl focus:bg-slate-50 p-0 overflow-hidden mb-1">
                      <Link href="/insights" className="flex items-center gap-4 w-full px-3 py-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <StarIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">Industry Intel</p>
                          <p className="text-[10px] text-slate-400 font-medium">Market trends & data</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="rounded-xl focus:bg-slate-50 p-0 overflow-hidden mb-1">
                      <Link href="/interviews" className="flex items-center gap-4 w-full px-3 py-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Interview Prep</h4>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Practice with AI questions.</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="rounded-xl focus:bg-slate-50 p-0 overflow-hidden mb-1">
                      <Link href="/ai-cover-letter" className="flex items-center gap-4 w-full px-3 py-3">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <PenBox className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Cover Letter</h4>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Custom letters for any job.</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="rounded-xl focus:bg-slate-50 p-0 overflow-hidden">
                      <Link href="/resume" className="flex items-center gap-4 w-full px-3 py-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Resume Builder</h4>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Better resumes with AI.</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <DropdownMenuItem className="rounded-xl focus:bg-yellow-50 p-0 overflow-hidden">
                        <Link href="/pricing" className="flex items-center gap-4 w-full px-3 py-3 text-yellow-700">
                          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5 text-yellow-600" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">Pro Plan</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </SignedIn>

          {/* Sign In & UP Buttons (only if signed out) */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="h-11 px-5 rounded-xl font-bold text-slate-600 hover:bg-slate-100/50 transition-all">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="h-11 px-8 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 rounded-xl active:scale-95 transition-all font-black uppercase text-[11px] tracking-widest">Get Started</Button>
            </SignUpButton>
          </SignedOut>

          {/* User Menu (only if signed in) */}
          <SignedIn>
            <div className="pl-4 border-l border-slate-200 ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10 ring-4 ring-slate-50 hover:ring-primary/20 transition-all shadow-sm',
                    userButtonPopoverCard: 'shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-slate-100 rounded-[1.5rem]',
                    userPreviewMainIdentifier: 'font-black text-slate-800',
                    userPreviewSecondaryIdentifier: 'text-slate-500 font-medium',
                    userButtonTrigger: 'focus:shadow-none'
                  },
                }}
                afterSwitchSessionUrl="/"
                userProfileMode="navigation"
                userProfileUrl="/user-profile"
              />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>

  )
}

export default Header
