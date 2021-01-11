import React from "react";
import Chat from "../Chat/Chat";
import {socket} from "../service/socket";
import "./Home.scss";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";


const API_URL = 'https://chat-app-capek.herokuapp.com/api';
//const API_URL = 'http://localhost:8080/api';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newMessages: [],
            loggedUser: props.user,
            timestamp: null,
            loadingMessages: true,
            loadingFriends: true,
            error: null,
            messages: [],
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
            console.log("home socket " + socket.id);
            socket.on("get_messages", this.getMessages);
            socket.on("get_unread", this.getUnread);
            socket.on("set_seen", () => {socket.emit("get_unread", {to: this.props.user.id})});
            socket.on("new_message", this.newMessage);
            socket.emit("get_unread", {to: this.props.user.id});
        })
        this.fetchFriends();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("home componentDidUpdate");
    }

    newMessage = (message) => {
        socket.emit("get_unread", {to: this.props.user.id});
        this.setState(prevState => ({
            messages: [...prevState.messages, message]
        }))
    }

    getUnread = (messages) => {
        console.log("home getUnread " + messages[3]);
        this.setState({newMessages: messages});
    }

    getMessages = (messages) => {
        this.setState({messages: messages});
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
            // Catch any errors we hit and update the app
            .catch(error => this.setState({error, loadingFriends: false}));
    }

    handleFriendClick = (id, name) => {
        this.setState({showChat: true, chatName: name, selected: id});
    }

    logOut = () => {
        sessionStorage.removeItem('loggedUser');
        this.forceUpdate();
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
                                    console.log("id " + id + " " + name + " " + this.props.user.id + " " + this.state.newMessages[id]);
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
                        <p>{this.props.user.name}</p>
                        <button onClick={this.logOut}>LogOut</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
