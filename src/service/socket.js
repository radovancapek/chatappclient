import socketio from "socket.io-client";
import BACKEND_URL from "../Const";

export const socket = socketio(BACKEND_URL);
