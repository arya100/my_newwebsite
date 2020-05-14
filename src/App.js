import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
// import { createBrowserHistory } from 'history';

import {HomePage} from './Pages/HomePage';
import {QuestionPage} from './Pages/QuestionPage';

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './config/firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

// const history = createBrowserHistory({
//     basename: process.env.PUBLIC_URL
// });

function App(props) {

  const dbRef = firebase.firestore().collection('qa');
  const dbAnsRef = firebase.firestore().collection('qanswers');

  return (
    <>
      <Router basename="qa">
        <Switch>
          <Route exact path="/" render={(routeProps) => (<HomePage {...routeProps} {...props} dbRef={dbRef} />)} />
          <Route path={`/question/:id`}  render={(routeProps) => (<QuestionPage {...routeProps} {...props} dbRef={dbRef} dbAnsRef={dbAnsRef} />)}/>
        </Switch>
      </Router>

        
    </>
  );
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);


