import { Container, Stack } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Logo from "../../assets/Images/logo.ico";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { LogInGGUser } from "../../redux/slices/auth";
const MainLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  // if(isLoggedIn) {
  //   return <Navigate to={'/app'} />
  // }
  const [user, loading, error] = useAuthState(auth);
  // if (error) {
  //   return (
  //     <div>
  //       <p>Error: {error}</p>
  //     </div>
  //   );
  // }
  if (user) {
    dispatch(LogInGGUser());
  }
 
  
  if (isLoggedIn === true || user === true) {
    console.log("user is true"); // Đây là nơi bạn có thể log ra thông báo khi loggedInUser là true
    return <Navigate to={"/app"} />;
  }
  
  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack
            sx={{ width: "100%" }}
            direction={"column"}
            alignItems={"center"}
          >
            <img style={{ height: 120, width: 120 }} src={Logo} alt="Logo" />
          </Stack>
        </Stack>

        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
