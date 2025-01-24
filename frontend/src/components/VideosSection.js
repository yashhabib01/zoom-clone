import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { showLocalVideoPreview } from "../utils/webRTC-Logic";

const VideosSection = () => {
  useEffect(() => {
    showLocalVideoPreview();

    return () => {
      const localPreview = document.getElementById("local_preview");
      if (localPreview) {
        localPreview.remove();
      }
    };
  }, []);

  return (
    <Box
      id="videos_container"
      w={"100%"}
      position="relative"
      display={"grid"}
      gridTemplateColumns="1fr 1fr"
      gap={1}
    ></Box>
  );
};

export default VideosSection;
