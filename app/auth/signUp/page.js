"use client";
import firebaseSDK from "@/firebase/firebase.config";
import LoginForm from "@/ui/forms/LoginForm";
import SignupForm from "@/ui/forms/SignupForm";
import { createUniqueId, saveData } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
    const router=useRouter();
  const handleSignup = async (obj) => {
    let userObj = { ...obj };
    try {
      let response = await firebaseSDK.auth.createUserWithEmailAndPassword(
        userObj?.email,
        userObj?.password
      );
      
    

      let user = response?.user;
      userObj["_id"]=user.uid;  
      delete userObj?.password;
     await saveData("users",userObj);

   await fetch(`/api/getUserRole?uid=${user.uid}`);
     

   router.push("/?waitlist=true");
    } catch (e) {
        console.error("Error while signup",e);
    }
  };

  return <SignupForm onSubmit={handleSignup} />;
};

export default page;
