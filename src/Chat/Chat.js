import React from "react";
import TextField from '@material-ui/core/TextField';
import "./Chat.scss"
import {socket} from "../service/socket"
import Button from "@material-ui/core/Button";
import Moment from "react-moment";

class Chat extends React.Component {
    divRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            friend: props.friend,
            messages: [],
            name: props.name,
            newMessage: ""
        }
    }

    componentDidMount() {
        socket.on("get_messages", this.getMessages);
        socket.on("new_message", this.newMessage);
        socket.on("seen", this.fetchMessages);
        socket.emit("set_seen", {to: this.props.loggedUser.id, from: this.props.friend});
        this.fetchMessages();
    }

    getMessages = (messages) => {
        this.setState({messages: messages});
    }

    fetchMessages = () => {
        socket.emit("get_messages", {from: this.props.loggedUser.id, to: this.props.friend});
    }

    newMessage = (message) => {
        if(message.from === this.props.friend || message.from === this.props.loggedUser.id) {
            socket.emit("set_seen", {to: this.props.loggedUser.id, from: this.props.friend});
            this.setState(prevState => ({
                messages: [...prevState.messages, message]
            }))
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.name !== this.state.name) {
            this.setState({name: this.props.name})
            this.setState({messages: []});
            socket.emit("get_messages", {from: this.props.loggedUser.id, to: this.props.friend});
            socket.emit("set_seen", {to: this.props.loggedUser.id, from: this.props.friend});
        }
        if (this.props.friend !== this.state.friend) {

        }
    }

    componentWillUnmount() {
        socket.off("get_messages");
        socket.off("fetch_messages");
    }

    handleSendClick = () => {
        this.sendMessage()
    }

    handleNewMessageChange = (e) => {
        this.setState({newMessage: e.target.value});
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    sendMessage() {
        if (this.state.newMessage.length > 0) {
            socket.emit("new_message", {
                text: this.state.newMessage,
                from: this.props.loggedUser.id,
                to: this.props.friend,
                seen: false
            });
            this.setState({newMessage: ""});
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.sendMessage()
        }
    }

    render() {
        return (
            <div className="chat">
                <div className="name">
                    <h2>{this.state.name}</h2>
                </div>
                <div className="messages" ref={this.divRef}>
                    {this.state.messages.reverse().map(message => {
                        const {id, text, from, seen, updatedAt} = message;
                        let seenAt = null;
                        let messageCN = '';
                        if (from === this.props.loggedUser.id) {
                            messageCN = "right";
                        } else {
                            messageCN = "left";
                        }
                        if(seen) {
                            seenAt = (
                                <div className="seenAt">Seen at <Moment className="messageTime" format="HH:mm D.MM.YYYY">{updatedAt}</Moment></div>
                            )
                        }
                        return (

                            <div className={"messageWrapper " + messageCN} key={id}>
                                <Moment className="messageTime" format="HH:mm D.MM.YYYY">{message.createdAt}</Moment>
                                <div className="messageText">{text}</div>
                                {seenAt}
                            </div>
                        );
                    })}
                </div>
                <div className="newMessageWrap">
                    <TextField
                        className="newMessage"
                        id="standard-multiline-static"
                        multiline
                        rowsMax={4}
                        variant="outlined"
                        value={this.state.newMessage}
                        placeholder="New message"
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleNewMessageChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.handleSendClick}
                    >
                        Send
                    </Button>
                </div>
            </div>
        );
    }
}

export default Chat;
