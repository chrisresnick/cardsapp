import { Box, Heading, Button } from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

const Study = () => {
    const {deckId} = useParams();
    const history = useHistory();
    const [cardsToStudy, setCardsToStudy] = useState([]);

    const updateCards = async () => {
        let res = await fetch(deckId?`/api/deck/${deckId}/due`:"/api/cards/due");
        res = await res.json();
        if(!res.errors) setCardsToStudy(res.cards);
        else alert(res.errors[0]);
    };

    useEffect(() => {
        updateCards();
    }, [deckId])

    if(cardsToStudy.length === 0){
        return (
            <Box>
                <Heading>You're done studying all your cards!</Heading>
                <Button onClick={e=>history.push("/")}>Create new Cards</Button>
            </Box>
        );
    }
    return (
        null
    );
}

export default Study;
