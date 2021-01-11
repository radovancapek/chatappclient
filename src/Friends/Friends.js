import React from "react";
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import "./Friends.css";

const API = process.env.API_URL || 'http://localhost:8080/api';

const Friends = () => {

        return (
            <div className="home">
            </div>
        );
}

export default Friends;
