import { SimpleGrid, Flex, Input, Text, Button, IconButton,} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
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
  const [index, setIndex] = useState(0);
  const data = [
    {
      img: 'https://cardsappdemo.s3.amazonaws.com/create+decks.gif',
      text: "Test Test"
    },
    {
      img: 'https://cardsappdemo.s3.amazonaws.com/study+deck.gif',
      text: "Study Text"
    },
    {
      img: 'https://cardsappdemo.s3.amazonaws.com/classes.gif',
      text: 'Text Classes'
    },
    {
      img: 'https://cardsappdemo.s3.amazonaws.com/publish.gif',
      text: "Publish Text"
    }
  ]

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

  const upDateIndex = (num) => {
    let newIndex = index+num;
    if(newIndex < 0) newIndex = data.length-1;
    if(newIndex >= data.length) newIndex = 0;
    setIndex(newIndex);
  }

  const demoLogin = async e => {
    let res = await fetch("/api/auth/demo", {
      method: "POST"
    });
    res = await res.json();
    setAuthenticated(true);
    setUser(res);
  }

  return (
    <SimpleGrid
      templateColumns="2fr 1fr"
      bg="blue.50"
      h="100vh"
    >
      <SimpleGrid h="100%" templateColumns='5% 90% 5%'>
        <IconButton
          my="auto"
          icon={<ChevronLeftIcon boxSize="10"
          onClick={() => upDateIndex(-1)}
          />}/>
          <Flex
            direction="column"
            justify="center"
            align="center"
          >
            <img alt="Demo Gif" src={data[index].img}/>
            <Text>{data[index].text}</Text>
          </Flex>
        <IconButton
          my="auto"
          icon={<ChevronRightIcon boxSize="10"
          onClick={() => upDateIndex(1)}
        />}/>

      </SimpleGrid>
      <Flex
        direction="column"
        align="center"
        mt="2vh"
        px="3"
      >
        <Flex w="100%">
          <Button
            w="50%"
            bg={loginMode ? "blue.50" : "black"}
            color={loginMode? "black" : "white"}
            cursor={loginMode? "default": "pointer"}
            _hover="none"
            _focus="none"
            borderRightRadius="none"
            onClick={()=>setLoginMode(true)}
          >
            Log In
          </Button>
          <Button
            w="50%"
            bg={loginMode ? "black" : "blue.50"}
            color={!loginMode? "black" : "white"}
            cursor={!loginMode? "default": "pointer"}
            _hover="none"
            _focus="none"
            borderLeftRadius="none"
            onClick={()=>setLoginMode(false)}
          >
            Sign Up
          </Button>
        </Flex>
          {!loginMode ? <SignUpFrom authenticated={authenticated} setAuthenticated={setAuthenticated}/> : (
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
                  bg="white"
                  my={3}
                  value={email}
                  onChange={updateEmail}
                />
                <Input
                  name="password"
                  type="password"
                  bg="white"
                  my={3}
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
                  my={3}
                />
                <Button
                  variant='main'
                  onClick={demoLogin}
                  my={3}
                  w="100%"
                >
                  Log In as Demo
                </Button>


          {/* </Flex> */}
        </form>
        </>
          )}
    </Flex>
  </SimpleGrid>

  );
};

export default LoginForm;
