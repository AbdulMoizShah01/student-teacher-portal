import firebaseSDK from "@/firebase/firebase.config";
import { getDocs, collection, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  let uid = new URL(req?.url)?.searchParams?.get("uid");

  if (!uid)
    return Response.json(
      { message: "Not logged-in", isLoggedIn: false },
      { status: 200 }
    );

  let querry = query(
    collection(firebaseSDK.firestore, "users"),
    where("_id", "==", uid)
  );

  const snapshot = await getDocs(querry);
  if (snapshot.empty) {
    return Response.json(
      { message: "No user found with this id", data: null },
      { status: 404 }
    );
  }
  const users = snapshot.docs.map((d) => ({ ...d?.data() }));
  if(users?.[0]){
    let user=users[0];
    
   let response=NextResponse.json(
    { user: users?.[0], message: "User fetched" },
    { status: 200 }
  )
  response.cookies.set("session",uid,{secure:true,httpOnly:true,path:"/"})
    response.cookies.set("userRole",user?.role,{secure:true,httpOnly:true,path:"/"})
     response.cookies.set("userStatus",user?.status,{secure:true,httpOnly:true,path:"/"})
  return response;

  }
}
