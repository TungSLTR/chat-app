import { collection, orderBy, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../firebase";

export const generateQueryGetMessages = (conversationId) =>
  query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "asc")
  );

export const transformMessage = (message) => ({
  id: message.id,
  ...message.data(),
  sent_at: message.data().sent_at
    ? convertFirestoreTimestampToString(message.data().sent_at)
    : null,
});
export const getLatestMessageQuery = (conversationId) => {
  return query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "desc"),
    limit(1) // Lấy 1 tin nhắn mới nhất
  );
};
// export const getLatestMessage = async (conversationId) => {
//   try {
//     const messageQuery = query(
//       collection(db, "messages"),
//       orderBy("sent_at", "desc"), // Sắp xếp theo thời gian gửi giảm dần (tức là tin nhắn mới nhất đầu tiên).
//       limit(1) // Giới hạn số lượng kết quả trả về là 1.
//     );

//     const messageSnapshot = await getDocs(messageQuery);

//     if (!messageSnapshot.empty) {
//       // Nếu có tin nhắn trong cuộc trò chuyện
//       const latestMessage = messageSnapshot.docs[0].data();
//       console.log("Latest Message:", latestMessage);
//       // Xử lý tin nhắn mới nhất ở đây.
//     } else {
//       console.log("Không có tin nhắn trong cuộc trò chuyện.");
//     }
//   } catch (error) {
//     console.error("Lỗi khi lấy tin nhắn mới nhất:", error);
//   }
// };
export const convertFirestoreTimestampToString = (timestamp) =>
  new Date(timestamp.toDate().getTime()).toLocaleString();
