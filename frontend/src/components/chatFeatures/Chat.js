import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import MessageFeed from "./MessageFeed";
import MessageInput from "./MessageInput";

const Chat = ({ messages, onSend }) => {
  const { userId } = useSelector((state) => state.app);

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current.scrollIntoView();
  }, [messages]);

  return (
    <Box
      mb={1}
      w="100%"
      h="100%"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"flex-end"}
    >
      <Box
        p={1}
        mb={2}
        h={"93%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-end"}
      >
        <Box overflowY={"scroll"}>
          <MessageFeed messages={messages} loggedInUser={userId} />
          <div ref={messageEndRef}></div>
        </Box>
      </Box>
      <MessageInput onSend={onSend} />
    </Box>
  );
};

export default Chat;
