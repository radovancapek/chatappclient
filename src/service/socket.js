import socketio from "socket.io-client";

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/";

// const URL = "http://localhost:8080/";

export const socket = socketio(URL);
