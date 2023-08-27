export const getRecipientEmail = (conversationUsers, user) =>
  conversationUsers.find(userEmail => userEmail !== user?.email);
