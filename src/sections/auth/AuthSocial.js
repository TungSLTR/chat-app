import { Divider, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo, TwitterLogo } from "phosphor-react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
// import { LogInGGUser } from "../../redux/slices/auth";

const AuthSocial = () => {

  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
  
  const signInGoogle = () => {
    signInWithGoogle()

  }
  

  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: "overline",
          color: "text.disabled",
          "&::before, ::after": { borderTopStyle: "dashed" },
        }}
      >
        OR
      </Divider>
      <Stack direction={"row"} justifyContent={"center"} spacing={2}>
        <IconButton onClick={() => signInWithGoogle()}>
          <GoogleLogo color="#DF3E30" />
        </IconButton>
        <IconButton color="inherit">
          <GithubLogo />
        </IconButton>
        <IconButton>
          <TwitterLogo color="#1C9CEA" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default AuthSocial;
