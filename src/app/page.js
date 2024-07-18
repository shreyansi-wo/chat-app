"use client";
import styles from "./page.module.css";
import { io } from "socket.io-client";
import { useState } from "react";
import ChatPage from "@/components/page";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");

  var socket;
  socket = io("http://localhost:3001");

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      socket.emit("join_room", roomId);
      setShowSpinner(true);
      // You can remove this setTimeout and add your own logic
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };
  return (
    <Box
      sx={{
        background:
          "linear-gradient(to right, rgba(255,0,0,0), rgb(95,158,160))",
      }}
    >
      <Box
        className={styles.main_div}
        style={{ display: showChat ? "none" : "" }}
      >
        <Typography variant="h3" mb={3}>
          Welcome to Chat App
        </Typography>
        <TextField
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
          disabled={showSpinner}
        />
        <TextField
          type="text"
          placeholder="room id"
          onChange={(e) => setroomId(e.target.value)}
          disabled={showSpinner}
          sx={{ marginTop: "20px" }}
        />
        <Button mt={2} variant="outlined" onClick={() => handleJoin()}>
          {!showSpinner ? (
            "Join"
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </Button>
      </Box>
      <Box style={{ display: !showChat ? "none" : "" }}>
        <ChatPage socket={socket} roomId={roomId} username={userName} />
      </Box>
    </Box>
  );
}
