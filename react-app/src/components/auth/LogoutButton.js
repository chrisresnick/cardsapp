import React from "react";
import { logout } from "../../services/auth";
import {useDispatch} from "react-redux";
import * as userActions from "../../store/user";

const LogoutButton = ({setAuthenticated}) => {
  const dispatch = useDispatch();
  const onLogout = async (e) => {
    await logout();
    setAuthenticated(false);
    dispatch(userActions.deleteUser())
  };

  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
