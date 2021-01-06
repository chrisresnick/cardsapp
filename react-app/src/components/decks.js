import { Box, IconButton, Button, SimpleGrid, Text, Heading, Flex, useDisclosure, Modal, ModalContent, ModalOverlay, Input} from "@chakra-ui/react";
import {ArrowUpIcon, ArrowDownIcon} from '@chakra-ui/icons';
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
                        <form onSubmit={submitDeck}>
                            <Input
                                placeholder="Deck Name"
                                onChange={e => setName(e.target.value)}
                                value={name}
                                m="2"
                            />
                            <Button w="100%" onClick={submitDeck}>Create</Button>
                        </form>
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

export const Scrollbar = ({startIdx, setStartIdx, lim}) => {
    return (
        <Flex
            direction="column"
            borderTop="1px" borderRight="1px" borderBottom="1px"
            borderColor="gray.300"
            h="80vh"
            justify="space-between"
        >
            <IconButton
                onClick={e=>setStartIdx(startIdx-3)}
                aria-label="scrool up"
                icon={<ArrowUpIcon/>}
                disabled={startIdx < 3}
            />
            <IconButton
                onClick={e=>setStartIdx(startIdx+3)}
                aria-label="scrool down"
                icon={<ArrowDownIcon/>}
                disabled={startIdx > lim}
            />
        </Flex>
    );

};

const Decks = () => {
    const {user, setUser} = useContext(UserContext);
    const [decks, setDecks] = useState([]);
    const [startIdx, setStartIdx] = useState(0);
    const extras = [0,1,2,3,4,5,6,7,8]
    useEffect(() => {
        (async ()=>{
            let res = await fetch(`/api/users/${user.id}/decks`);
            res = await res.json();
            setDecks(res.decks)
        })();
    }, [user.id])
    return (
        <Flex width="100%" pt={10} justify="center">
            <Flex width="80%">
                <SimpleGrid borderLeft="1px" borderTop="1px" borderBottom="1px" borderColor="gray.300" p={10} columns={3} spacing={10} w="90%" h="80vh">
                    {decks.slice(startIdx, startIdx+9).map(deck => <Deck key={`deck#${deck.id}`} deck={deck}/>)}
                    {extras.slice(0, (9-(decks.length-startIdx))).map((_, idx) => <PlaceHolder key={`ph${idx}`} decks={decks} setDecks={setDecks}/>)}
                </SimpleGrid>
                <Scrollbar startIdx={startIdx} setStartIdx={setStartIdx} lim={decks.length}/>
            </Flex>
        </Flex>
    );

}

export default Decks;
