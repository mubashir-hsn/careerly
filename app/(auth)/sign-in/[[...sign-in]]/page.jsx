import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
};

export default Page;
