import {Heading, Button, Flex, Radio, RadioGroup,FormControl, Text } from "@chakra-ui/react";
import React, {useEffect, useState, useContext} from "react";
import {useHistory, useParams} from "react-router-dom";
import {DecksContext} from "./context"

const Study = () => {
    const {deckId} = useParams();
    const history = useHistory();
    const [cardsToStudy, setCardsToStudy] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [difficulty, setDifficulty] = useState("2");
    const {decks} = useContext(DecksContext);



    useEffect(() => {
        const updateCards = async () => {
            let res = await fetch(deckId?`/api/decks/${deckId}/due`:"/api/cards/due");
            res = await res.json();
            if(!res.errors) setCardsToStudy(res.cards);
            else alert(res.errors[0]);
        };
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
            <Flex
                direction="column"
                mt="5"
                px="auto"
                align="center"
                justify="space-between"
                h="50vh"
                w="75vw"
                border="1px"
                borderColor="gray.300"
                py={3}
            >
                <Flex
                    direction="column"
                >
                    <Text><b>{`Deck: `}</b>{decks.filter(deck=>deck.id===cardsToStudy[0].deckId)[0].name}</Text>
                    <Text><b>{`Question: `}</b>{cardsToStudy[0].question}</Text>
                </Flex>
                    {!showAnswer ?
                        <Button variant="main" my={3} onClick={e => setShowAnswer(true)}>Show Answer</Button> :
                        (
                            <>
                                <Text><b>{`Answer: `}</b>{cardsToStudy[0].answer}</Text>
                                <Flex direction="column" align="center">
                                    <FormControl>
                                        <Heading textAlign="center" as="h3" fontSize={15}>How Hard was This Question?</Heading>
                                        <RadioGroup onChange={setDifficulty} value={difficulty}>
                                            <Flex justify="space-between" w="50vw">
                                                <Flex direction="column" justify="center" align="center">
                                                    <Radio value={"0"}><b>Very Easy</b></Radio>
                                                    <Text>1 Day</Text>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Radio value={"1"}><b>Easy</b></Radio>
                                                    <Text>1 Hour</Text>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Radio value={"2"}><b>Fine</b></Radio>
                                                    <Text>10 Minutes</Text>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Radio value={"3"}><b>Hard</b></Radio>
                                                    <Text>1 Minute</Text>
                                                </Flex>
                                                <Flex direction="column" justify="center" align="center">
                                                    <Radio value={"4"}><b>Very Hard</b></Radio>
                                                    <Text>Keep In Stack</Text>
                                                </Flex>
                                            </Flex>
                                        </RadioGroup>
                                    </FormControl>
                                    <Button variant="main" onClick={nextCard}>Next Card</Button>
                                </Flex>
                            </>
                        )

                    }
            </Flex>
        </Flex>
    );
}

export default Study;
