import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { selectConversation } from "../redux/slices/app";
import { useRecipient } from "../hooks/useRecipient";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { generateQueryGetMessages, transformMessage } from "../utils/getMessagesInConversation";

const ChatElement = ({ id, conversationUsers, latestMessage }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  // const [lastMessage, setLastMessage] = useState();
  const onSelectConversation = (id) => {
    navigate(`/app/${id}`);
  };

  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  
  return (
    <>
      <Link component={RouterLink} to={`/app/${id}`} underline="none">
        <Box
          onClick={() => {
            dispatch(selectConversation({ room_id: id }));
            onSelectConversation(id);
          }}
          sx={{
            width: "100%",
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#fff"
                : theme.palette.background.paper,
          }}
          p={2}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
           <Stack direction={"row"} spacing={2}>
  {recipient?.photoURL ? (
    <Avatar src={recipient.photoURL} />
  ) : (
    <Avatar>
      {" "}
      {recipientEmail && recipientEmail[0].toUpperCase()}
    </Avatar>
  )}
  {isTablet ? null : ( // Kiểm tra kích thước màn hình và chỉ hiển thị tên người dùng trên màn hình lớn hơn "md"
    <Stack spacing={0.3}>
      <Typography
        variant="subtitle2"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "190px",
        }}
      >
        {recipientEmail}
      </Typography>
      {latestMessage ? (
        <Typography variant="caption">{latestMessage.text}</Typography>
      ) : (
        <Typography variant="caption">No messages</Typography>
      )}
    </Stack>
  )}
</Stack>
            <Stack spacing={2} alignItems={"center"}>
              {/* <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread}></Badge> */}
            </Stack>
          </Stack>
        </Box>
      </Link>
    </>
  );
};

export default ChatElement;
