import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MainHeading from "../components/MainHeading";
import { API_URL } from "../App";
import { Skeleton, Box, Flex, VStack, Text, Button, useToast, Heading, HStack, Avatar, Badge, background } from '@chakra-ui/react';
import { Award, Message, Option, ProblemDescriptionData } from '../types/general';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/dark.css';
import TypingIndicator from "../components/TypingIndicator";
import remarkGfm from 'remark-gfm';
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { useAuth } from "../AuthContext";
import LockedOut from "../components/LockedOut";
import Confetti from 'react-dom-confetti';

import { PythonTester } from "../utils/python";

const ProblemPage = ({ }) => {
    const { isLoggedIn } = useAuth(); // Fetches isLoggedIn status

    const [code, setCode] = useState<string>("");
    const toast = useToast()

    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

    const [problemDescriptionData, setProblemDescriptionData] =
        useState<ProblemDescriptionData>();

    const navigate = useNavigate();

    const [isSolved, setIsSolved] = useState<boolean>(true);

    const [options, setOptions] = useState<Option[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentNodeId, setCurrentNodeId] = useState<string>('root');
    const [isLoadingOption, setIsLoadingOption] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [isConfettiEnabled, setIsConfettiEnabled] = useState(false);

    const confettiConfig = {
        angle: 26,
        spread: 360,
        startVelocity: 67,
        elementCount: 300,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "9px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
      };
    const [pythonTester, setPythonTester] = useState<PythonTester>();


    const { courseId, sectionId, problemId } = useParams();

    const submitCode = async () => {
        setIsSubmitLoading(true);

        if (!courseId || !sectionId || !problemId) {
            console.error(`the problem for course: ${courseId}, section: ${sectionId}, problem: ${problemId} not found`);
            setIsSubmitLoading(false);
            return;
        }

        axios.post(
            `${API_URL}/api/problem_new/submit?courseId=${courseId}&sectionId=${sectionId}&problemId=${problemId}`,
            { code },
            { withCredentials: true },
        )
            .then(({ data }) => {
                if (data.status == "Accepted") {
                    setIsSolved(true)
                    toast({
                        title: "Congratulations!",
                        description: "Congratulations on completing the problem!",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                    });
                }
                if (data.awards.length > 0) {
                 showcaseAwardToast(data.awards)
                }
                setIsSubmitLoading(false);
            })
            .catch((_) => {
                setIsSubmitLoading(false);
                toast({
                    title: "Error",
                    description: "An error occurred while submitting your code. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            });
    };

    const showcaseAwardToast = (awards: Award[]) => {
        awards.map( award => {
            toast({
                title: `${award.description}`,
                description: "Congratulations on unlocking a new award!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        })
        setIsConfettiEnabled(true);
    }

    const goToNextProblem = () => {
        const nextProblem = problemDescriptionData?.next_problem
        if (nextProblem?.is_course_end == true) {
            navigate("/course-end")
            return
        }
        const nextProblemUrl = `/problems/${courseId}/${nextProblem?.section_id}/${nextProblem?.problem_id}`;
        navigate(nextProblemUrl);
    };

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }

        setIsInitialLoading(true);
        const fetchProblemData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/problem_new/problem?courseId=${courseId}&sectionId=${sectionId}&problemId=${problemId}`, { withCredentials: true });
                setProblemDescriptionData(response.data)
                setCode(response.data?.code_body.code_template ?? "Start coding here")
            } catch (error) {
                console.error('Failed to fetch problem data:', error);
                navigate("/error")
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
        // wait for both to be finished before setting loading to be false
        const setupPythonTester = async () => {
            try {
                setPythonTester(new PythonTester());
            } catch(error) {
                console.error('Failed to run Python', error);
            }
        }

        setupPythonTester();
        Promise.all([fetchProblemData(), fetchOptions()]).then(() => {
            setIsInitialLoading(false);
        });
    }, [courseId, sectionId, problemId]);

    const handleOptionClick = async (option: Option) => {
        setIsLoadingOption(true);
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
        } finally {
            setIsLoadingOption(false);
        }
    };

    if (!isLoggedIn) {
        return <LockedOut/>
    }

    return (
        <>
            <MainHeading
                data={{
                    status: "logged-in"
                }}
            />
            <div style={{ height: '100vh', fontFamily: 'menlo' }}>
                <Splitter minWidths={[500, 500]} direction={SplitDirection.Horizontal}>
                    <Box height="100vh" bg="#1A1A1A">
                        <Box bg="#333333" pl={3}>
                            <Text mb={2} color="white">
                                <b>Description</b>
                            </Text>
                        </Box>
                        <HStack>
                            <VStack h="100%" pt={4} pl={4} align={"start"}>
                                <Skeleton isLoaded={!isInitialLoading} startColor="#333333" endColor="#E2E8F0">
                                    <Heading as="h2" size="lg" color="white" fontWeight="bold" fontFamily="menlo">
                                        {`${problemId}. ${problemDescriptionData?.name}`}
                                    </Heading>
                                </Skeleton>
                                <HStack spacing={2} mb={4}>
                                    <Badge colorScheme={problemDescriptionData?.difficulty === "Easy" ? "green" : problemDescriptionData?.difficulty === "Medium" ? "orange" : "red"}>
                                        {problemDescriptionData?.difficulty}
                                    </Badge>
                                    {problemDescriptionData?.is_solved && <Badge colorScheme="blue">Solved</Badge>}
                                </HStack>
                                {
                                    messages.map((message, index) => (
                                        <HStack key={index} spacing={3} textColor="white">
                                            <Avatar name={message.role} size="sm" />
                                            <VStack h="100%" w="90%" align={"start"}>
                                                <ReactMarkdown
                                                    children={message.text}
                                                    rehypePlugins={[rehypeHighlight]}
                                                    remarkPlugins={[remarkGfm]}

                                                />
                                            </VStack>
                                        </HStack>
                                    ))
                                }
                                {isLoadingOption ? (
                                    <TypingIndicator />
                                ) : (
                                    options.map((option, index) => (
                                        <Button key={index} onClick={() => handleOptionClick(option)}>{option.userQuestionText}</Button>
                                    ))
                                )}
                            </VStack>
                        </HStack>
                    </Box>
                    <Box height="100vh">
                        <Box bg="#333333" pl={3}>
                            <Text mb={2} ml="" color="white" fontFamily="menlo">
                                <b>Code</b>
                            </Text>
                        </Box>
                        <Flex direction="column" height="100%">
                            <Box flex="95">
                                <ReactCodeMirror
                                    theme={tokyoNight}
                                    value={code}
                                    onChange={(newValue, e) => {
                                        setCode(newValue!!);
                                    }}
                                    extensions={[loadLanguage("python")!]}
                                    style={{height: "auto"}}
                                />
                            </Box>
                            <Box
                                flex="5"  // 10% of the height
                                p={2}
                                bg="#262626"
                                display="flex"
                                justifyContent="flex-end"
                                borderRadius="md"
                            >
                                <Confetti active={ isConfettiEnabled } config={ confettiConfig }/>
                                <Button
                                    colorScheme="green"
                                    size="sm"
                                    borderRadius="md"
                                    onClick={submitCode}
                                    isLoading={isSubmitLoading}
                                    loadingText="Submitting"
                                >
                                    Submit
                                </Button>
                                {isSolved && (
                                    <Button
                                        colorScheme="blue"
                                        size="sm"
                                        ml={4}  // Margin left to space it from the submit button
                                        borderRadius="md"
                                        onClick={goToNextProblem}
                                        style={{
                                            boxShadow: '0 0 8px 3px rgba(72, 187, 120, 0.7)' // Green glowing effect
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </Flex>
                    </Box>
                </Splitter>
            </div>
        </>
    );
};

export default ProblemPage;
