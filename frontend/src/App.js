import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MeetingPage from "./pages/MeetingPage";
import { connectWithSocketIoServer } from "./utils/socketLogic";
import "./App.css";

function App() {
  useEffect(() => {
    connectWithSocketIoServer();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meeting/:meetingId" element={<MeetingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
