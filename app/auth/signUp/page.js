"use client";
import firebaseSDK from "@/firebase/firebase.config";
import SignupForm from "@/ui/forms/SignupForm";
import { saveData } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

// ✅ This inner component uses useSearchParams safely
const SignupPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get("role");

  const handleSignup = async (obj) => {
    let userObj = { ...obj };
    try {
      const response = await firebaseSDK.auth.createUserWithEmailAndPassword(
        userObj?.email,
        userObj?.password
      );

      const user = response?.user;
      userObj["_id"] = user.uid;
      delete userObj?.password;

      await saveData("users", userObj);
      await fetch(`/api/getUserRole?uid=${user.uid}`);

      router.push("/?waitlist=true");
    } catch (e) {
      console.error("Error while signup", e);
    }
  };

  return <SignupForm role={role} onSubmit={handleSignup} />;
};

// ✅ This outer component is exported and only wraps Suspense
const Page = () => {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <SignupPageInner />
    </Suspense>
  );
};

export default Page;
