import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { BrainCircuit, ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { checkUser } from '@/lib/checkUser.js';
import Image from 'next/image'

const Header = async () => {

  // Ensure user check runs before rendering
  await checkUser()



  return (
    <header className="fixed top-0 border-b w-full bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 z-50">
      <nav className="container md:max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-10">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="uppercase flex items-center text-xl bg-linear-to-l from-gray-600 via-gray-700 to-gray-800 font-extrabold text-transparent bg-clip-text"
        >
          <Image src={'/careerly.jpg'} alt='careerly' width={130} height={140}/>
        </Link>

        {/* Navigation & User Controls */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            {/* Dashboard Button */}
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <StarIcon className="w-4 h-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/ai-chatbot" className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" />
                    <span>AI Chat</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/interviews" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/ai-cover-letter" className="flex items-center gap-2">
                    <PenBox className="w-4 h-4" />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Resume</span>
                  </Link>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          {/* Sign In & up Button (only if signed out) */}
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
            <SignUpButton />
          </SignedOut>

          {/* User Menu (only if signed in) */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                  userButtonPopoverCard: 'shadow-xl',
                  userPreviewMainIdentifier: 'font-semibold',
                },
              }}
              afterSwitchSessionUrl="/"
              userProfileMode="navigation"
              userProfileUrl="/user-profile"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header
