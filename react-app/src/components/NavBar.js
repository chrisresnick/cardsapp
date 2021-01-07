import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import {Flex} from "@chakra-ui/react"
import {useContext, useState} from "react";
import {UserContext} from "./context";

const NavBar = ({setAuthenticated}) => {

  const {user, setUser} = useContext(UserContext);
  const [toStudy, setToStudy] = useState([]);
  const [notifications, setNotifications] = useState([]);

  return (
      <Flex
        paddingY='2'
        bg="blue.50"
        flexDir="row"
        width="100%"
        justify="space-around"
        outline="1px solid black">
          <NavLink to="/" exact={true} activeClassName="active">
            Home
          </NavLink>
          <NavLink to="/login" exact={true} activeClassName="active">
            Login
          </NavLink>
          <NavLink to="/sign-up" exact={true} activeClassName="active">
            Sign Up
          </NavLink>
          <NavLink to="/users" exact={true} activeClassName="active">
            Users
          </NavLink>
          <LogoutButton setAuthenticated={setAuthenticated} setUser={setUser} />
      </Flex>
  );
}

export default NavBar;
