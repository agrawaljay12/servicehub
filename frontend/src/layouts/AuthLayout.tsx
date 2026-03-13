import { Routes, Route } from "react-router-dom";
import { SignUp } from "../auth/SignUp";
import { SignIn } from "../auth/SignIn";
import { ForgotPassword } from "../auth/ForgotPassword";

export const AuthLayout = () => {
  return (
    <main className="grow">
      <Routes>
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </main>
  );
};
