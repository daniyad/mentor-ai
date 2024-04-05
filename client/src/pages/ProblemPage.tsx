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
import { HStack, VStack, Card, CardBody, Button, Text, CardHeader, Flex, Box, Heading } from "@chakra-ui/react";
import { DescriptionData, Submission, Hint, HintResponse, Message, Option, ProblemDescriptionData } from '../types/general';
import { Editor } from "@monaco-editor/react"

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

    const [isSolved, setIsSolved] = useState<boolean>(false);

    const [options, setOptions] = useState<Option[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentNodeId, setCurrentNodeId] = useState<string>('root');

    const { courseId, sectionId, problemId } = useParams();

    const submitCode = () => {
        setIsSubmitLoading(true);
        if (!courseId || !sectionId || problemId) {
            console.log(`the problem for course: ${courseId}, section: ${sectionId}, ${problemId} not found`);
            setIsSubmitLoading(false);
            return;
        }

        axios.post(
            `${API_URL}/api/problem-new/submit/${courseId}/${sectionId}/${problemId}`,
            { code },
            { withCredentials: true },
        )
            .then(({ data }) => {
                if (data == "Accepted") {
                    setIsSolved(true)
                }
                // mark problem as solved, and allow moving to the other person
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
            <HStack pr={0} mr={0}>
                <VStack h="100vh" pt={4}>
                    {
                        messages.map((message, index) => (
                            <Card maxW='md'>
                                <CardHeader>
                                    <Heading size='md'>{message.role}</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Text>
                                        {message.text}
                                    </Text>
                                </CardBody>
                            </Card>
                        ))
                    }
                    {options.map((option, index) => (
                        <Button key={index} onClick={() => handleOptionClick(option)}>{option.userQuestionText}</Button>
                    ))}
                </VStack>
                <Flex direction="column" h="100vh" w="100%" mr={0} pr={0}>
                    <Box flex="85" mb="2">
                        <Editor theme="vs-dark" defaultLanguage="python" value=""/>
                    </Box>
                    <Box flex="15" display="flex" justifyContent="flex-end">
                        <Button>Submit</Button>
                    </Box>
                </Flex>
                {/* <ReactCodeMirror
                    value={
                        code === "" || code == null
                            ? initCode || ""
                            : code || ""
                    }
                    extensions={[loadLanguage("javascript")!]}
                    theme={tokyoNight}
                    onChange={(value) => {
                        setCode(value);
                    }}
                    minHeight='100%'
                /> */}
            </HStack>
        </>
    );
};

export default ProblemPage;
