import React, { SetStateAction, useEffect, useRef } from "react";
import { useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import axios, { AxiosError, AxiosResponse } from "axios";
import ProblemNavbar from "../components/ProblemNavbar";
import ProblemDescription from "../components/ProblemDescription";
import Chat from "../components/Chat";
import { useNavigate, useParams } from "react-router-dom";
import Editorial from "../components/Editorial";
import MainHeading from "../components/MainHeading";
import Submissions from "../components/Submissions";
import HintDisplay from "../components/HintDisplay";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import { HStack, VStack, Card, CardBody, Button, Text } from "@chakra-ui/react";
import { DescriptionData, Submission, Hint, HintResponse, Message, Option, ProblemDescriptionData } from '../types/general';

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
                    nodeId: currentNodeId,
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
    }, [currentNodeId, courseId, sectionId, problemId]);

    const handleOptionClick = async (option: Option) => {
        try {
            const response = await axios.post(`${API_URL}/api/mentor/conversation/next`, {
                problemId: 'hello-world',
                nodeId: option,
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
            <HStack spacing={2}>
                <VStack>
                    <Card>
                        <CardBody>
                            {messages.map((message, index) => (
                                <Text key={index}>{message.role} : {message.text}</Text>
                            ))}
                            {options.map((option, index) => (
                                <Button key={index} onClick={() => handleOptionClick(option)}>{option.userQuestionText}</Button>
                            ))}
                        </CardBody>
                    </Card>
                </VStack>
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
                    width="50%"
                    height="100%"
                />
            </HStack>
        </>
        /**<>
            <MainHeading
                data={{
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
                            {
                                activeNavOption == "hint" &&
                                (
                                    <HintDisplay data = {{ hint: hintData, is_hint_loading: isHintLoading, is_hint_requested: isHintRequested }} />
                                )
                            }
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
                                width="50%"
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
                            <div
                                className="w-fit h-fit rounded mr-[11px] px-[20px] py-[4px] hover:bg-green-500 cursor-pointer hover:text-black text-black bg-green-500 text-[14px] active:border-green-800 active:bg-green-800 border-green-500 font-bold right-0 transition select-none"
                                onClick={requestHint}
                            >
                                {isHintLoading ? (
                                    <div className="w-full block h-[21px]">
                                        <div className="">
                                            <Loading />
                                        </div>
                                    </div>
                                ) : (
                                    "Request Hint"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>**/
    );
};

export default ProblemPage;
