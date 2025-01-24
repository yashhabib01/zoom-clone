import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = {
  userId: uuid(),
  userName: "",
  meetingId: null,
  isRoomHost: false,
  errorMessage: "",
  meetingParticipants: [],
  connectOnlyWithAudio: false,
  screenShareActive: false,
  webrtcMessages: [],
  socketIoMessages: [],
};

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload.name;
      // console.log(action.payload.name);
    },
    setMeetingId(state, action) {
      state.meetingId = action.payload.meetingId;
      // console.log(action.payload.meetingId);
    },
    setIsRoomHost(state, action) {
      state.isRoomHost = action.payload.isRoomHost;
      // console.log(action.payload.isRoomHost);
    },
    setOnlyWithAudio(state, action) {
      state.connectOnlyWithAudio = action.payload.connectOnlyWithAudio;
      // console.log(action.payload.connectOnlyWithAudio);
    },
    setScreenShareActive(state, action) {
      state.screenShareActive = action.payload.screenShareActive;
      // console.log(action.payload.screenShareActive);
    },
    setMeetingParticipants(state, action) {
      state.meetingParticipants = action.payload.connectedUsers;
      // console.log(action.payload.connectedUsers);
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload.message;
      // console.log(action.payload.message);
    },
    setWebrtcMessages(state, action) {
      state.webrtcMessages = action.payload.messages;
      // console.log(action.payload.messages);
    },
    setSockeIoMessages(state, action) {
      state.socketIoMessages = action.payload.messages;
      // console.log(action.payload.messages);
    },
    appendWebrtcMessages(state, action) {
      state.webrtcMessages.push(action.payload.messageData);
      // console.log(action.payload.messageData);
    },
    appendSockeIoMessages(state, action) {
      state.socketIoMessages.push(action.payload.messageData);
      // console.log(action.payload.messageData);
    },
  },
});

export const actions = slice.actions;
export default slice;
