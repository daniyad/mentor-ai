import { Box, Text, VStack, Card, CardHeader, CardBody, Button } from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';

const Chat = ({ problemId }: { problemId: string }) => {
    const [options, setOptions] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.post(`${API_URL}/mentor/conversation/next`, {
                    problemId: problemId,
                    nodeId: 'root',
                    messages: [],
                });

                setOptions(response.data.options);
                setMessages(response.data.messages);
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
                        {messages.map((message, index) => (
                            <Text key={index}>{message.text}</Text>
                        ))}
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
