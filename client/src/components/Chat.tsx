import { Box, Text, VStack, Card, CardHeader, CardBody, Button } from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';
import { Message } from '../types/general';

const Chat = ({ problemId }: { problemId: string }) => {
    const [options, setOptions] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentNodeId, setCurrentNodeId] = useState<string>('root');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.post(`${API_URL}/api/mentor/conversation/next`, {
                    problemId: problemId,
                    nodeId: currentNodeId,
                    messages: messages,
                });

                setOptions(response.data.options);
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Failed to fetch options:', error);
            }
        };

        fetchOptions();
    }, [problemId, currentNodeId]);

    const handleOptionClick = async (option: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/mentor/conversation/next`, {
                problemId: problemId,
                nodeId: option,
                messages: messages,
            });

            setOptions(response.data.options);
            setMessages(response.data.messages);
            setCurrentNodeId(option);
        } catch (error) {
            console.error('Failed to fetch next conversation step:', error);
        }
    };

    return (
        <>
            <VStack>
                <Card>
                    <CardBody>
                        {messages.map((message, index) => (
                            <Text key={index}>{message.role} : {message.text}</Text>
                        ))}
                        {options.map((option, index) => (
                            <Button key={index} onClick={() => handleOptionClick(option)}>{option}</Button>
                        ))}
                    </CardBody>
                </Card>
            </VStack>
        </>
    )
}

export default Chat;
