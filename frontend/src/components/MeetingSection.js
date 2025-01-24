import { Box } from "@chakra-ui/react";
import MeetingOptions from "./MeetingOptions";
import VideosSection from "./VideosSection";

const MeetingSection = () => {
  return (
    <Box w={{ base: "100vw", md: "64vw", lg: "68vw" }} h={"100dvh"}>
      <MeetingOptions />
      <VideosSection />
    </Box>
  );
};

export default MeetingSection;
