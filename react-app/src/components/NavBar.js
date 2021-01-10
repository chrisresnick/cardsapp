import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import {Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {useContext, useState} from "react";
import {UserContext} from "./context";
import Note from "./note";

const NavBar = ({setAuthenticated}) => {

  const {user, setUser} = useContext(UserContext);
  const [toStudy, setToStudy] = useState(0);
  const [notifications, setNotifications] = useState([]);

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
        paddingY='2'
        px={2}
        bg="blue.50"
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
            <NavLink to="/users" exact={true} activeClassName="active">
              Users
            </NavLink>
            <LogoutButton setAuthenticated={setAuthenticated}/>
          </Flex>
          {toStudy ? (
            <>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                  {`${notifications.length} notifications`}
                </MenuButton>
                <MenuList>
                  {notifications.map(note => (
                    <MenuItem>
                      <Note note={note} />
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <NavLink to="/study" exact={true} activeClassName="active">
                {`Study ${toStudy}${toStudy ===1?' card':" cards"}`}
              </NavLink>
            </>
          ): <Text>No cards due.</Text>}

      </Flex>
  );
}

export default NavBar;
