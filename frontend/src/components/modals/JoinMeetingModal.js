import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { actions } from "../../store/slice";
import {
  closeMediaDevices,
  getLocalPreviewAndInitRoomConnection,
} from "../../utils/webRTC-Logic";

const JoinMeetingModal = ({ children }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userId, isRoomHost, connectOnlyWithAudio, meetingId, errorMessage } =
    useSelector((state) => state.app);

  const [meetingDetails, setMeetingDetails] = useState({
    name: "",
    meetingId: "",
    joining: false,
  });

  const inputChangeHandler = (e) => {
    setMeetingDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const closeModalHandler = () => {
    setMeetingDetails({ name: "", meetingId: "" });
    onClose();
  };

  const joinMeetingHandler = async (e) => {
    e.preventDefault();

    if (meetingDetails.name.trim() === "") {
      toast({
        title: "Name is required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    } else if (!isRoomHost && meetingDetails.meetingId.trim() === "") {
      toast({
        title: "Meeting id is required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const joinMeeting = async () => {
      dispatch(actions.setUserName({ name: meetingDetails.name }));
      await getLocalPreviewAndInitRoomConnection(
        userId,
        meetingDetails.name,
        connectOnlyWithAudio,
        isRoomHost,
        meetingDetails.meetingId
      );
    };

    await joinMeeting();

    // if (!isRoomHost) {
    //   setMeetingDetails((prev) => {
    //     return {
    //       ...prev,
    //       joining: true,
    //     };
    //   });

    //   await axios
    //     .get(`/api/room/${meetingDetails.meetingId}`)
    //     .then(async (res) => {
    //       // console.log(res.data);
    //       if (res.data.roomExists) {
    //         if (res.data.roomIsFull) {
    //           toast({
    //             title: "Meeting is full!",
    //             status: "error",
    //             duration: 3000,
    //             isClosable: true,
    //             position: "top",
    //           });
    //         } else {
    //           await joinMeeting();
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       toast({
    //         title: err.response.data.message,
    //         status: "error",
    //         duration: 3000,
    //         isClosable: true,
    //         position: "top",
    //       });
    //     });

    //   setMeetingDetails((prev) => {
    //     return {
    //       ...prev,
    //       joining: false,
    //     };
    //   });
    // } else {
    //   await joinMeeting();
    // }
  };

  useEffect(() => {
    if (meetingId) {
      navigate(`/meeting/${meetingId}`);
    }
  }, [meetingId]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      closeMediaDevices();
    }
  }, [errorMessage]);

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            {isRoomHost ? "Host" : "Join"} meeting
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={joinMeetingHandler}>
            <ModalBody>
              {!isRoomHost && (
                <FormControl isRequired>
                  <FormLabel>Meeting id :</FormLabel>
                  <Input
                    mb={4}
                    name="meetingId"
                    placeholder="Enter meeting id"
                    value={meetingDetails.meetingId}
                    onChange={inputChangeHandler}
                    errorBorderColor="red.300"
                  />
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel>Name :</FormLabel>
                <Input
                  name="name"
                  placeholder="Enter your name"
                  value={meetingDetails.name}
                  onChange={inputChangeHandler}
                  errorBorderColor="red.300"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                type="submit"
                colorScheme="blue"
                isLoading={meetingDetails.joining}
                loadingText="Joining..."
              >
                Join
              </Button>
              <Button
                type="button"
                variant={"ghost"}
                colorScheme="blue"
                onClick={closeModalHandler}
                isLoading={meetingDetails.joining}
                loadingText=""
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JoinMeetingModal;
