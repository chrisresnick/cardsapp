import { Box, Heading, Button, Flex, Radio, RadioGroup, Stack, FormControl, FormLabel } from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

const Study = () => {
    const {deckId} = useParams();
    const history = useHistory();
    const [cardsToStudy, setCardsToStudy] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [difficulty, setDifficulty] = useSate(0);

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
        <Flex>
            <Text>{cardsToStudy[0].question}</Text>
            <Flex>
                {!showAnswer ?
                    <Button onClick={e => setShowAnswer(true)}>Show Answer</Button> :
                    (
                        <>
                            <Text>{cardsToStudy[0].answer}</Text>
                            <RadioGroup onChange={setValue} value={value}>
                                <Stack direction="row">
                                    <Radio value="1">First</Radio>
                                    <Radio value="2">Second</Radio>
                                    <Radio value="3">Third</Radio>
                                </Stack>
                            </RadioGroup>
                        </>
                    )

                }
            </Flex>
        </Flex>
    );
}

export default Study;
