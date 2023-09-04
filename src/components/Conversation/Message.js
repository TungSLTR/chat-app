import { Box, Stack, styled, useTheme } from "@mui/material";
import React, { useRef } from "react";
import { Chat_History } from "../../data";
import {
  
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";
import { useRecipient } from "../../hooks/useRecipient";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { generateQueryGetMessages, transformMessage } from "../../utils/getMessagesInConversation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatElement from "../ChatElement";


const Message = ({ conversation, messages }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();
  
    const [user, _loading, _error] = useAuthState(auth)
   
  
    const queryGetMessages = generateQueryGetMessages(id)
    const [messagesSnapshot, messagesLoading] = useCollection(queryGetMessages)
    console.log(messagesSnapshot);
    const showMessages= () => {
        if (messagesLoading) {
            return messages.map((message) =>
             (<TextMsg key={message.id} message={message} />))
        }

        if (messagesSnapshot) { 
            return messagesSnapshot.docs.map((message) => 
            (<TextMsg key={message.id} message={transformMessage(message)} />))
        }
        return null
    }
    console.log(messages);
    // const renderChatElement = messages.length > 0 ? (
    //   <ChatElement messages={messages} conversationUsers={conversation.users} />
    // ) : null;
  return (
    <Box p={3}>
   {/* <div style={{ display: "none" }}>
        {renderChatElement}
      </div> */}
      <Stack spacing={3}>
        {showMessages()}
        {/* <EndOfMessagesForAutoScroll ref={endOfMessagesRef}/> */}
        {/* <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction={"row"}
            spacing={3}
            alignItems={"center"}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Kekeke.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: el.incoming ? theme.palette.text : "#fff" }}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions />}
    </Stack> */}
        {/* {Chat_History.map((el) => {
                    switch (el.type) {
                        case "divider":
                            //Timeline
                            return <Timeline el={el} />

                        case "msg":
                            switch (el.subtype) {
                                case "img":
                                    //img msg
                                    return <MediaMsg el={el} menu={menu}/>
                                 
                                case "doc":
                                    //doc msg
                                    return <DocMsg el={el} menu={menu}/>
                                case "link":
                                    //link smg
                                    return <LinkMsg el={el} menu={menu}/>
                                case "reply":
                                    //reply msg
                                    return <ReplyMsg el={el} menu={menu}/>
                                default:
                                    //text msg
                                    return <TextMsg el={el} menu={menu}/>

                            }
                            
                        default:
                            return <></>
                    }
                })} */}
      </Stack>
    </Box>
  );
};

export default Message;
