import React from "react";
import "./Login.scss";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: ""
        }
    }

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    }

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
    }

    handleFormSubmit = () => {
        if(this.state.name === "user1" && this.state.password === "user1") {
            let user = {
                id: 1,
                name: this.state.name,
                online: true
            }
            this.props.setLoggedUser(user);
        } else
        if(this.state.name === "user2" && this.state.password === "user2") {
            let user = {
                id: 2,
                name: this.state.name,
                online: true
            }
            this.props.setLoggedUser(user);
        } else if(this.state.name === "user3" && this.state.password === "user3") {
            let user = {
                id: 3,
                name: this.state.name,
                online: true
            }
            this.props.setLoggedUser(user);
        }
    }

    render() {
        return (
            <div className="login">
                    <form onSubmit={this.handleFormSubmit}>
                        <TextField
                            className="textField"
                            id="name-input"
                            type="text"
                            value={this.state.name}
                            variant="outlined"
                            placeholder="Name"
                            onChange={this.handleNameChange}
                        />
                        <TextField
                            className="textField"
                            id="password-input"
                            type="password"
                            value={this.state.password}
                            variant="outlined"
                            placeholder="Password"
                            onChange={this.handlePasswordChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
            </div>
        );
    }
}

export default Login;
