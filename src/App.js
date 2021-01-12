import React, {useState} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from "./Home/Home";
import Login from "./Login/Login";

function setLoggedUserSession(user) {
    sessionStorage.setItem('loggedUser', JSON.stringify(user));
}

function getLoggedUser() {
    const userString = sessionStorage.getItem('loggedUser');
    const user = JSON.parse(userString);
    return user;
}

function App() {


    const [loggedUser, setLoggedUser] = useState(getLoggedUser());

    function logOut() {
        setLoggedUser(null);
    }

    if(!loggedUser) {
        return <Login setLoggedUser={setLoggedUserSession} />
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home user={loggedUser} logOut={logOut}/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
