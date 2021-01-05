import React, {useState, useEffect} from "react";
import {useSelector} from 'react-redux';

const HomePage  = () => {
    const user = useSelector(state => state.user);
    const [username, setUsername] = useState(user.username);
    useEffect(e => setUsername(user.username), []);
    console.log(user.get("username"))
    return <h1>{username}</h1>
}

export default HomePage
