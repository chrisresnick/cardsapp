import { Box, Button, SimpleGrid, Heading, Text, Flex, useDisclosure, Modal, ModalContent, ModalOverlay, Input} from "@chakra-ui/react";
import React, {useState, useEffect} from "react";
import {Scrollbar} from "./decks";
import {useParams, useHistory} from "react-router-dom";

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
            <Flex h="25vh" border="1px" justify="center" align="center">
                <Button onClick={onOpen}>Create Card</Button>
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

const Card = ({card}) => {
    const history = useHistory();
    return (
        <Flex h="25vh" border="1px" textAlign="center" direction="column" justify="space-around">
            <Text>{`Question: ${card.question}`}</Text>
            <Text>{`Answer: ${card.answer}`}</Text>
            <Button onClick={e=>history.push(`editCard/${card.id}`)}>Edit Card</Button>
        </Flex>
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
                    {cards.slice(startIdx, startIdx+9).map(card => <Card key={`card#${card.id}`} card={card}/>)}
                    {extras.slice(0, (9-(cards.length-startIdx))).map((_, idx) => <PlaceHolder key={`ph${idx}`} cards={cards} setCards={setCards} id={id}/>)}
                </SimpleGrid>
                <Scrollbar startIdx={startIdx} setStartIdx={setStartIdx} lim={cards.length}/>
            </Flex>
        </Flex>
    );
};

export default Cards;
