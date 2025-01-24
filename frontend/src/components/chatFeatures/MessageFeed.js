import MessageItem from "./MessageItem";

const MessageFeed = ({ messages, loggedInUser }) => {
  return (
    <>
      {messages.map((message, i) => (
        <MessageItem
          messageData={message}
          key={`${message?.userId}-${i}`}
          isSelfMessage={message?.userId === loggedInUser}
          isFirstMessage={
            i === 0 ? true : messages[i - 1]?.userId !== message?.userId
          }
        />
      ))}
    </>
  );
};

export default MessageFeed;
