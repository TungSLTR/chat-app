import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateSidebarType, resetConversation, toggleSidebar } from "../redux/slices/app";
import { faker } from "@faker-js/faker";
import AntSwitch from "./AntSwitch";
import { deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { generateQueryGetMessages, transformMessage } from "../utils/getMessagesInConversation";
import { useRecipient } from "../hooks/useRecipient";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Block this contact"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({ open, handleClose,onDelete  }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleYesClick = () => {
    onDelete(); // Gọi hàm xóa cuộc trò chuyện ở đây
    handleClose(); // Đóng dialog sau khi xóa
    dispatch(toggleSidebar(), resetConversation());
    navigate("/app/")
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Delete this chat"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleYesClick}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const Contact = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const { id } = useParams();
  const deleteConversation = async (id) => {
    await deleteDoc(doc(db, "conversations", id));
  };
  const [user, _loading, _error] = useAuthState(auth)
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
 
  const [isLoading, setIsLoading] = useState(true);

 

 
  
  useEffect(() => {
    const fetchConversation = async () => {
      const conversationRef = doc(db, "conversations", id);
      const conversationSnapshot = await getDoc(conversationRef);
      setConversation(conversationSnapshot.data());
      console.log(conversationSnapshot.data());
      
      setIsLoading(false);
    };

  
    console.log(id);
    console.log(messages);
    console.log(conversation);
    fetchConversation();
   
  }, [id]);
  const conversationUser = conversation.users;
  console.log(conversationUser);
  const {recipient, recipientEmail} = useRecipient(conversationUser)
  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={3}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton
              onClick={() => {
                dispatch(toggleSidebar());
              }}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>
        {/* Body */}
        <div className="scrollbar" style={{ overflowY: "auto" }}>
          <Stack
            sx={{
              height: "100%",
              position: "relative",
              flexGrow: 1,
            }}
            p={3}
            spacing={3}
          >
            <Stack alignItems={"center"} direction={"row"} spacing={2}>
              <Avatar
                src={faker.image.avatar()}
                alt={faker.name.firstName()}
                sx={{ height: 64, width: 64 }}
              ></Avatar>
              <Stack spacing={0.5}>
                <Typography variant="article" fontWeight={600}>
                  {faker.name.fullName()}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {"+91 777 666 555"}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
            >
              <Stack spacing={1} alignItems={"center"}>
                <IconButton>
                  <Phone />
                </IconButton>
                <Typography variant="overline">Voice</Typography>
              </Stack>
              <Stack spacing={1} alignItems={"center"}>
                <IconButton>
                  <VideoCamera />
                </IconButton>
                <Typography variant="overline">Video</Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack spacing={0.5}>
              <Typography variant="article">About</Typography>
              <Typography variant="body2">Aa</Typography>
            </Stack>
            <Divider />
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle2">Media, Links & Doc</Typography>
              <Button
                onClick={() => {
                  dispatch(UpdateSidebarType("SHARED"));
                }}
                endIcon={<CaretRight />}
              >
                401
              </Button>
            </Stack>

            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              {[1, 2, 3].map((el) => (
                <Box>
                  <img src={faker.image.food()} alt={faker.name.fullName()} />
                </Box>
              ))}
            </Stack>
            <Divider />
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Star size={21} />
                <Typography variant="subtitle2">Starred Messages</Typography>
              </Stack>
              <IconButton
                onClick={() => {
                  dispatch(UpdateSidebarType("STARRED"));
                }}
              >
                <CaretRight />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Bell size={21} />
                <Typography variant="subtitle2">Mute Notifications</Typography>
              </Stack>
              <AntSwitch />
            </Stack>
            <Divider />
            <Typography>1 group in common</Typography>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
              <Stack spacing={0.5}>
                <Typography variant="subtitle2">Aa</Typography>
                <Typography variant="caption">Aa, Bb, Cc</Typography>
              </Stack>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Button
                onClick={() => {
                  setOpenBlock(true);
                }}
                startIcon={<Prohibit />}
                fullWidth
                variant="outlined"
              >
                Block
              </Button>
              <Button
                onClick={() => {
                  setOpenDelete(true);
                }}
                startIcon={<Trash />}
                fullWidth
                variant="outlined"
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </div>
      </Stack>
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
      {openDelete && (
        <DeleteDialog
          open={openDelete}
          handleClose={handleCloseDelete}
          onDelete={() => {
            deleteConversation(id);
          }}
        />
      )}
    </Box>
  );
};

export default Contact;
