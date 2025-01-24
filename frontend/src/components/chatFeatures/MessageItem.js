import { Box, Text } from "@chakra-ui/react";

const MessageItem = ({ messageData, isSelfMessage, isFirstMessage }) => {
  return (
    <Box
      m={1}
      display="flex"
      justifyContent={isSelfMessage ? "flex-end" : "flex-start"}
    >
      <Box>
        {isFirstMessage && (
          <Text
            mt={2}
            fontWeight="bold"
            textAlign={isSelfMessage ? "end" : "start"}
          >
            {isSelfMessage ? "You" : messageData.userName}
          </Text>
        )}
        <Text
          px={2.5}
          py={1.5}
          w="fit-content"
          borderRadius="md"
          color={isSelfMessage ? "white" : "black"}
          bg={isSelfMessage ? "#0078FF" : "gray.200"}
        >
          {messageData.messageContent}
        </Text>
      </Box>
    </Box>
  );
};

export default MessageItem;
