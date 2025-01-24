import { useSelector } from "react-redux";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Chat from "./chatFeatures/Chat";
import { sendMessageWithWebRTC } from "../utils/webRTC-Logic";
import { sendMessageWithSocketIo } from "../utils/socketLogic";

const ChatSection = () => {
  const { socketIoMessages, webrtcMessages } = useSelector(
    (state) => state.app
  );

  return (
    <Box
      h={"100dvh"}
      w={{ base: "100vw", md: "36vw", lg: "32vw" }}
      border="2px"
    >
      <Tabs isFitted h={"100%"}>
        <TabList>
          <Tab fontWeight="bold" fontSize="1.2rem">
            WebRTC chat
          </Tab>
          <Tab fontWeight="bold" fontSize="1.2rem">
            Socket.io chat
          </Tab>
        </TabList>
        <TabPanels h={"93%"}>
          <TabPanel px={0} h={"100%"}>
            <Chat messages={webrtcMessages} onSend={sendMessageWithWebRTC} />
          </TabPanel>
          <TabPanel px={0} h={"100%"}>
            <Chat
              messages={socketIoMessages}
              onSend={sendMessageWithSocketIo}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ChatSection;
