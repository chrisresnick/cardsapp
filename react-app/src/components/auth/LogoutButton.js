import React, {useContext} from "react";
import { logout } from "../../services/auth";
import {UserContext} from "../context";

const LogoutButton = ({setAuthenticated}) => {
  const {setUser} = useContext(UserContext);
  const onLogout = async (e) => {
    await logout();
    setAuthenticated(false);
    setUser({});
  };

  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
