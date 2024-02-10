import MainHeading from "../components/MainHeading";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_URL } from "../App";
import Loading from "../components/Loading";

const LandingPage = ({
    isLoggedIn
}: {
    token: string | null;
    id: string | null;
    isLoggedIn: boolean,
}) => {
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            setLoading(true);
            axios.get(`${API_URL}/api/profile/details`, { withCredentials: true })
                .then(({ data }) => {
                    setUsername(data.name);
                    setLoading(false); // Data fetched, loading complete
                })
                .catch((error) => {
                    // Handle error, possibly setting loading to false and managing error state
                    setLoading(false);
                });
        }
    }, [isLoggedIn]); // Dependency on isLoggedIn ensures this runs once based on its value

    return (
        <div className="text-[14px] overflow-hidden h-screen">
            {/* Background animations remain outside the conditional rendering to ensure they are always displayed */}
            <div className="w-full h-full absolute top-0 left-0">
                <div className="circle-1-animation absolute top-[6%] left-[55%] -translate-x-1/2 w-[500px] h-[500px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-red-800 opacity-60 z-10"></div>
                <div className="absolute circle-2-animation top-[8%] left-[45%] -translate-x-1/2 w-[500px] h-[500px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-orange-500 opacity-60 z-10"></div>
                <div className="absolute circle-3-animation top-[10%] left-[45%] -translate-x-1/2 w-[400px] h-[300px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-yellow-600 opacity-60 z-10"></div>
                <div className="absolute circle-4-animation top-[10%] left-[50%] -translate-x-1/2 w-[200px] h-[200px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-red-600 opacity-60 z-10"></div>
                <div className="absolute circle-5-animation top-[10%] left-[45%] -translate-x-1/2 w-[400px] h-[400px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-orange-800 opacity-60 z-10"></div>
                <div className="absolute top-[20%] left-[47%] -translate-x-1/2 w-[600px] h-[500px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-orange-600 opacity-60 z-10"></div>
                <div className="absolute circle-7-animation top-[10%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full filter blur-[99px] bg-gradient-to-br from-transparent to-orange-800 opacity-60 z-10"></div>
            </div>

            {loading ? (
                // Show a loading indicator while fetching user details
                <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-[120]">
                    <Loading />
                </div>
            ) : isLoggedIn ? (
                // User is logged in and data has been fetched
                <>
                    <MainHeading
                        data={{
                            username: username,
                            status: "loggedin",
                        }}
                    />
                    <h1 className="absolute text-[38px] md:text-[48px] mx-auto text-center font-bold mt-[100px] z-50 inset-0 top-[100px]">
                        <TypeAnimation
                            sequence={[
                                `Welcome back ${username}!`,
                                2000,
                                `Ready for more challenges, ${username}?`,
                                2000,
                                "Let's dive in!",
                            ]}
                            wrapper="span"
                            cursor={true}
                            style={{
                                fontSize: "1em",
                                display: "inline-block",
                            }}
                        />
                    </h1>
                    <p className="absolute md:w-1/2 w-3/4 text-center mx-auto mt-[50px] z-50 inset-0 md:top-[300px] top-[400px]">
                        Ready to conquer complex challenges? Explore our Problem List now!
                    </p>
                    <div className="absolute md:top-[450px] top-[550px] left-1/2 -translate-x-1/2 z-50">
                        <Link
                            to="/problemset"
                            className="relative ml-[8px] font-bold inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-md text-black text-[18px] hover:bg-red-800"
                        >
                            <div className="w-full h-full bg-black text-white py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700">
                                Problem List
                            </div>
                        </Link>
                    </div>
                </>
            ) : (
                // User is not logged in
                <>
                    <MainHeading
                        data={{
                            status: "not-loggedin",
                        }}
                    />
                    <h1 className="absolute text-[38px] md:text-[48px] mx-auto text-center font-bold mt-[100px] z-50 inset-0 top-[100px]">
                        <TypeAnimation
                            sequence={[
                                "Learn",
                                2000,
                                "Solve",
                                2000,
                                "Explore",
                                2000,
                                "Prepare",
                                2000,
                                "Start Now!",
                                5000,
                            ]}
                            wrapper="span"
                            cursor={true}
                            repeat={Infinity}
                            style={{
                                fontSize: "1em",
                                display: "inline-block",
                            }}
                        />
                    </h1>
                    <p className="absolute md:w-1/2 w-3/4 text-center mx-auto mt-[50px] z-50 inset-0 top-[300px]">
                        Learn Coding with Mentor.ai.
                        Elevate your skills with the best tutor there is and get better every day.
                    </p>
                    <div className="absolute top-[500px] left-1/2 -translate-x-1/2 z-50">
                        <Link
                            to="/signup"
                            className="relative ml-[8px] font-bold inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-md text-black text-[18px] hover:bg-red-800"
                        >
                            <div className="w-full h-full bg-black text-white py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700">
                                Get Started
                            </div>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default LandingPage;
