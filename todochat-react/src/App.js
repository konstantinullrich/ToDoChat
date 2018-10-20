import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { KonstiFirebase, firebaseAuth } from './Firebase';

import Nav from './layouts/Nav.jsx'
import Todoie from './todoie/Todoie.jsx'
import Todos from './todo/Todos.jsx'

import Button from '@material-ui/core/Button';

class App extends Component {
  constructor() {
    super();
    this.kb = new KonstiFirebase();
  }

  render() {
    const that = this;
    const SPLASHSCREEN = () => {
      return firebaseAuth().currentUser === null ? (
        <React.Fragment>
          <Nav user={false}/>
          <Button variant="outlined" color="primary" style={{marginTop: "5vh"}}
            onClick={ () => this.kb.authenticateWithFacebook().then(() => that.setState({authed: true})) }
          >
            Login with Facebook
          </Button>
        </React.Fragment>
      ) : <Redirect to="/home" push />
    };
    const HOME = () => {
      return firebaseAuth().currentUser !== null ? (

        <React.Fragment>
          <Nav user={firebaseAuth().currentUser}/>
          <Todoie KonstiFirebase={this.kb} />
          <Todos KonstiFirebase={this.kb} />
        </React.Fragment>
      ) : <Redirect to="/" push />
    };
    return (
      <Switch>
        <Route exact path="/" component={SPLASHSCREEN} />
        <Route path="/home" component={HOME} />
      </Switch>
    );
  }
}

export default App;
