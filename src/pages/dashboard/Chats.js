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
  useMediaQuery,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Plus,
  User,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";

import "../../global.css";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import * as validator from "email-validator";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getLatestMessageQuery } from "../../utils/getMessagesInConversation";

const StyledNewChatButton = styled(Button)`
  width: 100%;
`;

const Chats = () => {
  const [user, __loading, __error] = useAuthState(auth);
  const theme = useTheme();
  const [isOpenNewConversation, setIsOpenNewConversation] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [latestMessages, setLatestMessages] = useState({});
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const containerWidth = isTablet ? 120 : 320;
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
    const userRef = doc(db, "users", email);
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
  const sendMessageOnEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!recipientEmail) return;
      createConversation();
    }
  };
  const createConversation = async () => {
    if (!recipientEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!validator.validate(recipientEmail)) {
      setEmailError("Invalid email format");
      return;
    }

    if (isInvitingSelf) {
      setEmailError("You cannot invite yourself");
      return;
    }

    if (isConversationAlreadyExists(recipientEmail)) {
      setEmailError("Conversation already exists");
      return;
    }

    if (!(await isUserExist(recipientEmail))) {
      setEmailError("User does not exist");
      return;
    }

    await addDoc(collection(db, "conversations"), {
      users: [user?.email, recipientEmail],
    });
    closeNewConversationDialog();
  };
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const navigate = useNavigate();
  const fetchLatestMessage = (conversationId) => {
    const latestMessageQuery = getLatestMessageQuery(conversationId);
    const unsubscribe = onSnapshot(latestMessageQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const latestMessage = querySnapshot.docs[0].data();
        setLatestMessages((prevMessages) => ({
          ...prevMessages,
          [conversationId]: latestMessage,
        }));
        console.log("Tin nhắn mới nhất:", latestMessage);
      } else {
        // Nếu không có tin nhắn, bạn có thể đặt giá trị null hoặc một giá trị mặc định khác cho latestMessages
        setLatestMessages((prevMessages) => ({
          ...prevMessages,
          [conversationId]: null,
        }));
        console.log("Không có tin nhắn trong cuộc trò chuyện.");
      }
    });
    return unsubscribe; // Trả về hàm unsubscribe để ngừng theo dõi sau này
  };

  const [sortedConversations, setSortedConversations] = useState([]);

  useEffect(() => {
    const unsubscribeCallbacks = [];

    conversationsSnapShot?.docs.forEach((conversation) => {
      const conversationId = conversation.id;
      const unsubscribe = fetchLatestMessage(conversationId);
      unsubscribeCallbacks.push(unsubscribe);
    });

    // Ngừng theo dõi khi component unmount
    return () => {
      unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    };
  }, [conversationsSnapShot]);

  useEffect(() => {
    // Sắp xếp danh sách cuộc trò chuyện khi latestMessages thay đổi
    const sorted = conversationsSnapShot?.docs
      .map((conversation) => {
        const conversationId = conversation.id;
        return {
          id: conversationId,
          users: conversation.data().users,
          latestMessage: latestMessages[conversationId],
        };
      })
      .sort((a, b) => {
        // So sánh thời gian gửi tin nhắn mới nhất trong a và b
        const timeA = a.latestMessage ? a.latestMessage.sent_at || 0 : 0;
        const timeB = b.latestMessage ? b.latestMessage.sent_at || 0 : 0;

        // Sắp xếp giảm dần theo thời gian
        return timeB - timeA;
      });

    setSortedConversations(sorted);
  }, [conversationsSnapShot, latestMessages]);

  const onSelectConversation = (id) => {
    navigate(`/app/${id}`);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: containerWidth,
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
            {isTablet ? null : (
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
            )}
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

          {isTablet ? (
            <IconButton
              onClick={() => {
                toggleNewConversationDialog(true);
              }}
            >
              <Plus style={{ color: theme.palette.primary.main }} />
            </IconButton>
          ) : (
            <StyledNewChatButton
              onClick={() => {
                toggleNewConversationDialog(true);
              }}
            >
              Start a new conversation
            </StyledNewChatButton>
          )}
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
                {sortedConversations?.map((sortedConversation) => (
                  <ChatElement
                    key={sortedConversation.id}
                    id={sortedConversation.id}
                    conversationUsers={sortedConversation.users}
                    latestMessage={sortedConversation.latestMessage}
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
            onKeyDown={sendMessageOnEnter}
            onChange={(event) => {
              setRecipientEmail(event.target.value);
              setEmailError(""); // Clear any previous error when user types
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
