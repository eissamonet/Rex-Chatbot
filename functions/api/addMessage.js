const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {logger} = functions;
exports.addMessage = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Received message request data:", data);
    // console.log("data = ", data);
    // console.log("context = ", context);
    // Validate requires fields.
    if (!data.text || !data.userId) {
      logger.log("Required fields (text or userId) are missing");
      throw new functions.https.HttpsError("invalid-argument",
      "Required fields (text or userId) are missing");
    }
    // Destructure the 'data' object to extract 'text' and 'userId' properties.
    const {text, userId} = data;
    // Construct message data.
    const messageData = {
      text,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    console.log("messageData = ", messageData);
    const messageRef = await admin
    .firestore()
    .collection("messages")
    .add(messageData)
    .collection("chats")
    .doc(userId);
    logger.log("Message added successfully, message ID:", messageRef.id);
    return {status: "success", messageId: messageRef.id};
  } catch (error) {
    logger.log("Error adding message:", error);
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while adding the message",
        error.message,
    );
  }
});
