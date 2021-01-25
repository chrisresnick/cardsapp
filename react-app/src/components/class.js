import React, {useContext, useState, useEffect} from "react";
import {Text, Table, Flex, SimpleGrid, Heading, Button, useDisclosure, Modal, ModalOverlay, ModalContent,
        Input, Thead, Tr, Th, Tbody, Td, useToast, useClipboard, IconButton, Select,} from "@chakra-ui/react";
import {CopyIcon} from "@chakra-ui/icons"
import {useHistory} from "react-router-dom";
import { UserContext, EnrolledClassesContext, DecksContext } from "./context";


const EnrolledClass = ({c, decks}) => {
    const [chDeck, setChDeck] = useState()
    const history = useHistory();
    const toast = useToast();

    return (
    <Tr>
        <Td><b>{c.name}</b></Td>
        <Td>{c.numStudents}</Td>
        <Td>
            {!decks.length ? <Text>No decks</Text> : (
                <Flex>
                    <Select
                        value={chDeck}
                        onChange={e=>setChDeck(e.target.value)}
                        bg="white"
                        borderRightRadius="none"
                        placeholder={`${decks.length} ${decks.length === 1 ? "deck" : "decks"}`}
                    >
                        {decks.map(deck => (
                        <option key={deck.id} value={deck.id}>
                            {deck.name}
                        </option>))}
                    </Select>
                    <Button
                        variant="main"
                        borderLeftRadius="none"
                        onClick={e=>chDeck ? history.push(`/study/${chDeck}`) : toast({
                            title:"Error",
                            description: "Choose a deck to study or use the link in the nav bar to study all cards due.",
                            status: "error",
                            isClosable: true
                        })}
                    >
                        Study
                    </Button>
                </Flex>

                )
            }
        </Td>
    </Tr>

    )
}

const OwnedClass = ({c, decks}) => {
    const {onCopy} = useClipboard(c.key)
    const [deckId, setDeckId] = useState();
    const toast = useToast();

    const publish = async () => {
        if(!deckId) return toast({
            title: "Error",
            description: "You must choose a deck to publish",
            status: "error",
            duration: 9000,
            isClosable: true
        })
        let res = await fetch(`/api/classes/${c.id}/publish`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({deckId})
        })
        res = await res.json();
        if(res.success){
            toast({
                title: "Sucess",
                description: "The deck you requested has been published",
                status: "success",
                duration: 9000,
                isClosable: true
            })
        }

    }

    return (
        <Tr>
            <Td><b>{c.name}</b></Td>
            <Td>{c.numStudents}</Td>
            <Td>
                <Flex direction="row" align="center">
                    <Text isTruncated maxW="8vw">{c.key}</Text>
                    <IconButton bg="transparent" onClick={onCopy} aria-label="Copy Class Key" icon={<CopyIcon />}/>
                </Flex>
            </Td>
            <Td>
                <Flex>
                    <Select
                        value={deckId}
                        minW="10vw"
                        bg="white"
                        onChange={e=>setDeckId(e.target.value)}
                        placeholder="choose a deck"
                        borderEndRadius="none"
                    >
                        {decks.map((deck) => (
                            <option value={deck.id} key={deck.id}>{deck.name}</option>
                        ))}
                    </Select>
                    <Button
                        variant="main"
                        borderLeftRadius="none"
                        onClick={publish}
                    >
                            Publish
                    </Button>
                </Flex>
            </Td>
        </Tr>
    )
}

const Class = () => {
    const {user} = useContext(UserContext);
    const [ownedClasses, setOwnedClasses] = useState([]);
    const {enrolledClasses, setEnrolledClasses}=useContext(EnrolledClassesContext);
    const {decks, setDecks} = useContext(DecksContext);
    const [className, setClassName] = useState("");
    const [key, setKey] = useState("");
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: enrollIsOpen,
            onOpen: enrollOnOpen,
            onClose: enrollOnClose} = useDisclosure();


    useEffect(() => {
        (async () => {
            let res = await fetch("/api/classes/");
            res = await res.json();
            setOwnedClasses(res.owned);
            setEnrolledClasses(res.enrolled);
            setDecks(res.decks);
        })()
    }, [user.id])

    const enroll = async e => {
        e.preventDefault();
        enrollOnClose();
        let res = await fetch("/api/classes/enroll", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({key: key.trim()})
        })
        res = await res.json();
        if(res.requestId) {
            return toast({
                title: "Request Created",
                description: "We've sent a request to the owner of the class for you to enroll.",
                status: "success",
                duration: 60000,
                isClosable: true,
              })
        }
        if(res.invalidKey){
            return toast({
                title: "Invalid Key",
                description: "The enrollment key you entered is invalid",
                status: "error",
                duration: 60000,
                isClosable: true,
              })
        }

    }

    const createClass = async e => {
        e.preventDefault();
        onClose();
        if(!className || !className.length){
            return toast({
                title: "Error",
                description: "You must provide a name for the class.",
                status: "error",
                isClosable: true
            });
        }
        let res = await fetch("/api/classes/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({name:className})
        })
        res = await res.json();
        if(!res.errors) {
            setClassName("");
            return setOwnedClasses([...ownedClasses, res]);
        }

    }

    return (
        <>
            <Flex w="100%" justify="center">
                <SimpleGrid columns={2} spacingX={20}>
                    <Flex direction="column" align="center">
                        <Heading my={3}>Classes You Own</Heading>
                        {ownedClasses.length ? (
                            <Table variant="striped" colorScheme='teal'>
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Students</Th>
                                        <Th>Enrollment Key</Th>
                                        <Th>Publish Deck</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {ownedClasses.map(c => <OwnedClass c={c} decks={decks}/>)}
                                </Tbody>
                            </Table>
                        ) : <Text>You don't own any classes</Text>}
                        <Button variant="main" my={3} onClick={onOpen}>Create a Class</Button>
                    </Flex>
                    <Flex direction="column" align="center">
                        <Heading my={3}>Classes You are Enrolled In</Heading>
                        {enrolledClasses.length ? (
                            <Table variant="striped" colorScheme="teal">
                                <Thead>
                                    <Tr>
                                        <Th>Class</Th>
                                        <Th>Number of Students</Th>
                                        <Th>Decks</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {enrolledClasses.map(c => <EnrolledClass c={c} decks={decks.filter(deck => deck.classId === c.id)}/>)}
                                </Tbody>
                            </Table>
                        ) : <Text>You aren't erolled in any classes</Text>}
                        <Button
                            variant="main"
                            my={3}
                            onClick={enrollOnOpen}
                        >Enroll in a Class</Button>
                    </Flex>
                </SimpleGrid>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent textAlign="center">
                    <form onSubmit={createClass}>
                        <Heading my="2">Create a Class</Heading>
                        <Input my="2" placeholder="class name" value={className} onChange={e=>setClassName(e.target.value)}/>
                        <Button variant="main" onClick={createClass} my="2">Create</Button>
                    </form>
                </ModalContent>
            </Modal>
            <Modal isOpen={enrollIsOpen} onClose={enrollOnClose}>
                <ModalOverlay/>
                <ModalContent textAlign="center">
                    <form onSubmit={enroll}>
                        <Heading my="2">Enroll in a Class</Heading>
                        <Input my="2" placeholder="enrollment key" value={key} onChange={e=>setKey(e.target.value)}/>
                        <Button variant="main" onClick={enroll} my="2">Request Enrollment</Button>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}
export default Class;
