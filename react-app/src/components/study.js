import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import {useHistory, useParams} from "react-router-dom";
import {Heading, Box, Button} from "@chakra-ui/react";

const Study = () => {
    const {deckId} = useParams();
    const history = useHistory();

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
