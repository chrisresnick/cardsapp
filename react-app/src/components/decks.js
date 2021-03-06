import { Box, IconButton, Button, SimpleGrid, Text, Heading, Flex, useDisclosure, Modal, ModalContent, ModalOverlay, Input, Editable, EditableInput, EditablePreview} from "@chakra-ui/react";
import {ArrowUpIcon, ArrowDownIcon} from '@chakra-ui/icons';
import React, {useState, useContext, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import {UserContext, DecksContext, HeightContext} from "./context";

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
            <Flex
                backgroundColor="teal.100"
                h="25vh"
                shadow="lg"
                rounded="xl"
                justify="center"
                align="center">
                <Button
                    variant="main"
                    onClick={onOpen}
                >
                        Create New Deck
                    </Button>
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
                                w="100%"
                                my="2"
                            />
                            <Button variant="main" w="100%" onClick={submitDeck}>Create</Button>
                        </form>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
}


const Deck = ({deck}) => {
    const history = useHistory();
    const editName = async name => {
        let res = await fetch(`/api/decks/${deck.id}/rename`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({name})
        });
        res = await res.json();
        if(res.errors) alert(res.errors[0]);
        else deck.name = res.name

    }
    return (
        <Flex
            h="25vh"
            backgroundColor="teal.100"
            textAlign="center"
            direction="column"
            justify="space-around"
            shadow="lg"
            rounded="xl"
        >
            {/* <Heading>{deck.name}</Heading> */}
            <Editable fontSize="2xl" fontWeight="bold" defaultValue={deck.name} onSubmit={editName}>
                <EditableInput/>
                <EditablePreview/>
            </Editable>
            <Text>{`${deck.numCards} ${deck.numCards === 1 ? 'card':'cards'} in deck`}</Text>
            <Flex justify="space-around">
                <Button
                    variant="main"
                    onClick={e=>history.push(`editDeck/${deck.id}`)}>Edit Deck</Button>
                <Button
                    variant="main"
                    onClick={e=>history.push(`study/${deck.id}`)}>Study Deck</Button>
            </Flex>
        </Flex>
    )
}

export const Scrollbar = ({startIdx, setStartIdx, lim}) => {
    return (
        <Flex
            direction="column"
            borderTop="1px" borderRight="1px" borderBottom="1px"
            borderColor="gray.300"
            h="85vh"
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
                disabled={startIdx > lim-9}
            />
        </Flex>
    );

};

const Decks = () => {
    const {user} = useContext(UserContext);
    const {decks, setDecks} = useContext(DecksContext);
    const heightLeft = useContext(HeightContext)
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
        <Flex w="100%" h={heightLeft+"px"} justify="center" align="center">
            <Flex width="80%">
                <SimpleGrid overflow="hidden" borderLeft="1px" borderTop="1px" borderBottom="1px" borderColor="gray.300" p={5} columns={3} spacing={5} w="90%" h="85vh">
                    {decks.slice(startIdx, startIdx+9).map(deck => <Deck key={`deck#${deck.id}`} deck={deck}/>)}
                    {extras.slice(0, (9-(decks.length-startIdx))).map((_, idx) => <PlaceHolder key={`ph${idx}`} decks={decks} setDecks={setDecks}/>)}
                </SimpleGrid>
                <Scrollbar startIdx={startIdx} setStartIdx={setStartIdx} lim={decks.length}/>
            </Flex>
        </Flex>
    );

}

export default Decks;
