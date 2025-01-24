import { Box } from "@chakra-ui/react";
import MeetingSection from "../components/MeetingSection";
import ChatSection from "../components/ChatSection";

const MeetingPage = () => {
  return (
    <Box
      w={"100vw"}
      display="flex"
      flexDirection={{ base: "column", md: "row", lg: "row" }}
    >
      <MeetingSection />
      <ChatSection />
    </Box>
  );
};

export default MeetingPage;
