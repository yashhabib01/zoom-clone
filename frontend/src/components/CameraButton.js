import { useEffect, useState } from "react";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { toggleCamera } from "../utils/webRTC-Logic";

const CameraButton = () => {
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    toggleCamera(cameraEnabled);
  }, [cameraEnabled]);

  return (
    <span onClick={() => setCameraEnabled((prev) => !prev)}>
      {cameraEnabled ? (
        <BsCameraVideo
          size={"1.8rem"}
          color="white"
          style={{ cursor: "pointer" }}
        />
      ) : (
        <BsCameraVideoOff
          size={"1.8rem"}
          color="white"
          style={{ cursor: "pointer" }}
        />
      )}
      {/* <Tooltip
        hasArrow
        placement="top"
        label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
      ></Tooltip> */}
    </span>
  );
};

export default CameraButton;
