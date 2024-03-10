import { Box, Text } from "@chakra-ui/react"

const Chat = ({ descriptionData, messages }: { descriptionData: DescriptionData, messages:  }) => {
    return (
        <>
        {messages.map((message, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} mb={4}>
                <Text>{message.content}</Text>
                <Text fontSize="sm" color="gray.500">{message.author}</Text>
                <Text fontSize="xs" color="gray.400">{message.timestamp}</Text>
            </Box>
        ))}
        </>
    )
}