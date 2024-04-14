import React, { SetStateAction, useEffect, useRef } from "react";
import { useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import axios, { AxiosError, AxiosResponse } from "axios";
import Chat from "../components/Chat";
import { useNavigate, useParams } from "react-router-dom";
import Editorial from "../components/Editorial";
import MainHeading from "../components/MainHeading";
import Submissions from "../components/Submissions";
import HintDisplay from "../components/HintDisplay";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import { Box, Divider, VStack, Text, Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Heading, HStack, Card, CardHeader, CardBody, Avatar, Badge } from '@chakra-ui/react';
import { DescriptionData, Submission, Hint, HintResponse, Message, Option, ProblemDescriptionData } from '../types/general';
import { Editor } from "@monaco-editor/react"
import { Resizable } from 're-resizable';
import { PythonTester } from "../utils/python";

const ProblemPage = ({ }) => {
    const [username, setUsername] = useState<string>("");
    const [initCode, setInitCode] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const explanationRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentLang, setCurrentLang] = useState<string>("javascript");
    const handleSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        const mouseX = event.clientX;
        const newWidth = mouseX - 8;
        if (explanationRef.current)
            explanationRef.current.style.width = newWidth + "px";
    };

    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

    const [problemDescriptionData, setProblemDescriptionData] =
        useState<ProblemDescriptionData>();
    const [submissionStatus, setSubmissionStatus] = useState<boolean>();
    const [submissionData, setSubmisionData] = useState<Submission>();

    const navigate = useNavigate();

    const [isSolved, setIsSolved] = useState<boolean>(true);

    const [options, setOptions] = useState<Option[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentNodeId, setCurrentNodeId] = useState<string>('root');


    const { courseId, sectionId, problemId } = useParams();

    const submitCode = () => {
        setIsSubmitLoading(true);
        const pythonTester = new PythonTester();

        if (!courseId || !sectionId || !problemId) {
            console.log(`the problem for course: ${courseId}, section: ${sectionId}, problem: ${problemId} not found`);
            setIsSubmitLoading(false);
            return;
        }

        axios.post(
            `${API_URL}/api/problem_new/submit?courseId=${courseId}&sectionId=${sectionId}&problemId=${problemId}`,
            { code },
            { withCredentials: true },
        )
            .then(({ data }) => {
                if (data == "Accepted") {
                    setIsSolved(true)
                }
                // mark problem as solved, and allow moving to the other person
                console.log("LETS GOOOOO EBAT")
                setIsSubmitLoading(false);
            })
            .catch((err) => {
                setIsSubmitLoading(false);
            });
    };

    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/problem_new/problem?courseId=${courseId}&sectionId=${sectionId}&problemId=${problemId}`, { withCredentials: true });
                setProblemDescriptionData(response.data)
                setCode(response.data?.code_body.code_template ?? "Start coding here")
            } catch (error) {
                console.error('Failed to fetch problem data:', error);
            }
        };

        const fetchOptions = async () => {
            try {
                const response = await axios.post(`${API_URL}/api/mentor/conversation/next`, {
                    problemId: "hello-world",
                    nodeId: "root",
                    messages: messages,
                });

                setOptions(response.data.options);
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Failed to fetch options:', error);
            }
        };

        fetchProblemData();
        fetchOptions();
    }, [courseId, sectionId, problemId]);

    const handleOptionClick = async (option: Option) => {
        try {
            const response = await axios.post(`${API_URL}/api/mentor/conversation/next`, {
                problemId: 'hello-world',
                nodeId: option.id,
                messages: messages,
            });

            setOptions(response.data.options);
            setMessages(response.data.messages);
            setCurrentNodeId(option.id);
        } catch (error) {
            console.error('Failed to fetch next conversation step:', error);
        }
    };

    return (
        <>
            <MainHeading
                data={{
                    username: username,
                }}
            />

            <div style={{ display: 'flex', height: '100vh' }}>
                <Resizable
                    defaultSize={{
                        width: '50%',
                        height: '100%',
                    }}
                    style={{
                        overflow: 'auto',
                        backgroundColor: '#262626', // Background color
                    }}
                    handleStyles={{
                        right: {
                            background: '#262626',
                        },
                    }}
                >
                    <Box bg="#333333" pl={3}>
                        <Text mb={2} ml="" color="white">
                            <b>Description</b>
                        </Text>
                    </Box>
                    <HStack>
                        <VStack h="100%" pt={4} pl={4} align={"start"}>
                            <Heading as="h2" size="lg" color="white" fontWeight="bold">
                                {`${problemId}. ${problemDescriptionData?.name}`}
                            </Heading>
                            <HStack spacing={2} mb={4}>
                                <Badge colorScheme={problemDescriptionData?.difficulty === "Easy" ? "green" : problemDescriptionData?.difficulty === "Medium" ? "orange" : "red"}>
                                    {problemDescriptionData?.difficulty}
                                </Badge>
                                {problemDescriptionData?.isSolved && <Badge colorScheme="blue">Solved</Badge>}
                            </HStack>
                            {
                                messages.map((message, index) => (
                                    <HStack key={index} spacing={3}>
                                        <Avatar name={message.role} size="sm" />
                                        <Text color="white" maxW='md'>
                                            {message.text}
                                        </Text>
                                    </HStack>
                                ))
                            }
                            {options.map((option, index) => (
                                <Button key={index} onClick={() => handleOptionClick(option)}>{option.userQuestionText}</Button>
                            ))}
                        </VStack>
                    </HStack>
                </Resizable>
                <div style={{ flex: 1 }}>
                    <Box w="100%" h="90%">
                        <Editor
                            height="100%"
                            language="python"
                            theme="vs-dark"
                            value={code}
                            onChange={(newValue, e) => {
                                setCode(newValue!!);
                            }}
                            options={{ automaticLayout: true }}
                        />
                    </Box>
                    <Box w="100%" h="10%" p={2} bg="#262626" display="flex" justifyContent="flex-end">
                        <Button colorScheme="blue" size="sm" borderRadius="md" onClick={submitCode} isLoading={isSubmitLoading} loadingText="Submitting">
                            Submit
                        </Button>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default ProblemPage;
