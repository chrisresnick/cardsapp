import React from "react";

const HomePage  = ({user}) => {
    return user&&<h1>{user.username}</h1>
}

export default HomePage
