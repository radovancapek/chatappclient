import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from "./Home/Home";
import Login from "./Login/Login";

function setLoggedUser(user) {
    sessionStorage.setItem('loggedUser', JSON.stringify(user));
}

function getLoggedUser() {
    const userString = sessionStorage.getItem('loggedUser');
    const user = JSON.parse(userString);
    return user;
}

function App() {

    const loggedUser = getLoggedUser();

    if(!loggedUser) {
        return <Login setLoggedUser={setLoggedUser} />
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home user={loggedUser}/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
