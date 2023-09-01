import React, { useState } from "react";
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
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
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";

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
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setNewMessage(newMessage + emoji);
  };
     


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
              onEmojiSelect={addEmoji}
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

export default Footer;
