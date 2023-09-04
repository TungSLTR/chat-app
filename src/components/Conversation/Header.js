import React from "react";
import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import StyledBadge from "../StyledBadge";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slices/app";
import { useRecipient } from "../../hooks/useRecipient";
import { convertFirestoreTimestampToString } from "../../utils/getMessagesInConversation";

const Header = ({ conversation, messages }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
console.log(conversation);
  const conversationUser = conversation.users;
  console.log(conversationUser);
  const { recipient, recipientEmail } = useRecipient(conversationUser);
  console.log(recipient);
  console.log(recipientEmail);
  return (
    <Box
      p={2}
      sx={{
        height: 100,
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.default,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"space-between"}
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          onClick={() => {
            dispatch(toggleSidebar());
          }}
          direction={"row"}
          spacing={2}
        >
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              {/* <Avatar alt={faker.name.fullName()} src={faker.image.avatar()} /> */}
              {recipient?.photoURL ? (
                <Avatar src={recipient.photoURL} />
              ) : (
                <Avatar>
                  {" "}
                  {recipientEmail && recipientEmail[0].toUpperCase()}
                </Avatar>
              )}
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">{recipientEmail}</Typography>
            <Typography variant="caption">
              {/* Online */}
              {recipient && (
                <span>
                  Last online:{" "}
                  {convertFirestoreTimestampToString(recipient.lastSeen)}
                </span>
              )}
            </Typography>
          </Stack>
        </Stack>
        {/* <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack> */}
      </Stack>
    </Box>
  );
};

export default Header;
