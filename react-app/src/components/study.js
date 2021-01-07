import { Box, Heading, Button, Flex, Radio, RadioGroup, Stack, FormControl, FormLabel, Text } from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

const Study = () => {
    const {deckId} = useParams();
    const history = useHistory();
    const [cardsToStudy, setCardsToStudy] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [difficulty, setDifficulty] = useState(2);

    const updateCards = async () => {
        let res = await fetch(deckId?`/api/deck/${deckId}/due`:"/api/cards/due");
        res = await res.json();
        if(!res.errors) setCardsToStudy(res.cards);
        else alert(res.errors[0]);
    };

    useEffect(() => {
        updateCards();
    }, [deckId])

    const nextCard = async e => {
        e.preventDefault();
        let res = await fetch(`api/cards/study`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                cardId: cardsToStudy[0].id,
                difficulty,
                deckId: deckId || "None"
            })
        });
        res = await res.json()
        setCardsToStudy(res);
        setShowAnswer(false);
        setDifficulty(2);
    }

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
                            <FormControl as="fieldset">
                                <FormLabel as="legend">How Hard was This Question</FormLabel>
                                <RadioGroup onChange={e => setDifficulty(e.target.value)} value={difficulty}>
                                    <Stack direction="row">
                                        <Radio value="0">Very Easy</Radio>
                                        <Radio value="1">Easy</Radio>
                                        <Radio value="2">Fine</Radio>
                                        <Radio value="3">Hard</Radio>
                                        <Radio value="4">Very Hard</Radio>
                                    </Stack>
                                </RadioGroup>
                                <Button onClick={nextCard}>Next Card</Button>
                            </FormControl>
                        </>
                    )

                }
            </Flex>
        </Flex>
    );
}

export default Study;
