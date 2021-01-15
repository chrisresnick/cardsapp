import { SimpleGrid, Flex, Input, Text, Button } from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { login } from "../../services/auth";
import {UserContext} from "../context";
import SignUpFrom from "./SignUpForm";


const LoginForm = ({ authenticated, setAuthenticated}) => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [loginMode, setLoginMode] = useState(true);
  const [password, setPassword] = useState("");
  const {setUser} = useContext(UserContext);

  const onLogin = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    if (!user.errors) {
      setAuthenticated(true);
      setUser(user);
    } else {
      setErrors(user.errors);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (authenticated) {
    return <Redirect to="/" />;
  }

  return (
    <SimpleGrid templateColumns="2fr 1fr">
      <Flex>
      </Flex>
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="90vh"
      >
        <Flex w="100%">
          <Button
            w="50%"
            bg={loginMode ? "blue.600" : "blue.900"}
            color="white"
            _hover="none"
            borderRightRadius="none"
            onClick={()=>setLoginMode(true)}
          >
            Log In
          </Button>
          <Button
            w="50%"
            bg={loginMode ? "blue.900" : "blue.600"}
            color="white"
            _hover="none"
            borderLeftRadius="none"
            onClick={()=>setLoginMode(false)}
          >
            Sign Up
          </Button>
        </Flex>
          {!loginMode ? <SignUpFrom/> : (
            <>
            {errors.map((error) => (
              <Text color="red.500">{error}</Text>
            ))}
          <form onSubmit={onLogin}>
            {/* <Flex direction="column" justify="center" align="center"> */}
                <Input
                  name="email"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={updateEmail}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={updatePassword}
                />
                <Input
                  bg="black"
                  color="white"
                  _hover={{bg:"gray.800"}}
                  type="submit"
                  value="Login"
                />

          {/* </Flex> */}
        </form>
        </>
          )}

    </Flex>
  </SimpleGrid>

  );
};

export default LoginForm;
