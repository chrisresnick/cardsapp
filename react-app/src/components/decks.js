import React, {useState, useContext, useEffect} from "react";
import {UserContext} from "./context";

const Deck = () => {
    const {user, setUser} = useContext(UserContext);
    const [decks, setDecks] = useState([])


}

export default Deck;
