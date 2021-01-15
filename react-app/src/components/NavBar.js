import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import {Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {useContext, useState} from "react";
import {UserContext} from "./context";
import Note from "./note";

const NavBar = ({setAuthenticated, setNavBar}) => {

  const {user} = useContext(UserContext);
  const [toStudy, setToStudy] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const bar = useRef(null);
  setNavBar(bar);
  const updateBar = async () => {
    let res = await fetch(`/api/users/${user.id}/navnums`);
    res = await res.json();
    setToStudy(res.numCardsToStudy);
    setNotifications(res.notes);
  }

  useEffect(() => {
    if(!user.id){
      setToStudy(0);
      setNotifications([])
    }
    let interval = user.id && setInterval(updateBar, 1000);
    return interval && (() => clearInterval(interval));
  }, [user.id])

  return (
      <Flex
        ref={bar}
        paddingY='2'
        px={2}
        bg="teal.100"
        flexDir="row"
        width="100%"
        justify="space-between"
        align="center"
        outline="1px solid black">
          <Flex w="33%" justify="space-around" align="center">
            <NavLink to="/" exact={true} activeClassName="active">
              Home
            </NavLink>
            {!user.id ?
              (
                <>
                  <NavLink to="/login" exact={true} activeClassName="active">
                    Login
                  </NavLink>
                  <NavLink to="/sign-up" exact={true} activeClassName="active">
                    Sign Up
                  </NavLink>
                </>
              ) : (
                null
              )
            }
            <NavLink to="/classes" exact={true} activeClassName="active">
              Classes
            </NavLink>
            <LogoutButton setAuthenticated={setAuthenticated}/>
          </Flex>
          <Menu>
                <MenuButton
                  as={Button}
                  bg="transparent"
                  _hover={{bg:"teal.200"}}
                  _expanded={{bg:"teal.200"}}
                  rightIcon={<ChevronDownIcon
                />}>
                  {`${notifications.length} notifications`}
                </MenuButton>
                <MenuList>
                  {notifications.length ? notifications.map(note => (
                    <MenuItem>
                      <Note note={note} />
                    </MenuItem>
                  )) : <Text w="100%" textAlign="center">No Notifications</Text>}
                </MenuList>
            </Menu>
          {toStudy ? (
            <>
              <NavLink to="/study" exact={true} activeClassName="active">
                {`Study ${toStudy}${toStudy ===1?' card':" cards"}`}
              </NavLink>
            </>
          ): <Text>No cards due.</Text>}

      </Flex>
  );
}

export default NavBar;
