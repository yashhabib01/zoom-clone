import express from "express";
import { Server } from "socket.io";
import { config } from "dotenv";
import { v4 as uuid } from "uuid";
import cors from "cors";
import path from "path";

import HttpError from "./models/HttpError.js";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares.js";

let allRooms = [];

config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/room/:roomId", (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = allRooms.find((r) => r?.id === roomId);

    if (!room) {
      return next(new HttpError("Invalid room id, room does not exist.", 400));
    }

    if (room?.users.length > 3) {
      res.status(200).json({ roomExists: true, roomIsFull: true });
    } else {
      res.status(200).json({ roomExists: true, roomIsFull: false });
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong.", 500));
  }
});

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res, next) => {
    res.send("API is running.");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(PORT || 8080, () => {
  console.log(`Server is running on port : ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 120000,
  cors: true,
});

io.on("connection", (socket) => {
  console.log("New user joined : ", socket.id);

  socket.on("create-new-meeting", ({ userId, userName }) => {
    // console.log(userId, userName);
    const meetingId = uuid();
    const newRoom = {
      id: meetingId,
      connectedUsers: [
        {
          userId,
          userName,
          socketId: socket.id,
        },
      ],
    };
    allRooms.push(newRoom);

    socket.join(meetingId);

    socket.emit("new-meeting-created", { meeting: newRoom });
  });

  socket.on("join-meeting", ({ userInfo, meetingId, onlyAudio }) => {
    // console.log(userInfo, meetingId, onlyAudio);
    let meeting = allRooms.find((room) => room.id === meetingId);

    if (!meeting) {
      socket.emit("invalid-meeting-id", {
        message: "Invalid meeting id. Unable to join meeting.",
      });
      return;
    }

    if (meeting.connectedUsers.length >= 4) {
      socket.emit("meeting-full", {
        message: "The meeting is full. Please try after some time.",
      });
      return;
    }

    meeting.connectedUsers = [
      ...meeting.connectedUsers,
      {
        userId: userInfo.userId,
        userName: userInfo.userName,
        socketId: socket.id,
      },
    ];
    socket.in(meeting.id).emit("prepare-webrtc-conn", {
      newUserSocketId: socket.id,
      isInitiator: false,
      userName: userInfo.userName,
    });
    socket.join(meeting.id);
    socket.emit("meeting-joined", { meeting });
    socket.in(meeting.id).emit("room-update", { meeting });
  });

  socket.on("leave-meeting", ({ userInfo, meetingId }) => {
    // console.log(userInfo, meetingId);
    leaveMeetingHandler(socket);
  });

  socket.on("connection-signal", (signalData) => {
    const { signal, signalToUser } = signalData;
    socket
      .to(signalToUser)
      .emit("connection-signal", { signal, signalFromUser: socket.id });
  });

  socket.on("init-webrtc-connection", ({ connectToUser, userName }) => {
    // console.log(connectToUser);
    socket
      .to(connectToUser)
      .emit("init-webrtc-connection", { connectToUser: socket.id, userName });
  });

  socket.on("new-message", ({ messageData }) => {
    socket.in(messageData.meetingId).emit("new-message", { messageData });
  });

  socket.on("disconnect", () => {
    leaveMeetingHandler(socket);
  });
});

function leaveMeetingHandler(socket) {
  const meeting = allRooms.find((room) => {
    const user = room.connectedUsers.find(
      (user) => user.socketId === socket.id
    );
    return user ? true : false;
  });

  if (meeting) {
    socket.leave(meeting.id);
    meeting.connectedUsers = meeting.connectedUsers.filter(
      (user) => user.socketId !== socket.id
    );
    if (meeting.connectedUsers.length === 0) {
      allRooms = allRooms.filter((room) => room.id !== meeting.id);
      return;
    } else if (meeting.connectedUsers.length > 0) {
      socket.in(meeting.id).emit("room-update", { meeting });
      socket
        .in(meeting.id)
        .emit("user-disconnected", { disconnectedUser: socket.id });
    }
    console.log(`User ${socket.id} left the meeting : ${meeting.id}`);
  }
}

//delete room routes and controllers as well as this comment
