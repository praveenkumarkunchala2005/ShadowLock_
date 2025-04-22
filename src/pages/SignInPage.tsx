import { SignIn } from "@clerk/clerk-react";
import React from "react";

const SignInPage: React.FC = () => {
  return (
    <div className="relative w-full max-h-min">
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-grow flex flex-col items-center justify-center min-h-min">
          <SignIn/>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
