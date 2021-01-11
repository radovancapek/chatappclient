import socketio from "socket.io-client";

const URL = "https://chat-app-capek.herokuapp.com";

// const URL = "http://localhost:8080/";

export const socket = socketio(URL);
