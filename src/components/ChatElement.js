import { faker } from "@faker-js/faker";
import { Avatar, Badge, Box, Stack, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { useDispatch } from "react-redux";
import { selectConversation } from "../redux/slices/app";
import { useRecipient } from "../hooks/useRecipient";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
const ChatElement = ({ id, conversationUsers }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSelectConversation = (id) => {
    navigate(`/app/${id}`);
  };
  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  return (
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
            {/* {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={faker.image.avatar()} />
            </StyledBadge>
          ) : (
            <Avatar src={faker.image.avatar()} />
          )} */}
            {recipient?.photoURL ? (
              <Avatar src={recipient.photoURL} />
            ) : (
              <Avatar>
                {" "}
                {recipientEmail && recipientEmail[0].toUpperCase()}
              </Avatar>
            )}
            <Stack spacing={0.3}>
              <Typography variant="subtitle2" sx={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '190px'}}>{recipientEmail}</Typography>
              {/* <Typography variant="caption">{msg}</Typography> */}
            </Stack>
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
  );
};

export default ChatElement;
