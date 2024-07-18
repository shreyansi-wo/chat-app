"use client";
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatPage = ({ socket, username, roomId }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState([]);

  const sendData = async (e) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData = {
        roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("receive_msg", (data) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);

  return (
    <Box className={style.chat_div}>
      <Box className={style.chat_border}>
        <Typography align="center" variant="h6" mb={2}>
          Chat App
        </Typography>
        <Typography
          align="center"
          variant="h5"
          mb={2}
        >{`Welcome , ${username}`}</Typography>
        <Box
          sx={{
            border: "1px solid lightgray",
            height: "36vh",
            overflowY: "auto",
            scrollbarWidth: "2px",
            padding: "5px",
          }}
        >
          {chat.map(({ roomId, user, msg, time }, key) => (
            <Box
              key={key}
              className={
                user == username
                  ? style.chatProfileRight
                  : style.chatProfileLeft
              }
            >
              <Typography
                className={style.chatProfileSpan}
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {user.charAt(0)}
              </Typography>
              <Typography
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {msg}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            width: "95%",
            position: "absolute",
            bottom: "10px",
          }}
          component="form"
          onSubmit={(e) => sendData(e)}
        >
          <TextField
            type="text"
            value={currentMsg}
            placeholder="Type your message.."
            onChange={(e) => setCurrentMsg(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SendIcon
                    sx={{ cursor: "pointer" }}
                    type="submit"
                    onClick={(e) => sendData(e)}
                  />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
