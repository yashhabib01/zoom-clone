import { useSelector } from "react-redux";
import { MdContentCopy } from "react-icons/md";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import MicButton from "./MicButton";
import CameraButton from "./CameraButton";
import Participants from "./Participants";
import LeaveCallButton from "./LeaveCallButton";
import ScreenShareButton from "./ScreenShareButton";

const MeetingOptions = () => {
  const toast = useToast();
  const meetingId = useSelector((state) => state.app.meetingId);

  return (
    <Box
      py={3}
      px={2}
      w={"100%"}
      bg={"#0078FF"}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Button
        p={{ base: 1.25, md: 2.5, lg: 2.5 }}
        onClick={() => {
          navigator.clipboard.writeText(meetingId);
          toast({
            title: "Meeting id copied to clipboard",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }}
      >
        <MdContentCopy size={"1.1rem"} />
        <Text ml={1} display={{ base: "none", md: "block", lg: "block" }}>
          Copy meeting id
        </Text>
      </Button>
      <Box display="flex" alignItems="center" gap={{ base: 2.5, md: 4, lg: 4 }}>
        <CameraButton />
        <ScreenShareButton />
        <MicButton />
        <LeaveCallButton />
        <Participants />
      </Box>
    </Box>
  );
};

export default MeetingOptions;
