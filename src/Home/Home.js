import React from "react";
import Chat from "../Chat/Chat";
import {socket} from "../service/socket";
import "./Home.scss";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { API_URL } from "../Const";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newMessages: [],
            loggedUser: props.user,
            timestamp: null,
            loadingFriends: true,
            error: null,
            selectedMessages: [],
            friends: [],
            showChat: false,
            chatName: "",
            chatId: null,
            selected: 0,
        }
    }

    componentDidMount() {
        socket.on("connect", () => {
            socket.emit("new_user", { userId: this.props.user.id });
            socket.on("get_unread", this.getUnread);
            socket.on("set_seen", () => {socket.emit("get_unread", {to: this.props.user.id})});
            socket.on("new_message", this.newMessage);
            socket.emit("get_unread", {to: this.props.user.id});
        })
        this.fetchFriends();
    }

    newMessage = (message) => {
        socket.emit("get_unread", {to: this.props.user.id});
    }

    getUnread = (messages) => {
        this.setState({newMessages: messages});
    }

    fetchFriends() {
        fetch(API_URL + "/users")
            .then(response => response.json())
            .then(data =>
                this.setState({
                    friends: data,
                    loadingFriends: false
                })
            )
            .catch(error => this.setState({error, loadingFriends: false}));
    }

    handleFriendClick = (id, name) => {
        this.setState({showChat: true, chatName: name, selected: id});
    }

    logOut = () => {
        sessionStorage.removeItem('loggedUser');
        this.props.logOut();
    }

    render() {
        const {loadingMessages, loadingFriends, messages, friends, error, showChat} = this.state;
        return (
            <div className="home">
                <div className="windows">
                    <div className="friends">
                        <h1>Friends</h1>
                        <List className="friendsList">
                            {(!loadingFriends && friends.length > 0) ? (
                                friends.map((friend, i) => {
                                    const {id, name} = friend;
                                    if (id !== this.props.user.id) {
                                        return (
                                            <div className={i === 1 ? 'friendWrapper first-child' : 'friendWrapper'}
                                                 key={id}>
                                                <ListItem
                                                    className={id === this.state.selected ? 'friend selected' : 'friend'}
                                                    onClick={() => this.handleFriendClick(id, name)}>
                                                    <ListItemText
                                                        primary={name}
                                                    />
                                                    {this.state.newMessages[id] ?
                                                        (<div className="notification">{this.state.newMessages[id]}</div>) :
                                                        null
                                                    }
                                                </ListItem>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })
                                // If there is a delay in data, let's let the user know it's loading
                            ) : (
                                <h3>Loading friends...</h3>
                            )}
                        </List>


                        {error ? <p>{error.message}</p> : null}

                    </div>
                    <div className="chatContainer">
                        {showChat ? <Chat
                            name={this.state.chatName}
                            friend={this.state.selected}
                            loggedUser={this.props.user}
                        /> : null}
                        {error ? <p>{error.message}</p> : null}
                    </div>
                    <div className="buttons">
                        <TextField id="outlined-basic" size="small" label={"Logged user: " + this.props.user.name} variant="outlined" />
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={this.logOut}
                        >
                            LogOut
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
