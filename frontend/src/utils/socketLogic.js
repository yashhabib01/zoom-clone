import { io } from "socket.io-client";
import store from "../store/index";
import { actions } from "../store/slice";
import * as webRTC from "./webRTC-Logic";

let socket = null;

export const connectWithSocketIoServer = () => {
  socket = io(process.env.REACT_APP_BACKEND_ENDPOINT, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    // console.log("Connected to socket.io server : ", socket.id);
  });

  socket.on("new-meeting-created", ({ meeting }) => {
    // console.log(meeting);
    store.dispatch(actions.setMeetingId({ meetingId: meeting.id }));
    store.dispatch(
      actions.setMeetingParticipants({ connectedUsers: meeting.connectedUsers })
    );
  });

  socket.on("meeting-joined", ({ meeting }) => {
    // console.log(meeting);
    store.dispatch(actions.setMeetingId({ meetingId: meeting.id }));
    store.dispatch(
      actions.setMeetingParticipants({ connectedUsers: meeting.connectedUsers })
    );
  });

  socket.on("room-update", ({ meeting }) => {
    // console.log(meeting);
    store.dispatch(
      actions.setMeetingParticipants({ connectedUsers: meeting.connectedUsers })
    );
  });

  socket.on("user-disconnected", ({ disconnectedUser }) => {
    // console.log(disconnectedUser);
    webRTC.removePeerConnection(disconnectedUser);
  });

  socket.on("invalid-meeting-id", ({ message }) => {
    console.log(message);
    store.dispatch(actions.setErrorMessage({ message }));
  });

  socket.on("meeting-full", ({ message }) => {
    console.log(message);
    store.dispatch(actions.setErrorMessage({ message }));
  });

  socket.on(
    "prepare-webrtc-conn",
    ({ newUserSocketId, isInitiator, userName }) => {
      webRTC.prepareNewPeerConnection(newUserSocketId, isInitiator, userName);
      // inform the new joined user we have successfully prepared for the webrtc coneection and now we are ready to initialize it
      const localUserName = store.getState().app.userName;
      socket.emit("init-webrtc-connection", {
        connectToUser: newUserSocketId,
        userName: localUserName,
      });
    }
  );

  socket.on("connection-signal", (signalData) => {
    webRTC.handleSignaling(signalData);
  });

  socket.on("init-webrtc-connection", ({ connectToUser, userName }) => {
    webRTC.prepareNewPeerConnection(connectToUser, true, userName);
  });

  socket.on("new-message", ({ messageData }) => {
    appendNewMessage(messageData);
  });
};

export const createNewMeeting = (userId, hostUserName) => {
  socket.emit("create-new-meeting", { userId, userName: hostUserName });
};

export const joinMeeting = (userId, userName, meetingId, onlyAudio) => {
  socket.emit("join-meeting", {
    userInfo: { userId, userName },
    meetingId,
    onlyAudio,
  });
};

export const leaveMeetingHandler = (userInfo, meetingId) => {
  socket.emit("leave-meeting", { userInfo, meetingId });
};

export const signalPeerDataForConnection = (signalData) => {
  socket.emit("connection-signal", signalData);
};

const appendNewMessage = (messageData) => {
  store.dispatch(actions.appendSockeIoMessages({ messageData }));
};

export const sendMessageWithSocketIo = (message) => {
  const { userId, userName, meetingId } = store.getState().app;

  const messageData = {
    userId,
    userName,
    meetingId,
    messageContent: message,
  };

  appendNewMessage(messageData);

  socket.emit("new-message", { messageData });
};
