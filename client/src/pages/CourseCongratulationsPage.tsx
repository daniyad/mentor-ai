import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import { useAuth } from "../AuthContext";
import { CircularProgress } from '@chakra-ui/react';
import LockedOut from "../components/LockedOut";
import CourseCompletionLocked from "../components/CourseCompletionLocked";
import MainHeading from "../components/MainHeading";
import { Text } from "@chakra-ui/react";
import Confetti from "react-dom-confetti";

const CourseCongratulationsPage = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [courseEnd, setCourseEnd] = useState<boolean>(true)
    const [name, setName] = useState<string>("")
    const [courseName, setCourseName] = useState<string>("")
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
    const [confettiActive, setConfettiActive] = useState<boolean>(false);



    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn) {
                return
            }

            setIsLoading(true);
            try {
                const courseEndData = await axios.get(`${API_URL}/api/problem_new/course-end`,
                    { withCredentials: true }
                );
                setCourseEnd(courseEndData.data.hasCompletedCourse);
                setName(courseEndData.data.name);
                setCourseName(courseEndData.data.courseName);
                setIsLoading(false);
                setTimeout(() => {
                    setConfettiActive(true);
                }, 500);
            } catch (e) {
                // Handle error if necessary
                console.log(e);
                navigate("/error");
            }
        };
        fetchData();
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <LockedOut />
    }


    if (isLoading) {
        return <CircularProgress isIndeterminate color='orange.300' />;
    }

    if (!courseEnd) {
        return <CourseCompletionLocked />
    }

    return (
        <div>
            <MainHeading
                data={{
                    status: "logged-in",
                }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '30px'}}>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                    Congratulations for completing the course!
                </Text>
                <Confetti active={confettiActive} config={confettiConfig} />
                <div className="font-mono border-2 border-gray p-5 max-w-4xl mx-auto bg-white mt-5">
                    <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-5">
                        <img src="/path/to/logo.png" alt="Logo" className="h-12" />
                        <div className="text-2xl font-bold">Certificate of Completion</div>
                        <div className="text-sm">{new Date().toLocaleDateString()}</div>
                    </div>
                    <div className="text-center mb-5">
                        <div className="text-lg mb-2">Awarded to</div>
                        <div className="text-4xl font-bold mb-5">{name}</div>
                        <div className="text-2xl font-bold">{courseName}</div>
                    </div>
                    <div className="flex justify-between items-center border-t-2 border-black pt-2 mt-5">
                        <div className="text-center">
                            {/* <img src="/path/to/qr-code.png" alt="QR Code" className="h-12 mb-2" /> */}
                            <div className="text-sm">0987654321</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm mb-1">Team</div>
                            {/* <img src="/path/to/signature.png" alt="Signature" className="h-10 mb-1" /> */}
                            <div className="text-sm">Mentor AI Team</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseCongratulationsPage;
