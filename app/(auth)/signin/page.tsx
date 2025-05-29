import SignIn from "@/components/Auth/SignIn";
import React from "react";

const Page = () => {
  return (
    <div>
      <SignIn redirectTo="/dashboard" />
    </div>
  );
};

export default Page;
