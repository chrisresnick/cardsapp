import React, {useContext} from "react";
import {Stack, Text, Flex, Button, useToast, Heading} from "@chakra-ui/react";
import {EnrolledClassesContext, DecksContext, UserContext} from "./context";

const Note = ({note}) => {
    const toast = useToast();
    const {setEnrolledClasses} = useContext(EnrolledClassesContext);
    const {setDecks} = useContext(DecksContext);
    const {user} = useContext(UserContext);

    const dismiss = async e => {
        e.preventDefault();
        await fetch(`/api/notes/${note.id}`, {
            method:"DELETE"
        })
        if(note.noteType == "approve") {
            let res =  await fetch(`/api/classes/`);
            res = await res.json();
            setEnrolledClasses(res.enrolled);
        }
        if(note.noteType == "deck") {
            let res = await fetch(`/api/users/${user.id}/decks`);
            res = await res.json();
            setDecks(res.decks)
        }
    }

    const approve = async e => {
        e.preventDefault()
        let res = await fetch(`/api/notes/${note.id}/accept`, {
            method: "POST"
        });
        res = await res.json();
        if(res.errors){
            res.errors.forEach(err => toast({
                title: "Error",
                description: err,
                status: "error",
                duration: 10000,
                isClosable: true
            }));
        }
    }

    const deny = async e => {
        e.preventDefault();
        let res = await fetch(`/api/notes/${note.id}/deny`, {
            method: "POST"
        });
        res = await res.json();
    }

    if(note.noteType === "request"){
        return (
            <Stack direction="column" w="100%" textAlign="center">
                <Text>{note.message}</Text>
                <Flex justify="space-between">
                    <Button onClick={approve} backgroundColor="green.500">Approve</Button>
                    <Button onClick={deny} backgroundColor="red.500">Deny</Button>
                </Flex>
            </Stack>
        )
    }
    if(note.noteType === "approve" || note.noteType === "deny" || note.noteType === "deck"){
        return (
            <Stack direction="column" w="100%" textAlign="center">
                <Text>{note.message}</Text>
                <Flex justify="center">
                    <Button onClick={dismiss} backgroundColor="green.500">Dismiss</Button>
                </Flex>
            </Stack>
        )
    }
    return (
        <Heading>Unrecognized Note Type!!!!</Heading>
    );


}

export default Note;
