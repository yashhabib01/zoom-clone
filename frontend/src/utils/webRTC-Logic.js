import "../setup.ts";
import Peer from "simple-peer";
import store from "../store/index";
import { actions } from "../store/slice";
import * as socket from "./socketLogic";

let localStream = null;

const peers = {},
  dataChannel = "messageChannel";

export const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
};

export const getLocalPreviewAndInitRoomConnection = async (
  userId,
  userName,
  audioOnly,
  isRoomHost,
  meetingId = null
) => {
  await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: audioOnly
        ? false
        : {
            width: 1280,
            height: 720,
            facingMode: "user",
          },
    })
    .then((stream) => {
      localStream = stream;

      isRoomHost
        ? socket.createNewMeeting(userId, userName)
        : socket.joinMeeting(userId, userName, meetingId, audioOnly);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const prepareNewPeerConnection = (
  newUserSocketId,
  isInitiator,
  userName
) => {
  // const configuration = getConfiguration();

  peers[newUserSocketId] = new Peer({
    initiator: isInitiator,
    stream: localStream,
    channelName: dataChannel,
  });

  peers[newUserSocketId].on("signal", (signalData) => {
    /* signal data consists all the information about webRTC connection, ICE candidated info and SDP information, 
    etc and once we receive it, we want to send it to the other user so the webRTC connection could be established */

    socket.signalPeerDataForConnection({
      signal: signalData,
      signalToUser: newUserSocketId,
    });
  });

  peers[newUserSocketId].on("stream", (stream) => {
    // console.log("New stream received from user : ", peers[newUserSocketId]);
    addNewStream(stream, newUserSocketId, userName);
  });

  peers[newUserSocketId].on("data", (messageData) => {
    const newMessage = JSON.parse(messageData);
    // console.log(newMessage);
    appendNewMessage(newMessage);
  });
};

export const handleSignaling = (signalData) => {
  const { signal, signalFromUser } = signalData;

  peers[signalFromUser].signal(signal);
};

export const removePeerConnection = (disconnectedUser) => {
  try {
    const videoContainer = document.getElementById(
      `${disconnectedUser}-video-container`
    );
    const videoElement = document.getElementById(`${disconnectedUser}-video`);

    if (videoContainer && videoElement) {
      videoElement.srcObject.getTracks().forEach((track) => track.stop());

      videoElement.srcObject = null;
      videoContainer.removeChild(videoElement);
      videoContainer.parentNode.removeChild(videoContainer);

      if (peers[disconnectedUser]) {
        peers[disconnectedUser].destroy();
      }
      delete peers[disconnectedUser];
    }
  } catch (error) {
    console.log(error);
  }
};

export const showLocalVideoPreview = () => {
  if (!localStream) {
    console.error("Failed to access camera and mic");
    return;
  }

  const allVideosContainer = document.getElementById("videos_container");
  // console.log(allVideosContainer);

  const container = document.createElement("div");
  container.classList.add("container");

  const videoContainer = document.createElement("div");
  videoContainer.setAttribute("id", "local_preview_container");
  videoContainer.classList.add("video_element_container");

  const userLabel = document.createElement("span");
  userLabel.classList.add("user-label");
  userLabel.innerHTML = "You";

  const videoElement = document.createElement("video");
  videoElement.setAttribute("id", "local_preview_video_element");
  videoElement.classList.add("video_element");
  videoElement.srcObject = localStream;
  videoElement.autoplay = true;
  videoElement.muted = true;

  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  videoContainer.appendChild(userLabel);
  videoContainer.appendChild(videoElement);
  container.appendChild(videoContainer);
  allVideosContainer.appendChild(container);
};

const addNewStream = (stream, streamReceivedFromUser, userName) => {
  const allVideosContainer = document.getElementById("videos_container");

  const container = document.createElement("div");
  container.classList.add("container");

  const videoContainer = document.createElement("div");
  videoContainer.setAttribute(
    "id",
    `${streamReceivedFromUser}-video-container`
  );
  videoContainer.classList.add("video_element_container");

  const userLabel = document.createElement("span");
  userLabel.classList.add("user-label");
  userLabel.innerHTML = userName;

  const videoElement = document.createElement("video");
  videoElement.setAttribute("id", `${streamReceivedFromUser}-video`);
  videoElement.classList.add("video_element");
  videoElement.srcObject = stream;
  videoElement.autoplay = true;

  videoContainer.addEventListener("click", () => {
    videoContainer.classList.toggle("full_screen");
  });

  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  videoContainer.appendChild(userLabel);
  videoContainer.appendChild(videoElement);
  container.appendChild(videoContainer);
  allVideosContainer.appendChild(container);
};

export const closeMediaDevices = () => {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
};

export const toggleMic = (isMuted) => {
  localStream.getAudioTracks()[0].enabled = isMuted ? true : false;
};

export const toggleCamera = (isDisabled) => {
  localStream.getVideoTracks()[0].enabled = isDisabled ? true : false;
};

export const toggleScreenShare = (
  isScreenSharingActive,
  screenSharingStream = null
) => {
  if (isScreenSharingActive) {
    switchVideoTracks(screenSharingStream);
    changeLocalPreview(screenSharingStream);
  } else {
    switchVideoTracks(localStream);
    changeLocalPreview(localStream);
  }
};

const changeLocalPreview = (stream) => {
  const localPreviewElement = document.getElementById(
    "local_preview_video_element"
  );
  localPreviewElement.srcObject = stream;
  localPreviewElement.autoplay = true;
  localPreviewElement.muted = true;

  localPreviewElement.onloadedmetadata = () => localPreviewElement.play();
};

const switchVideoTracks = (stream) => {
  for (let socket_id in peers) {
    for (let index in peers[socket_id].streams[0].getTracks()) {
      for (let index2 in stream.getTracks()) {
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          );
          break;
        }
      }
    }
  }
};

const appendNewMessage = (messageData) => {
  store.dispatch(actions.appendWebrtcMessages({ messageData }));
};

export const sendMessageWithWebRTC = (message) => {
  const userId = store.getState().app.userId;
  const userName = store.getState().app.userName;

  const messageData = {
    userId,
    userName,
    messageContent: message,
  };

  appendNewMessage(messageData);

  const stringifiedMessageData = JSON.stringify(messageData);
  for (let peer in peers) {
    peers[peer].send(stringifiedMessageData);
  }
};
