"use client";
import React, { useEffect, useState } from "react";
import firebaseSDK from "./firebase/firebase.config";
import { useDispatch } from "react-redux";
import { setActiveUser } from "./redux/actions";
import getInitialStates from "./initialStates";



const RootLevelOps = () => {
const dispatch=useDispatch();

  const getCurrentUserProfile = async (uid) => {
    let response = await fetch(`/api/getUserRole?uid=${uid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let data = await response?.json();
    if (data?.user) {
      console.log("User", data?.user);
      dispatch(setActiveUser(data?.user));
      return data?.user
    } else console.log("User not found");
  };

  useEffect(() => {





    firebaseSDK.auth.onAuthStateChanged (async(r)=>{
        let user=await getCurrentUserProfile(r?.uid);
        if(user )
            getInitialStates(dispatch, user?.role);
        
    })
  }, []);

  return null;
};

export default RootLevelOps;
