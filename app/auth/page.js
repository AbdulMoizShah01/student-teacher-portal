"use client";
import LoginForm from "@/ui/forms/LoginForm";
import firebaseSDK from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  

  const handleLogin = async ({ email, password }) => {
    try {
      const auth = firebaseSDK.auth;
      const userCredential = await auth.signInWithEmailAndPassword( email, password);
      const user = userCredential.user;
    
      const res = await fetch(`/api/getUserRole?uid=${user.uid}`);
      const data = await res.json();

    

      if (data?.user?.role === "admin") router.push("/admin");
      else if (data?.user?.role === "teacher") router.push("/teacher");
      else router.push("/student");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
