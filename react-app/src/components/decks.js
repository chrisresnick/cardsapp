import { Box, Button, SimpleGrid, Text, Heading, Flex, useDisclosure, Modal, ModalContent, ModalOverlay, Input} from "@chakra-ui/react";
import React, {useState, useContext, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import {UserContext} from "./context";

const PlaceHolder = ({decks, setDecks}) => {
    const [name, setName] = useState("");
    const {isOpen, onOpen, onClose} = useDisclosure();

    const submitDeck = async e => {
        e.preventDefault();
        let res = await fetch("/api/decks/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({name})
        })
        res = await res.json();
        setDecks([...decks, res]);
        setName("");
        onClose();
    }
    return (
        <>
            <Flex h="20vh" border="1px" justify="center" align="center">
                <Button onClick={onOpen}>Create New Deck</Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent mx="auto" my="auto">
                    <Box textAlign="center" p="2">
                        <Heading>Create New Deck</Heading>
                        <Input
                            placeholder="Deck Name"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            m="2"
                        />
                        <Button w="100%" onClick={submitDeck}>Create</Button>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
}


const Deck = ({deck}) => {
    const history = useHistory();
    return (
        <Box h="20vh" border="1px" textAlign="center">
            <Heading>{deck.name}</Heading>
            <Text>{`${deck.numCards} ${deck.numCards === 1 ? 'card':'cards'} in deck`}</Text>
            <Flex justify="space-around">
                <Button onClick={e=>history.push(`editDeck/${deck.id}`)}>Edit Deck</Button>
                <Button onClick={e=>history.push(`studyDeck/${deck.id}`)}>Study Deck</Button>
            </Flex>
        </Box>
    )
}

const Decks = () => {
    const {user, setUser} = useContext(UserContext);
    const [decks, setDecks] = useState([]);
    const [startIdx, setStartIdx] = useState(0);
    const extras = [0,1,2,3,4,5,6,7,8,9,10]
    useEffect(() => {
        (async ()=>{
            let res = await fetch(`/api/users/${user.id}/decks`);
            res = await res.json();
            setDecks(res.decks)
        })();
    }, [user.id])
    return (
        <Box width="100%" pt={10}>
            <SimpleGrid border="1px" borderColor="gray.300" p={10} columns={3} spacing={10} w="80%" h="80vh" mx="auto">
                {decks.slice(startIdx, startIdx+9).map(deck => <Deck key={`deck#${deck.id}`} deck={deck}/>)}
                {extras.slice(0, (9-(decks.length-startIdx))).map((_, idx) => <PlaceHolder key={`ph${idx}`} decks={decks} setDecks={setDecks}/>)}
            </SimpleGrid>
        </Box>
    );

}

export default Decks;
