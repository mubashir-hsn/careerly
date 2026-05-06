import React from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MainLayoutPage = ({ children }) => {
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
