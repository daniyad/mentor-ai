<<<<<<< Updated upstream
import React, { SetStateAction, useEffect, useRef } from "react";
import { useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import axios, { AxiosError, AxiosResponse } from "axios";
import ProblemNavbar from "../components/ProblemNavbar";
import ProblemDescription from "../components/ProblemDescription";
import { useNavigate, useParams } from "react-router-dom";
import Editorial from "../components/Editorial";
import MainHeading from "../components/MainHeading";
import Submissions from "../components/Submissions";
import { API_URL } from "../App";
import Loading from "../components/Loading";

const ProblemPage = ({
    data,
    token,
    id,
}: {
    data?: ProblemPageData;
    token: string | null;
    id: string | null;
}) => {
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

    const [editorial, setEditorial] = useState<string>("");

    const activeNavOption = data?.activeNavOption || "description";

    const [problemDescriptionData, setProblemDescriptionData] =
        useState<DescriptionData>();

    const [submissionData, setSubmissionData] = useState<Submission[]>();
    const navigate = useNavigate();

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const { name } = useParams();

    const submitCode = () => {
        setIsSubmitLoading(true);
        if (!id || !name) {
            console.log("id not found");
            setIsSubmitLoading(false);
            return;
        }

        const problem_name = name;
        axios
            .post<
                {},
                { data: Submission[] },
                { code: string; id: string; problem_name: string }
            >(`${API_URL}/api/problem/submit/${name}`, {
                code,
                id,
                problem_name,
            })
            .then(({ data }) => {
                setIsSubmitted(true);
                setSubmissionData(data);
                navigate(`/problem/${name}/submissions`);
                setIsSubmitLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsSubmitLoading(false);
                setIsSubmitted(true);
            });
    };

    useEffect(() => {
        axios
            .post(`${API_URL}/api/problem/${name}`, { id: id })
            .then(({ data }) => {
                setProblemDescriptionData(
                    data.main as unknown as SetStateAction<
                        DescriptionData | undefined
                    >
                );
                if (
                    "code_body" in data.main &&
                    "javascript" in data.main.code_body
                ) {
                    setInitCode(
                        data.main.code_body.javascript as unknown as string
                    );
                }
            })
            .catch((e) => console.error(e));

        if (!token) return;

        axios
            .get(`${API_URL}/api/accounts/id/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(({ data }) => {
                setUsername(data.username);
            })
            .catch((e: AxiosError) => {
                console.log(e);
                navigate("/sorry");
            });

        if (!id || !name) {
            console.log("id not found");
            return;
        }
        axios
            .post<{}, { data: Submission[] }, { id: string }>(
                `${API_URL}/api/problem/submissions/${name}`,
                { id: id || "" }
            )
            .then(({ data }) => {
                if (data.length !== 0) {
                    setCode(data[0].code_body);
                }
                setSubmissionData(data);
            })
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        if (activeNavOption === "description") return;

        axios
            .get(`${API_URL}/api/problem/${name}/${activeNavOption}`)
            .then(({ data }) => {
                if (activeNavOption === "editorial") {
                    if ("editorial_body" in data) {
                        setEditorial(data.editorial_body);
                    }
                }
            })
            .catch((e) => console.error(e));
    }, [activeNavOption]);

    return (
        <>
            <MainHeading
                data={{
                    items: [{ text: "Problem List", link_path: "/problemset" }],
                    username: username,
                }}
            />
            <div className="h-[calc(100vh-60px)] overflow-hidden bg-black">
                <div
                    id="cont"
                    className="relative flex flex-row h-[calc(100vh-60px)] w-full mt-[8px] "
                >
                    <div
                        id="explanation"
                        className="h-[calc(100%-16px)] bg-black border border-borders ml-[8px] rounded-lg w-[50%] overflow-hidden"
                        ref={explanationRef}
                    >
                        <div className="relative w-full bg-black h-[50px] rounded-t-lg overflow-hidden border-b border-borders box-content">
                            {name != undefined && (
                                <ProblemNavbar
                                    data={{
                                        problem_name: name,
                                        nav_option_name: activeNavOption,
                                    }}
                                />
                            )}
                        </div>
                        <div className="description-body relative w-full h-[calc(100%-50px)] overflow-y-auto bg-black">
                            {problemDescriptionData != undefined &&
                            activeNavOption === "description" ? (
                                <>
                                    <ProblemDescription
                                        data={problemDescriptionData}
                                    />
                                </>
                            ) : activeNavOption === "description" ? (
                                <Loading For="pDescription" />
                            ) : (
                                <></>
                            )}
                            {activeNavOption === "editorial" &&
                            editorial != "" ? (
                                <Editorial data={editorial} />
                            ) : activeNavOption === "editorial" ? (
                                <Loading For="pEditorial" />
                            ) : (
                                <></>
                            )}
                            {activeNavOption === "submissions" &&
                                submissionData != undefined && (
                                    <Submissions
                                        data={{
                                            submissions_list: submissionData,
                                            is_submitted: isSubmitted,
                                        }}
                                    />
                                )}
                        </div>
                    </div>
                    <div
                        id="slider"
                        className="w-[8px] h-[calc(100%-16px)] rounded-lg hover:bg-blue-800 hover:cursor-col-resize transition active:bg-blue-800 active:cursor-col-resize"
                        onDrag={handleSlider}
                        ref={sliderRef}
                        draggable="true"
                    ></div>
                    <div className="flex flex-col h-[calc(100%-16px)] min-w-[calc(20%-8px)] mr-[8px] flex-grow">
                        <div className="min-h-0 flex-grow min-w-full mr-[8px] mb-[8px] rounded-lg overflow-hidden bg-black border border-borders">
                            <div className="h-[50px] bg-black relative border-b border-borders">
                                <div className=" inline-block relative w-fit h-fit rounded-md ml-[13px] top-[8px] px-[6px] py-[6px] text-text_2 hover:text-white cursor-pointer text-[14px] transition select-none">
                                    {currentLang}
                                </div>
                            </div>
                            <ReactCodeMirror
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
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div
                            id="console"
                            className="flex justify-end items-center bg-black w-full h-[50px] rounded-lg overflow-hidden border border-borders"
                        >
                            <div
                                className="w-fit h-fit rounded mr-[11px] px-[20px] py-[4px] hover:bg-green-500 cursor-pointer hover:text-black text-black bg-green-500 text-[14px] active:border-green-800 active:bg-green-800 border-green-500 font-bold right-0 transition select-none"
                                onClick={submitCode}
                            >
                                {isSubmitLoading ? (
                                    <div className="w-full block h-[21px]">
                                        <div className="">
                                            <Loading />
                                        </div>
                                    </div>
                                ) : (
                                    "Submit"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProblemPage;
=======
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
    const [pythonTester, setPythonTester] = useState<PythonTester>();


    const { courseId, sectionId, problemId } = useParams();

    const submitCode = async () => {
        setIsSubmitLoading(true);

        if (!courseId || !sectionId || !problemId) {
            console.log(`the problem for course: ${courseId}, section: ${sectionId}, problem: ${problemId} not found`);
            setIsSubmitLoading(false);
            return;
        }

        if (!problemDescriptionData?.expected_output){
            console.log(`There is no expected output for this problem: ${courseId}:${sectionId}:${problemId}`);
            setIsSubmitLoading(false);
            return;
        }
        const expected_output = problemDescriptionData?.expected_output;

        const problemEvaluationResult = await pythonTester?.assertUsingStdOut(code, expected_output);

        if(problemEvaluationResult) {
            axios.post(
                `${API_URL}/api/problem_new/submit-v2?courseId=${courseId}&sectionId=${sectionId}&problemId=${problemId}`,
                { result: problemEvaluationResult },
                { withCredentials: true },
            )
                .then(({ data }) => {
                    if (data == "Accepted") {
                        setIsSolved(true)
                    }
                    // mark problem as solved, and allow moving to the other person
                    console.log("LETS GOOOOO EBAT")
                    alert("Problem solved!");
                    setIsSubmitLoading(false);
                })
                .catch((err) => {
                    setIsSubmitLoading(false);
                });
        } else {
            if (problemEvaluationResult === null){
                alert('Failed to evaluate!')
            } else{
                alert(`Wrong output! Expected Output:${expected_output}`);
            }
            setIsSubmitLoading(false);
        }
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

        const setupPythonTester = async () => {
            try {
                setPythonTester(new PythonTester());
            } catch(error) {
                console.error('Failed to run Python', error);
            }
        }

        setupPythonTester();
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
>>>>>>> Stashed changes
