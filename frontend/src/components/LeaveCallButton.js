import { Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdCallEnd } from "react-icons/md";
import { actions } from "../store/slice";
import { leaveMeetingHandler } from "../utils/socketLogic";
import { closeMediaDevices } from "../utils/webRTC-Logic";

const LeaveCallButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId, userName, meetingId } = useSelector((state) => state.app);

  const leaveCallHandler = () => {
    leaveMeetingHandler({ userId, userName }, meetingId);
    dispatch(actions.setUserName({ name: "" }));
    dispatch(actions.setMeetingId({ meetingId: null }));
    dispatch(actions.setOnlyWithAudio({ connectOnlyWithAudio: false }));
    dispatch(actions.setWebrtcMessages({ messages: [] }));
    dispatch(actions.setSockeIoMessages({ messages: [] }));
    closeMediaDevices();
    navigate("/");
  };

  return (
    <Box
      py={1.5}
      px={2}
      bg="red"
      color="white"
      fontSize="1.1rem"
      fontWeight="bold"
      cursor="pointer"
      display="flex"
      alignItems="center"
      borderRadius="20px"
      onClick={leaveCallHandler}
    >
      <MdCallEnd size={"1.5rem"} style={{ marginRight: "6px" }} />
      Leave
    </Box>
  );
};

export default LeaveCallButton;
