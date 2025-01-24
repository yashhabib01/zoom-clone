import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { Box, Button, FormControl, Input } from "@chakra-ui/react";

const MessageInput = ({ onSend }) => {
  const [enteredMessage, setEnteredMessage] = useState("");

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (enteredMessage.trim().length > 0) {
      onSend(enteredMessage);
      setEnteredMessage("");
    }
  };

  return (
    <form onSubmit={sendMessageHandler}>
      <Box px={1} w={"100%"} display="flex" alignItems="center" gap={1}>
        <FormControl isRequired>
          <Input
            p={2}
            bg="white"
            variant="filled"
            value={enteredMessage}
            placeholder="Enter a message..."
            onChange={(e) => setEnteredMessage(e.target.value)}
          />
        </FormControl>
        <Button type="submit" colorScheme={"blue"}>
          <IoMdSend />
        </Button>
      </Box>
    </form>
  );
};

export default MessageInput;
