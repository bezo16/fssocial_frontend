import { FC } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

type Props = {
    post: string;
};

const FeedCard: FC<Props> = ({ post }) => {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            p={4}
            bg="white"
            _hover={{ boxShadow: "lg" }}
        >
            <VStack align="start">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Post
                </Text>
                <Text fontSize="md" color="gray.600">
                    {post}
                </Text>
            </VStack>
        </Box>
    );
};

export default FeedCard;