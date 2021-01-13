import { Box, Button, SimpleGrid, Heading, Text, Flex, useDisclosure, Modal, ModalContent, ModalOverlay, Input} from "@chakra-ui/react";
import React, {useState, useEffect} from "react";
import {Scrollbar} from "./decks";
import {useParams} from "react-router-dom";

const PlaceHolder = ({cards, setCards, id}) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const {isOpen, onOpen, onClose} = useDisclosure();

    const submitCard = async e => {
        e.preventDefault();
        let res = await fetch(`/api/decks/${id}/cards`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({question, answer})
        })
        res = await res.json();
        setCards([...cards, res]);
        setQuestion("");
        setAnswer("");
        onClose();
    }
    return (
        <>
            <Flex
                h="25vh"
                bg="teal.100"
                shadow="lg"
                rounded="xl"
                justify="center"
                align="center"
            >
                <Button variant="main" onClick={onOpen}>Create Card</Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent mx="auto" my="auto">
                    <Box textAlign="center" p="2">
                        <Heading>Create Card</Heading>
                        <form onSubmit={submitCard}>
                            <Input
                                placeholder="Question"
                                onChange={e => setQuestion(e.target.value)}
                                value={question}
                                m="2"
                            />
                            <Input
                                placeholder="Answer"
                                onChange={e => setAnswer(e.target.value)}
                                value={answer}
                                m="2"
                            />
                            <Button w="100%" onClick={submitCard}>Create</Button>
                        </form>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
}

const Card = ({card, cards, setCards, idx}) => {
    const [question, setQuestion] = useState(card.question);
    const [answer, setAnswer] = useState(card.answer);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const editCard = async e => {
        e.preventDefault();
        let res = await fetch(`/api/cards/${card.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({question, answer})
        })
        res = await res.json();
        if(res.errors) {
            alert(res.errors[0]);
            return;
        }
        const cardsCopy = [...cards];
        cardsCopy[idx] = res;
        setCards(cardsCopy);
        onClose();
    };

    return (
        <>
            <Flex
                h="25vh"
                bg="teal.100"
                shadow="lg"
                rounded="xl"
                textAlign="center"
                direction="column"
                justify="space-around"
            >
                <Text>{`Question: ${card.question}`}</Text>
                <Text>{`Answer: ${card.answer}`}</Text>
                <Button mx={3} variant="main" onClick={onOpen}>Edit Card</Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                <Box textAlign="center" p="2">
                        <Heading>Edit Card</Heading>
                        <form onSubmit={editCard}>
                            <Input
                                placeholder="Question"
                                onChange={e => setQuestion(e.target.value)}
                                value={question}
                                m="2"
                            />
                            <Input
                                placeholder="Answer"
                                onChange={e => setAnswer(e.target.value)}
                                value={answer}
                                m="2"
                            />
                            <Button w="100%" onClick={editCard}>Edit</Button>
                        </form>
                    </Box>

                </ModalContent>
            </Modal>
        </>
    )
}

const Cards = () => {
    const [cards, setCards] = useState([]);
    const [startIdx, setStartIdx] = useState(0);
    const extras = [0,1,2,3,4,5,6,7,8]
    const {id} = useParams();
    useEffect(() => {
        (async ()=>{
            let res = await fetch(`/api/decks/${id}/cards`);
            res = await res.json();
            setCards(res.cards)
        })();
    }, [id])
    return (
        <Flex width="100%" pt={5} justify="center">
            <Flex width="80%">
                <SimpleGrid overflow="hidden" borderLeft="1px" borderTop="1px" borderBottom="1px" borderColor="gray.300" p={5} columns={3} spacing={5} w="90%" h="85vh">
                    {cards.slice(startIdx, startIdx+9).map((card, idx) => <Card key={`card#${card.id}`} card={card} cards={cards} setCards={setCards} idx={idx}/>)}
                    {extras.slice(0, (9-(cards.length-startIdx))).map((_, idx) => <PlaceHolder key={`ph${idx}`} cards={cards} setCards={setCards} id={id}/>)}
                </SimpleGrid>
                <Scrollbar startIdx={startIdx} setStartIdx={setStartIdx} lim={cards.length}/>
            </Flex>
        </Flex>
    );
};

export default Cards;
