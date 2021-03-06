import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import {Button, Flex, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {FaLinkedin, FaGithub} from "react-icons/fa"
import {useContext, useState} from "react";
import {UserContext} from "./context";
import Note from "./note";

const NavBar = ({setAuthenticated, setNavBar}) => {

  const {user} = useContext(UserContext);
  const [toStudy, setToStudy] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const bar = useRef(null);

  setNavBar(bar);



  useEffect(() => {
    if(!user.id){
      setToStudy(0);
      setNotifications([])
    }
    const updateBar = async () => {
      let res = await fetch(`/api/users/${user.id}/navnums`);
      res = await res.json();
      setToStudy(res.numCardsToStudy);
      setNotifications(res.notes);
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
              Decks
            </NavLink>
            {!user.id ?
              (
                <>
                  <NavLink to="/login" exact={true} activeClassName="active">
                    Login
                  </NavLink>
                  {/* <NavLink to="/sign-up" exact={true} activeClassName="active">
                    Sign Up
                  </NavLink> */}
                </>
              ) : (
                <>
                <NavLink to="/classes" exact={true} activeClassName="active">
                  Classes
                </NavLink>
                <LogoutButton setAuthenticated={setAuthenticated}/>
                </>
              )
            }
          </Flex>
          <Flex
            align="center"
          >
          <Menu>
                <MenuButton
                  mx="3"
                  as={Button}
                  bg={notifications.length ? "red.500" : "teal.200"}
                  _hover={{bg:"teal.200"}}
                  _expanded={{bg:"teal.200"}}
                  rightIcon={<ChevronDownIcon
                />}>
                  {`${notifications.length} notification${notifications.length === 1 ? "" :  "s"}`}
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
          <Flex
            align="center"
          >
            <Link
              href="https://chrisresnick.github.io/"
            >App by Chris Resnick</Link>
            <IconButton
              icon={<FaLinkedin
              size={25}/>}
              bg="transparent"
              onClick={() => window.location="https://www.linkedin.com/in/chris-resnick/"}
            />
            <IconButton
              icon={<FaGithub
              size={25}/>}
              bg="transparent"
              onClick={() => window.location="https://github.com/chrisresnick/cardsapp"}
            />
          </Flex>


      </Flex>
  );
}

export default NavBar;
