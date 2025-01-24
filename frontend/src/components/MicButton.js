import { useEffect, useState } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { toggleMic } from "../utils/webRTC-Logic";

const MicButton = () => {
  const [micEnabled, setMicEnabled] = useState(true);

  useEffect(() => {
    toggleMic(micEnabled);
  }, [micEnabled]);

  return (
    <span onClick={() => setMicEnabled((prev) => !prev)}>
      {micEnabled ? (
        <AiOutlineAudio
          size={"1.5rem"}
          color="white"
          style={{ cursor: "pointer" }}
        />
      ) : (
        <AiOutlineAudioMuted
          size={"1.5rem"}
          color="white"
          style={{ cursor: "pointer" }}
        />
      )}
      {/* <Tooltip
        hasArrow
        placement="top"
        label={micEnabled ? "Turn off mic" : "Turn on mic"}
      ></Tooltip> */}
    </span>
  );
};

export default MicButton;
