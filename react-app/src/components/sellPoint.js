import React from "react";
import {SimpleGrid, Image, Center, Text} from "@chakra-ui/react";

const SellPoint = ({img, text, left}) => {
    if(left){
        return (
            <SimpleGrid gridTemplateColumns="20vmin 1fr" w="80%" spacingX="2vmin">
                <Image
                    boxSize="20vmin"
                    objectFit="cover"
                    src={img}
                />
                <Center>
                    <Text>
                        {text}
                    </Text>
                </Center>
            </SimpleGrid>
        )
    }
    return (
        <SimpleGrid gridTemplateColumns="1fr 20vmin" w="80%" spacingX="2vmin">
            <Center>
                <Text>
                    {text}
                </Text>
            </Center>
            <Image
                boxSize="20vmin"
                objectFit="cover"
                src={img}
            />

        </SimpleGrid>
    )
}

export default SellPoint;
