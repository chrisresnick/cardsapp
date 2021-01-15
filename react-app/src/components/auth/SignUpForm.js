import React, { useState, useContext } from "react";
import {Input, Button} from "@chakra-ui/react"
import { Redirect } from 'react-router-dom';
import { signUp } from '../../services/auth';
import {UserContext} from "../context";

const SignUpForm = ({authenticated, setAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const {setUser} = useContext(UserContext);

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const user = await signUp(username, email, password);
      if (!user.errors) {
        setAuthenticated(true);
        setUser(user);
      }
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (authenticated) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={onSignUp}>
        <Input
          type="text"
          name="username"
          placeholder="username"
          onChange={updateUsername}
          value={username}
          my={3}
        ></Input>
        <Input
          type="text"
          name="email"
          placeholder="email"
          my={3}
          onChange={updateEmail}
          value={email}
        ></Input>
        <Input
          type="password"
          name="password"
          placeholder="password"
          my={3}
          onChange={updatePassword}
          value={password}
        ></Input>
        <Input
          type="password"
          name="repeat_password"
          placeholder="confirm password"
          my={3}
          onChange={updateRepeatPassword}
          value={repeatPassword}
          required={true}
        ></Input>
      <Button variant="main" my={3} w="100%"type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpForm;
