import { collection, orderBy, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const generateQueryGetMessages = (conversationId) =>
  query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "asc")
  );

export const transformMessage = (message) => ({
  // const data = message.data();

  // return {
  //     id: message.id,
  //     ...data,
  //     sent_at: data.sent_at
  //         ? convertFirestoreTimestampToString(data.sent_at)
  //         : null,
  // };
  id: message.id,
  ...message.data(),
  sent_at: message.data().sent_at
    ? convertFirestoreTimestampToString(message.data().sent_at)
    : null,
});

export const convertFirestoreTimestampToString = (timestamp) =>
  new Date(timestamp.toDate().getTime()).toLocaleString();
