import { Box, Text, VStack, Card, CardHeader, CardBody } from "@chakra-ui/react"

const Chat = ({ descriptionData }: { descriptionData: DescriptionData  }) => {
    return (
        <>
            <VStack>
                <Card>
                    <CardBody>
                        <Text>
                        {descriptionData.name}: {descriptionData.description_body}
                        </Text>
                    </CardBody>
                </Card>
            </VStack>
        </>
    )
}