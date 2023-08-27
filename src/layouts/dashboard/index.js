import { Stack } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";

import "../../global.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { connectSocket, socket } from "../../socket";
import { selectConversation, showSnackbar } from "../../redux/slices/app";
import {
  AddDirectConversation,
  UpdateDirectConversation,
} from "../../redux/slices/conversation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { LogInGGUser } from "../../redux/slices/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    console.log(user);
  }, [user]);
  const { isLoggedIn } = useSelector((state) => state.auth);
  // if (user) {
  //   dispatch(LogInGGUser())
  // }
  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const { user_id } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   if (isLoggedIn || user) {
  //     window.onload = function () {
  //       if (!window.location.hash) {
  //         window.location = window.location + "#loaded";
  //         window.location.reload();
  //       }
  //     };
  //     window.onload();

  //   }
  // })

  // }, [isLoggedIn]);
  // useEffect(() => {
  //   if ( user) {
  //     window.onload = function () {
  //       if (!window.location.hash) {
  //         window.location = window.location + "#loaded";
  //         window.location.reload();
  //       }
  //     };
  //     window.onload();

  //   }

  // }, [user]);
  // if (error) {
  //   return (
  //     <div>
  //       <p>Error: {error}</p>
  //     </div>
  //   );
  // }
  // if (loading) return <h1>Loading</h1>;

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', user?.email) , {
            email: user?.email,
            lastSeen: serverTimestamp(),
            photoURL: user?.photoURL
          }, {merge: true}
        )
      } catch (error) {
        console.log(error);
      }
    }
    if (user) {
      setUserInDb()
    }
    
  },[user])
  if (isLoggedIn === false || user === false) {
    console.log("user is false"); 
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <Stack direction="row">
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
