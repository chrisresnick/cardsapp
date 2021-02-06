import { SimpleGrid, Flex, Input, Text, Button, IconButton, Link, Box} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import {FaLinkedin, FaGithub} from "react-icons/fa"
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
      text: "Make decks and cards."
    },
    {
      img: 'https://cardsappdemo.s3.amazonaws.com/study+deck.gif',
      text: "Study decks. Choose how hard the card was to determine the next time it will show up."
    },
    {
      img: 'https://cardsappdemo.s3.amazonaws.com/classes.gif',
      text: 'Create classes. Share the code to let others join. Join classes.'
    },
    {
      img: 'https://cardsappdemo.s3.amazonaws.com/publish.gif',
      text: "Share decks of cards with students in your classes."
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
  const demo2Login = async e => {
    let res = await fetch("/api/auth/demo2", {
      method: "POST"
    });
    res = await res.json();
    setAuthenticated(true);
    setUser(res);
  }

  return (
    <>
      <Flex 
    bg="blue.50"
    h="7vh"
    borderBottom="1px solid"
    justify="space-between"
    align="center"
  >
    <IconButton
      icon={<FaLinkedin
        size={25}
        />}
      bg="transparent"
      onClick={() => window.location="https://www.linkedin.com/in/chris-resnick/"}
    />
    <Link href="https://chrisresnick.github.io/">
        App By Chris Resnick
    </Link>
    <IconButton
      icon={<FaGithub
        size={25}/>}
      bg="transparent"
      onClick={() => window.location="https://github.com/chrisresnick/cardsapp"}
    />
  </Flex>
    <SimpleGrid
      templateColumns="2fr 1fr"
      bg="blue.50"
      h="93vh"
    >
      <SimpleGrid h="100%" templateColumns='5% 90% 5%'>
        <IconButton
          onClick={() => upDateIndex(-1)}
          my="auto"
          bg="transparent"
          _hover={{bg:"rgba(.5,.5,.5,.1)"}}
          h="25%"
          icon={<ChevronLeftIcon boxSize="10"
          />}/>
          <Flex
            direction="column"
            justify="center"
            align="center"
          >
            <img alt="Demo Gif" src={data[index].img}/>
            <Text
              fontWeight="bold"
            >{data[index].text}</Text>
          </Flex>
        <IconButton
          my="auto"
          onClick={() => upDateIndex(1)}
          bg="transparent"
          _hover={{bg:"rgba(.5,.5,.5,.1)"}}
          h="25%"
          icon={<ChevronRightIcon boxSize="10"
        />}/>

      </SimpleGrid>
      <Flex
        direction="column"
        align="center"
        mt="2vh"
        px="3"
      >
        <Box
          w="100%"
          mx={5}
          p={5}
          my="auto"
          border="2px"
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
          {loginMode ? (
            <Flex
            w="100%"
            flexDir="column"
            >
            {errors.map((error) => (<Text color="red.500">{error}</Text>))}
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
              fontWeight="bold"
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
            <Button
              variant='main'
              onClick={demo2Login}
              my={3}
              w="100%"
            >
              Log In as Demo2
            </Button>
          </Flex>
          ): (
            <SignUpFrom authenticated={authenticated} setAuthenticated={setAuthenticated}/>
          )}
          
          
        </Box>
    </Flex>
  </SimpleGrid>
  </>

  );
};

export default LoginForm;
