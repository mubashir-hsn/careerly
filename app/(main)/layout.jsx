import React from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { checkUser } from '@/lib/checkUser';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const MainLayoutPage = async ({ children }) => {
  const user = await checkUser();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");

  // Restrict admin users to only landing page and admin routes
  if (user?.adminUser && pathname !== "/") {
    redirect("/admin");
  }

  const isOnboardingRoute = pathname?.startsWith("/onboarding");
  const isProfileComplete = typeof user?.industry === "string" && user.industry.trim().length > 0;

  if (user && !user.adminUser && !isProfileComplete && pathname !== "/" && !isOnboardingRoute) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto mt-16 px-4 md:px-0">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayoutPage
