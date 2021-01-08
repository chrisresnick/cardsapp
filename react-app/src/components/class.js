import React, {useContext, useState, useEffect} from "react";
import {Text, Flex, SimpleGrid, Heading, Button} from "@chakra-ui/react";
import UserContext from "./context";

const Class = () => {
    const {user, setUser} = useContext(UserContext);
    const {ownedClasses, setOwnedClasses} = useState([]);
    const {enrolledClasses, setEnrolledClasses} = useState([]);

    useEffect(() => {
        (async () => {
            let res = await fetch("/api/classes/");
            res = await res.json();
            setOwnedClasses(res.owned);
            setEnrolledClasses(res.enrolled);
        })()
    }, [user.id])

    return (
        <Flex w="100%" align="center">
            <SimpleGrid columns={2}>
                <Flex direction="column">
                    <Heading>Classes You Own</Heading>
                    {ownedClasses.length ? null : <Text>You don't own any classes</Text>}
                    <Button>Create a Class</Button>
                </Flex>
                <Flex direction="column">
                    <Heading>Classes You are Enrolled In</Heading>
                    {enrolledClasses.length ? null : <Text>You aren't erolled in any classes</Text>}
                    <Button>Enroll in a Class</Button>
                </Flex>
            </SimpleGrid>
        </Flex>
    );
}
export default Class;
