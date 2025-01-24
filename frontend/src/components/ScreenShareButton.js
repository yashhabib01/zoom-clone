import { useState } from "react";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { toggleScreenShare } from "../utils/webRTC-Logic";

const ScreenShareButton = () => {
  const [screenshareEnabled, setScreenshareEnabled] = useState(false);
  const [screenSharingStream, setScreenSharingStream] = useState(null);

  const handleScreenShare = async () => {
    if (!screenshareEnabled) {
      await navigator.mediaDevices
        .getDisplayMedia({
          audio: false,
          video: true,
        })
        .then((stream) => {
          setScreenshareEnabled(true);
          setScreenSharingStream(stream);
          toggleScreenShare(true, stream);
        })
        .catch((err) => console.log(err));
    } else {
      screenSharingStream?.getTracks().forEach((t) => t.stop());
      setScreenshareEnabled(false);
      setScreenSharingStream(null);
      toggleScreenShare(false);
    }
  };

  return (
    <span onClick={handleScreenShare}>
      {screenshareEnabled ? (
        <LuScreenShareOff
          size={"1.5rem"}
          color="white"
          style={{ cursor: "pointer" }}
        />
      ) : (
        <LuScreenShare
          size={"1.5rem"}
          color="white"
          style={{ cursor: "pointer" }}
        />
      )}
    </span>
  );
};

export default ScreenShareButton;
