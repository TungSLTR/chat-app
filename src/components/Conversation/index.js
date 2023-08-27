import React, { useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Header from "./Header";
// import Footer from "./Footer";
import Message from "./Message";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";

import {
  generateQueryGetMessages,
  transformMessage,
} from "../../utils/getMessagesInConversation";
import { useState } from "react";
import NoChatSVG from '../../assets/Illustration/NoChat'
import { animateScroll } from 'react-scroll';

import {

  Fab,
  IconButton,
  InputAdornment,

  TextField,
  Tooltip,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import { styled, useTheme } from "@mui/material/styles";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";




const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];
const Footer = ({conversation, messages, onSendMessage}) => {
  const { id } = useParams();

  const [newMessage, setNewMessage] = useState('')
  const [user, _loading, _error] = useAuthState(auth)
  const addMessageToDbAndUpdateLastSeen = async () => {
    await setDoc(
      doc(db, 'users', user?.email), {
        lastSeen: serverTimestamp()
      }, {merge: true}
    )

    await addDoc(collection(db, 'messages'), {
      conversation_id: id,
      sent_at: serverTimestamp(),
    text: newMessage,
    user: user?.email
    })
    // reset input field
  setNewMessage('')
  // scroll to bottom
  onSendMessage();
  }
  const sendMessageOnEnter = event => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (!newMessage) return
      addMessageToDbAndUpdateLastSeen()
    }
  }

  const sendMessageOnClick = event => {
    event.preventDefault()
    if (!newMessage) return
    addMessageToDbAndUpdateLastSeen()
  }

  const [openActions, setOpenActions] = React.useState(false);
   
     


  const theme = useTheme();

  const [openPicker, setOpenPicker] = React.useState(false);

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.default,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={3}>
        {/* StyledInput */}
        <Stack sx={{ width: "100%" }}>
          <Box
            sx={{
              display: openPicker ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 81,
              right: 100,
            }}
          >
            <Picker
              theme={theme.palette.mode}
              data={data}
              onEmojiSelect={console.log}
            />
          </Box>

          {/* <ChatInput setOpenPicker={setOpenPicker} /> */}
           <StyledInput
        fullWidth
        placeholder="Aa"
        variant="filled"
        value={newMessage}
        onChange={event => setNewMessage(event.target.value)}
        onKeyDown={sendMessageOnEnter}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <Stack sx={{ width: "max-content" }}>
              <Stack
                sx={{
                  position: "relative",
                  display: openActions ? "inline-block" : "none",
                }}
              >
                {Actions.map((el) => (
                  <Tooltip placement="right" title={el.title}>
                    <Fab
                      sx={{
                        position: "absolute",
                        top: -el.y,
                        backgroundColor: el.color,
                      }}
                    >
                      {el.icon}
                    </Fab>
                  </Tooltip>
                ))}
              </Stack>
              <InputAdornment>
                <IconButton
                  onClick={() => {
                    setOpenActions((prev) => !prev);
                  }}
                >
                  <LinkSimple />
                </IconButton>
              </InputAdornment>
            </Stack>
          ),
          endAdornment: (
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenPicker((prev) => !prev);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
        </Stack>

        <Box
          sx={{
            height: 48,
            width: 48,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={sendMessageOnClick} disabled={!newMessage} >
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};


const Conversation = () => {
  const [user, _loading, _error] = useAuthState(auth)
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Tự động cuộn xuống khi có tin nhắn mới
    animateScroll.scrollToBottom({
      containerId: 'message-container',
      
    });
  }, [messages]);
  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({behavior: 'smooth'})
  }
  
  useEffect(() => {
    const fetchConversation = async () => {
      const conversationRef = doc(db, "conversations", id);
      const conversationSnapshot = await getDoc(conversationRef);
      setConversation(conversationSnapshot.data());
      console.log(conversationSnapshot.data());
      
      setIsLoading(false);
    };

    const fetchMessages = async () => {
      const queryMessages = generateQueryGetMessages(id);
      const messagesSnapshot = await getDocs(queryMessages);

      // console.log(messagesSnapshot.docs[0].data());
      const messagesTrans = messagesSnapshot.docs.map((messageDoc) =>
        transformMessage(messageDoc)
      );
      setMessages(messagesTrans);
    };
    console.log(id);
    console.log(messages);
    console.log(conversation);
    fetchConversation();
    fetchMessages();
  }, [id]);
  const handleSendMessage = () => {
    scrollToBottom(); // Gọi scrollToBottom từ Conversation
  };

  const [newMessage, setNewMessage] = useState('')
  // const [user, _loading, _error] = useAuthState(auth)
  const addMessageToDbAndUpdateLastSeen = async () => {
    await setDoc  (
      doc(db, 'users', user?.email), {
        lastSeen: serverTimestamp()
      }, {merge: true}
    )

    await addDoc(collection(db, 'messages'), {
      conversation_id: id,
      sent_at: serverTimestamp(),
    text: newMessage,
    user: user?.email
    })
    // reset input field
  setNewMessage('')
  // scroll to bottom
  scrollToBottom()
  }
  const sendMessageOnEnter = event => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (!newMessage) return
      addMessageToDbAndUpdateLastSeen()
    }
  }

  const sendMessageOnClick = event => {
    event.preventDefault()
    if (!newMessage) return
    addMessageToDbAndUpdateLastSeen()
  }

  const [openActions, setOpenActions] = React.useState(false);
   
     


  const theme = useTheme();

  const [openPicker, setOpenPicker] = React.useState(false);
  if (isLoading) {
    return  <Stack spacing={2} sx={{height: "100%", width: "100%", alignItems: 'center', justifyContent: 'center'}} >
    <NoChatSVG/>
    <Typography variant="subtitle2">Select a conversation or start new one</Typography>
  </Stack>;
  }
  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/* Chat Header */}
      <Header conversation={conversation} messages={messages}  />
      {/* Msg */}
      <div id="message-container" className="scrollbar" style={{ overflowY: "auto",  height: "100vh" }}>
        <Box width={"100%"} sx={{ flexGrow: 1, height: "100%" }}>
          <Message conversation={conversation} messages={messages}  />
          <div ref={endOfMessagesRef} style={{marginBottom: '50px'}} />
        </Box>
      </div>

      {/* Chat Footer */}
      <Footer conversation={conversation} messages={messages} onSendMessage={handleSendMessage}/>
    
    </Stack>
  );
};

export default Conversation;
