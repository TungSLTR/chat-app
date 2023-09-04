import React, { useEffect, useState } from "react";
import Chats from "./Chats";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";

import NoChatSVG from "../../assets/Illustration/NoChat";
import { useParams } from "react-router-dom";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  generateQueryGetMessages,
  transformMessage,
} from "../../utils/getMessagesInConversation";

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar, chat_type, room_id } = useSelector((state) => state.app);
  const [conversation, setConversation] = useState(null);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const calcWidthTrue = isTablet
    ? "calc(100vw - 540px)" // Giá trị khi màn hình là tablet (md)
    : "calc(100vw - 740px)"; // Giá trị khi màn hình lớn hơn tablet (lg, xl, ...

  const calcWidthFalse = isTablet
    ? "calc(100vw - 220px)" // Giá trị khi màn hình là tablet (md)
    : "calc(100vw - 420px)"; // Giá trị khi màn hình lớn hơn tablet (lg, xl, ...
  const fetchConversationCon = async () => {
    const conversationRef = doc(db, "conversations", id);
    const conversationSnapshot = await getDoc(conversationRef);
    setConversation(conversationSnapshot.data());
    console.log(conversationSnapshot.data());

    setIsLoading(false);
  };
  useEffect(() => {
    fetchConversationCon();
  }, [id]);

  console.log(conversation);
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      <Chats />
      <Box
        sx={{
          height: "100%",
          width: sidebar.open ? calcWidthTrue : calcWidthFalse,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background.paper,
        }}
      >
        {room_id !== null && chat_type === "individual" ? (
          <Conversation />
        ) : (
          <Stack
            spacing={2}
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NoChatSVG />
            <Typography variant="subtitle2">
              Select a conversation or start new one
            </Typography>
          </Stack>
        )}
      </Box>
      {sidebar.open &&
        conversation &&
        (() => {
          switch (sidebar.type) {
            case "CONTACT":
              return <Contact conversation={conversation} />;
            case "STARRED":
              return <StarredMessages />;
            case "SHARED":
              return <SharedMessages />;
            default:
              break;
          }
        })()}
    </Stack>
  );
};

export default GeneralApp;
