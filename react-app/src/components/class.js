import React, {useContext, useState, useEffect} from "react";
import {Text, Table, Flex, SimpleGrid, Heading, Button, useDisclosure, Modal, ModalOverlay, ModalContent, Input, Thead, Tr, Th, Tbody, Td} from "@chakra-ui/react";
import { UserContext } from "./context";

const Class = () => {
    const {user} = useContext(UserContext);
    const [ownedClasses, setOwnedClasses] = useState([]);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [className, setClassName] = useState("");
    const [key, setKey] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: enrollIsOpen,
            onOpen: enrollOnOpen,
            onClose: enrollOnClose} = useDisclosure();


    useEffect(() => {
        (async () => {
            console.log("before", ownedClasses);
            let res = await fetch("/api/classes/");
            res = await res.json();
            setOwnedClasses(res.owned);
            setEnrolledClasses(res.enrolled);
            console.log("after", ownedClasses);
        })()
    }, [user.id])

    const enroll = async e => {
        e.preventDefault();
        enrollOnClose();
    }

    const createClass = async e => {
        e.preventDefault();
        onClose();
        let res = await fetch("/api/classes/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({name:className})
        })
        res = await res.json();
        if(!res.errors) {
            return setOwnedClasses([...ownedClasses, res]);
        }

    }

    return (
        <>
            <Flex w="100%" justify="center">
                <SimpleGrid columns={2}>
                    <Flex direction="column" align="center">
                        <Heading>Classes You Own</Heading>
                        {ownedClasses.length ? (
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Number of Students</Th>
                                        <Th>Enrollment Key</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {ownedClasses.map(c => (
                                        <Tr>
                                            <Td><b>{c.name}</b></Td>
                                            <Td>{c.numStudents}</Td>
                                            <Td>{c.key}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        ) : <Text>You don't own any classes</Text>}
                        <Button onClick={onOpen}>Create a Class</Button>
                    </Flex>
                    <Flex direction="column" align="center">
                        <Heading>Classes You are Enrolled In</Heading>
                        {enrolledClasses.length ? null : <Text>You aren't erolled in any classes</Text>}
                        <Button onClick={enrollOnOpen}>Enroll in a Class</Button>
                    </Flex>
                </SimpleGrid>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent textAlign="center">
                    <form onSubmit={createClass}>
                        <Heading my="2">Create a Class</Heading>
                        <Input my="2" placeholder="class name" value={className} onChange={e=>setClassName(e.target.value)}/>
                        <Button onClick={createClass} my="2">Create</Button>
                    </form>
                </ModalContent>
            </Modal>
            <Modal isOpen={enrollIsOpen} onClose={enrollOnClose}>
                <ModalOverlay/>
                <ModalContent textAlign="center">
                    <form onSubmit={enroll}>
                        <Heading my="2">Enroll in a Class</Heading>
                        <Input my="2" placeholder="enrollment key" value={key} onChange={e=>setKey(e.target.value)}/>
                        <Button onClick={enroll} my="2">Request Enrollment</Button>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}
export default Class;
