import { Suspense } from "react";
import { SigninHandler } from "@/components/signin-handler";

const AuthSuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninHandler />
    </Suspense>
  );
};

export default AuthSuccessPage;
