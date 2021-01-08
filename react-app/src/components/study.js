import { Box, Heading, Button, Flex, Radio, RadioGroup, Stack, FormControl, FormLabel, Text } from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

const Study = () => {
    const {deckId} = useParams();
    const history = useHistory();
    const [cardsToStudy, setCardsToStudy] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [difficulty, setDifficulty] = useState("2");

    const updateCards = async () => {
        let res = await fetch(deckId?`/api/decks/${deckId}/due`:"/api/cards/due");
        res = await res.json();
        if(!res.errors) setCardsToStudy(res.cards);
        else alert(res.errors[0]);
    };

    useEffect(() => {
        updateCards();
    }, [deckId])

    const nextCard = async e => {
        e.preventDefault();
        let res = await fetch(`/api/cards/study`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                cardId: cardsToStudy[0].id,
                difficulty: Number.parseInt(difficulty),
                deckId: deckId || "None"
            })
        });
        res = await res.json()
        setCardsToStudy(res.cards);
        setShowAnswer(false);
        setDifficulty("2");
    }

    if(cardsToStudy.length === 0){
        return (
            <Flex direction="column" align="center">
                <Heading my={5}>You're done studying all your cards!</Heading>
                <Button onClick={e=>history.push("/")}>Create new Cards</Button>
            </Flex>
        );
    }
    return (
        <Flex w="100%" justify="center">
            <Flex direction="column" mt="5" w="50vw" px="auto" align="center">
                <Text>{`Question: ${cardsToStudy[0].question}`}</Text>
                <Flex direction="column" align="center">
                    {!showAnswer ?
                        <Button onClick={e => setShowAnswer(true)}>Show Answer</Button> :
                        (
                            <>
                                <Text>{`Answer: ${cardsToStudy[0].answer}`}</Text>
                                <FormControl as="fieldset">
                                    <FormLabel as="legend">How Hard was This Question</FormLabel>
                                    <RadioGroup onChange={setDifficulty} value={difficulty}>
                                        <Stack direction="row">
                                            <Radio value={"0"}>Very Easy</Radio>
                                            <Radio value={"1"}>Easy</Radio>
                                            <Radio value={"2"}>Fine</Radio>
                                            <Radio value={"3"}>Hard</Radio>
                                            <Radio value={"4"}>Very Hard</Radio>
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                                <Button onClick={nextCard}>Next Card</Button>
                            </>
                        )

                    }
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Study;
