import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import Decks from "./components/decks";
import Cards from "./components/cards";
import Study from "./components/study";
import Class from "./components/class";
import { UserContext, EnrolledClassesContext } from "./components/context";
import { authenticate } from "./services/auth";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser]=useState({});
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async() => {
      const user = await authenticate();
      if (!user.errors) {
        setAuthenticated(true);
        setUser(user);
      }
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <UserContext.Provider value={{user, setUser}}>
      <EnrolledClassesContext.Provider value={{enrolledClasses, setEnrolledClasses}}>
        <BrowserRouter>
          <NavBar setAuthenticated={setAuthenticated}/>
          <Switch>
            <Route path="/login" exact={true}>
              <LoginForm
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
              />
            </Route>
            <Route path="/sign-up" exact={true}>
              <SignUpForm authenticated={authenticated} setAuthenticated={setAuthenticated}/>
            </Route>
            <ProtectedRoute path="/users" exact={true} authenticated={authenticated}>
              <UsersList/>
            </ProtectedRoute>
            <ProtectedRoute path="/users/:userId" exact={true} authenticated={authenticated}>
              <User />
            </ProtectedRoute>
            <ProtectedRoute path="/" exact={true} authenticated={authenticated}>
              <Decks/>
            </ProtectedRoute>
            <ProtectedRoute path="/editDeck/:id" exact={true} authenticated={authenticated}>
              <Cards/>
            </ProtectedRoute>
            <ProtectedRoute path="/study" exact={true} authenticated={authenticated}>
              <Study/>
            </ProtectedRoute>
            <ProtectedRoute path="/study/:deckId" exact={true} authenticated={authenticated}>
              <Study/>
            </ProtectedRoute>
            <ProtectedRoute path="/classes/" exact={true} authenticated={authenticated}>
              <Class/>
            </ProtectedRoute>
          </Switch>
        </BrowserRouter>
      </EnrolledClassesContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
