import {extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Button: {
            variants: {
                "main": {
                    backgroundColor: "black",
                    color: "white",
                    _hover: {backgroundColor:"gray.500"}
                }
            }
        },
    }
})

export default theme;
