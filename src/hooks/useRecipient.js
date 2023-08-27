import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { getRecipientEmail } from "../utils/getRecipientEmail";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const useRecipient = (conversationUsers) => {
  const [user, __loading, __error] = useAuthState(auth);

  //get recipient mail
  const recipientEmail = getRecipientEmail(conversationUsers, user);
  //get recipient avatar
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  );
  const [recipientsSnapshot] = useCollection(queryGetRecipient);

  const recipient = recipientsSnapshot?.docs[0]?.data();
  return {recipient, recipientEmail};
};
