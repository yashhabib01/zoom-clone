import { useDispatch } from "react-redux";
import { Box, Button, Text } from "@chakra-ui/react";
import JoinMeetingModal from "../components/modals/JoinMeetingModal";
import { actions } from "../store/slice";

const HomePage = () => {
  const dispatch = useDispatch();

  return (
    <Box h={"100dvh"} display={"grid"} placeItems="center">
      <Box
        w={{ base: "98vw", md: "45vw", lg: "33dvw" }}
        h={"60dvh"}
        display={"grid"}
        placeItems="center"
        borderWidth="2px"
        borderColor={"gray"}
      >
        <Box display={"flex"} flexDirection="column" alignItems="center">
          <Text
            mb={10}
            fontSize={"xxx-large"}
            fontWeight={"bolder"}
            color={"#3182ce"}
            textAlign="center"
          >
            Zoom Clone
          </Text>
          <JoinMeetingModal>
            <Button
              my={2.5}
              px={10}
              colorScheme={"blue"}
              onClick={() =>
                dispatch(actions.setIsRoomHost({ isRoomHost: false }))
              }
            >
              Join a meeting
            </Button>
          </JoinMeetingModal>
          <JoinMeetingModal>
            <Button
              my={1}
              px={9}
              border="2px"
              variant="outline"
              colorScheme={"blue"}
              onClick={() =>
                dispatch(actions.setIsRoomHost({ isRoomHost: true }))
              }
            >
              Host a meeting
            </Button>
          </JoinMeetingModal>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
