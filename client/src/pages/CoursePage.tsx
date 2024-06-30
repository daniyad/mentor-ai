import { useEffect, useState } from "react";
import axios  from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import { useAuth } from "../AuthContext";
import { CourseHeader } from "../components/CourseHeader"
import { CourseMeta } from "../components/CourseMeta";
import Syllabus from "../components/Syllabus";
import { CourseDescription } from "../components/CourseDescription";
import MainHeading from "../components/MainHeading";
import { CircularProgress } from '@chakra-ui/react';
import { CourseData } from "../types/general";
import LockedOut from "../components/LockedOut";

const CoursePage = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState<CourseData>()
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn) {
                return
            }

            setIsLoading(true);
            try {
                const courseData = await axios.get(`${API_URL}/api/problem_new/course/?courseId=1`,
                    { withCredentials: true }
                );
                setCourseData(courseData.data);
                setIsLoading(false);
            } catch (e) {
                // Handle error if necessary
                console.log(e);
                navigate("/error");
            }
        };
        fetchData();
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return <LockedOut/>
    }

    if (isLoading) {
        return <CircularProgress isIndeterminate color='orange.300' />;
    }


    return (
        <div>
            <MainHeading
                data={{
                    status: "logged-in",
                }} />
            <div className="mx-auto max-w-screen-lg">
                <CourseHeader
                    title={courseData?.title!!}
                    course_description={courseData?.short_description!!}
                />
                <CourseMeta
                    level={courseData?.metadata?.level!!}
                    timeToComplete={courseData?.metadata?.timeToComplete!!}
                    prerequisites={courseData?.metadata?.prerequisites!!}
                />
                <CourseDescription
                    description={courseData?.description!!}
                    skills={courseData?.skills!!}
                />
                <Syllabus sections={courseData?.sections!!} courseId={courseData?.id!!} />
            </div>
        </div>
    );
}

export default CoursePage;
