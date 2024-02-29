import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import { useAuth } from "../AuthContext";
import { CourseHeader } from "../components/CourseHeader"
import { CourseMeta } from "../components/CourseMeta";
import Syllabus from "../components/Syllabus";
import { CourseDescription } from "../components/CourseDescription";
import MainHeading from "../components/MainHeading";
import { CircularProgress } from '@chakra-ui/react'

const CoursePage = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [courseData, setCourseData] = useState<CourseData>()
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }
    
        const fetchData = async () => {
            setIsLoading(true);
            // Fetch profile details
            try {
                const profileResponse = await axios.get(`${API_URL}/api/profile/details`, { withCredentials: true });
                setUsername(profileResponse.data.username);
            } catch (e) {
                console.log(e);
                window.location.reload();
            }
            // Fetch problem list
            try {
                const courseData = await axios.get(`${API_URL}/api/problem_new/course/?courseId=1`,
                    { withCredentials: true }
                );
                console.log(courseData);
                setCourseData(courseData.data);
                setIsLoading(false);
            } catch (e) {
                // Handle error if necessary
                console.log(e);
                navigate("/");
                window.location.reload();
            }
        };
        fetchData();
    }, [isLoggedIn, navigate]);
    
    if (isLoading) {
        return <CircularProgress isIndeterminate color='orange.300' />;
    }

    return (
        <div className="course-page">
            <MainHeading
                data={{
                    username: username,
                    status: "loggedin",
                }}/>
            <CourseHeader
                title={courseData?.title!!}
                course_description={"Learn the basics of Python 3, of the most powerful, versatile programming languages today."}
            />
            <CourseMeta
                level="Beginner"
                timeToComplete="25 hours"
                prerequisites="None"
            />
            <CourseDescription
                description={courseData?.description!!}
                skills={courseData?.skills!!}
            />
            <Syllabus sections={courseData?.sections!!} />
        </div>
    );
}

export default CoursePage;