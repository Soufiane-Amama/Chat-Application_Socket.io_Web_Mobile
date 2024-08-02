import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import AppRoute from './AppRoute';
import { Chat, NotFound, Register, Login, Password } from './views';
import Auth from './Auth';


const App = () => {
    useEffect(() => {
        Auth.init();
    }, []);

    return (
        <div id="main-container" className="container-fluid">
            <Router>
                <Switch>
                    <AppRoute path='/' exact component={Chat} can={Auth.auth} redirect='/login' />
                    <AppRoute path='/password' exact component={Password} can={Auth.auth} redirect='/login' />
                    <AppRoute path='/register' component={Register} can={Auth.guest} redirect='/' />
                    <AppRoute path='/login' component={Login} can={Auth.guest} redirect='/' />
                    <AppRoute component={NotFound} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;


