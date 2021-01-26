import {extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Button: {
            variants: {
                "main": {
                    backgroundColor: "black",
                    color: "white",
                    _hover: {backgroundColor:"gray.500"}
                },
                "delete": {
                    backgroundColor: "red.500",
                    color: "white",
                    _hover: {backgroundColor:"red.200"}
                }
            }
        },
    }
})

export default theme;
