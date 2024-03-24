import { Box, Text, VStack, Card, CardHeader, CardBody, Button } from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';

const Chat = ({ descriptionData, problemId }: { descriptionData: DescriptionData, problemId: number }) => {
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.post(`${API_URL}/api/mentor/conversation/next`, {
                    problemId: problemId,
                    nodeId: 'root',
                });
                setOptions(response.data.options);
            } catch (error) {
                console.error('Failed to fetch options:', error);
            }
        };

        fetchOptions();
    }, [problemId]);

    return (
        <>
            <VStack>
                <Card>
                    <CardBody>
                        <Text>
                        {descriptionData.name}: {descriptionData.description_body}
                        </Text>
                        {options.map((option, index) => (
                            <Button key={index}>{option}</Button>
                        ))}
                    </CardBody>
                </Card>
            </VStack>
        </>
    )
}
