import {
  Box,
  IconButton,
  Stack,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  User,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";

import { ChatList } from "../../data";
import "../../global.css";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import * as validator from "email-validator";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc, getDoc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const StyledNewChatButton = styled(Button)`
  width: 100%;
`;
const user_id = window.localStorage.getItem("user_id");

const Chats = () => {
  const [user, __loading, __error] = useAuthState(auth);
  const [isOpenNewConversation, setIsOpenNewConversation] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailError, setEmailError] = useState('');

  const toggleNewConversationDialog = (isOpen) => {
    setIsOpenNewConversation(isOpen);
    if (!isOpen) {
      setRecipientEmail("");
    }
  };
  const closeNewConversationDialog = () => {
    toggleNewConversationDialog(false);
  };

  const isInvitingSelf = recipientEmail === user?.email;
  const isUserExist = async (email) => {
    const userRef = doc(db, 'users', email);
    const userSnapshot = await getDoc(userRef);
    return userSnapshot.exists();
  };
  const queryGetConversationsForCurrentUser = user?.email
    ? query(
        collection(db, "conversations"),
        where("users", "array-contains", user.email)
      )
    : null;
  const [conversationsSnapShot] = useCollection(
    queryGetConversationsForCurrentUser
  );
  const isConversationAlreadyExists = (recipientEmail) =>
    conversationsSnapShot?.docs.find((conversation) =>
      conversation.data().users.includes(recipientEmail)
    );

  // const createConversation = async () => {
  //   if (!recipientEmail) return;

  //   if (
  //     validator.validate(recipientEmail) &&
  //   !isInvitingSelf &&
  //   !isConversationAlreadyExists(recipientEmail) &&
  //   (await isUserExist(recipientEmail))
  //   ) {
  //     //add

  //     await addDoc(collection(db, "conversations"), {
  //       users: [user?.email, recipientEmail],
  //     });
  //   }
  //   closeNewConversationDialog();
  // };
  const createConversation = async () => {
    if (!recipientEmail) {
      setEmailError('Email is required');
      return;
    }
  
    if (!validator.validate(recipientEmail)) {
      setEmailError('Invalid email format');
      return;
    }
  
    if (isInvitingSelf) {
      setEmailError('You cannot invite yourself');
      return;
    }
  
    if (isConversationAlreadyExists(recipientEmail)) {
      setEmailError('Conversation already exists');
      return;
    }
  
    if (!(await isUserExist(recipientEmail))) {
      setEmailError('User does not exist');
      return;
    }
  
    await addDoc(collection(db, 'conversations'), {
      users: [user?.email, recipientEmail],
    });
    closeNewConversationDialog();
  };
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();

  // const { conversations } = useSelector(
  //   (state) => state.conversation.direct_chat
  // );
  // useEffect(() => {
  //   socket.emit("get_direct_conversations", { user_id }, (data) => {
  //     //data => list of conversations
  //   });
  // }, []);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const navigate = useNavigate();

  // const onSelectConversation = (id) => {
  //   navigate(`/app/${id}`);
  // };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: 320,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background.default,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
              >
                <User />
              </IconButton>
              <IconButton>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>

          <StyledNewChatButton
            onClick={() => {
              toggleNewConversationDialog(true);
            }}
          >
            Start a new conversation
          </StyledNewChatButton>
          <div className="scrollbar" style={{ overflowY: "auto" }}>
            <Stack
              spacing={2}
              direction={"column"}
              sx={{ flexGrow: 1, height: "100%" }}
            >
              <Stack spacing={2.4}>
                {/* <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  Pinned
                </Typography>
                {ChatList.filter((el) => el.pinned).map((el) => {
                  return <ChatElement {...el} />;
                })}
              </Stack>
              <Stack spacing={2.4}> */}
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Chats
                </Typography>
                {/* {conversations
                  .filter((el) => !el.pinned)
                  .map((el) => {
                    return <ChatElement {...el} />;
                  })} */}
                {conversationsSnapShot?.docs.map((conversation) => (
                  <ChatElement
                    key={conversation.id}
                    id={conversation.id}
                    conversationUsers={conversation.data().users}
                    // onClick={onSelectConversation(conversation.id)}
                  />
                ))}
              </Stack>
            </Stack>
          </div>
        </Stack>
      </Box>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
      <Dialog open={isOpenNewConversation} onClose={closeNewConversationDialog}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a Google email address for the user you wish to chat
            with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(event) => {
              setRecipientEmail(event.target.value);
              setEmailError(''); // Clear any previous error when user types
            }}
            error={!!emailError} // Set error state based on whether there's an error message
            helperText={emailError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConversationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversation}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chats;
