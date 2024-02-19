import axios, { AxiosError } from "axios";
import { API_URL } from "../App";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeading from "../components/MainHeading";
import { useAuth } from "../AuthContext";

// Define the type for your solvedCounts state to ensure TypeScript knows the shape of the object.
type SolvedCounts = {
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSolved: number;
    easyTotal: number;
    mediumTotal: number;
    hardTotal: number;
    total: number,
    [key: string]: number; // Add this line
};

const ProfilePage = () => {
    const isLoggedIn = useAuth()
    const [username, setUsername] = useState<string>('ZHOPA');
    const [solvedCounts, setSolvedCounts] = useState<SolvedCounts>({
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalSolved: 0,
        easyTotal: 0,
        mediumTotal: 0,
        hardTotal: 0,
        total: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn)
        if (!isLoggedIn) {
            navigate('/'); // Redirect to landing page if not logged in
            return;
        }

        // Fetch profile details
        axios.get(`${API_URL}/api/profile/details`, { withCredentials: true })
            .then(({ data }) => {
                console.log(data)
                setUsername(data.name);
                setSolvedCounts(data.solvedCounts);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [isLoggedIn, navigate]);


    return (
        <div>
            <MainHeading data = {{username: username, status: "loggedin"}}></MainHeading>
            <div className="profile-stats">
                {/* Profile, Community Stats and Solved Problems components */}
                <div className="w-[calc(100%-72px)] h-[260px] sm:h-[160px] bg-black mx-auto mt-[8px] rounded-lg border border-borders">
                        <div className="flex flex-col sm:flex-row h-fit">
                            <div className="flex flex-col w-[280px] text-center sm:text-left mx-auto sm:ml-0">
                                <div className="text-[28px] font-bold mt-[20px] sm:mt-[40px] text-white sm:ml-[30px] ml-0">
                                    {username}
                                </div>
                            </div>
                            <div className="md:flex hidden flex-row absolute right-[90px]">
                                <div className="w-[80px] h-[80px] mt-[40px] border border-borders ml-[20px] rounded-lg relative">
                                    <i className="bi bi-x-lg text-borders absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></i>
                                </div>
                                <div className="w-[80px] h-[80px] mt-[40px] border border-borders ml-[20px] rounded-lg relative">
                                    <i className="bi bi-x-lg text-borders absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></i>
                                </div>
                                <div className="w-[80px] h-[80px] mt-[40px] border border-borders ml-[20px] rounded-lg relative">
                                    <i className="bi bi-x-lg text-borders absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[calc(100%-72px)] min-h-[260px] sm:min-h-[160px] bg-black mx-auto mt-[8px] rounded-lg border border-borders">
                            <div className="flex sm:flex-row flex-col justify-between">
                                <div>
                                    <div className="text-[22px] font-bold mt-[40px] text-white ml-[50px]">
                                        Solved Problems
                                    </div>
                                    <div className="text-[72px] font-bold mt-[32px] text-white ml-[50px]">
                                        {solvedCounts.totalSolved}{" "}
                                        <span className="text-text_2 text-[14px]">
                                            {"/ "}
                                            {solvedCounts.total}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col relative mr-[50px] mt-[40px] w-[200px] sm:w-[280px] ml-[50px] sm:ml-0">
                                    <div className="text-[14px] relative">
                                        <div className="flex flex-row justify-between">
                                            <div className="mb-[8px] text-green-500">
                                                Easy
                                            </div>
                                            <div className="mb-[8px] text-green-500">
                                                {solvedCounts.easySolved}
                                                {" / "}
                                                {solvedCounts.easyTotal}
                                            </div>
                                        </div>
                                        <div
                                            className={`sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute easy-line after:h-[8px] after:rounded rounded  after:bg-green-500`}
                                        ></div>
                                    </div>
                                    <div className="text-[14px] relative">
                                        <div className="flex flex-row justify-between">
                                            <div className="mb-[8px] text-orange-500">
                                                Medium
                                            </div>
                                            <div className="mb-[8px] text-orange-500">
                                                {solvedCounts.mediumSolved}
                                                {" / "}
                                                {solvedCounts.mediumTotal}
                                            </div>
                                        </div>
                                        <div
                                            className={`sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute medium-line after:h-[8px] after:rounded rounded after:bg-orange-500`}
                                        ></div>
                                    </div>
                                    <div className="text-[14px] relative">
                                        <div className="flex flex-row justify-between">
                                            <div className="mb-[8px] text-red-600">
                                                Hard
                                            </div>
                                            <div className="mb-[8px] text-red-600">
                                                {solvedCounts.hardSolved}
                                                {" / "}
                                                {solvedCounts.hardTotal}
                                            </div>
                                        </div>
                                        <div
                                            className={`sm:w-[280px] w-[200px] h-[8px] bg-borders mb-[16px] relative after:absolute hard-line after:h-[8px] after:rounded rounded after:bg-red-500`}
                                        ></div>
                                        <style>
                                            {`.easy-line::after { width: ${
                                                ((solvedCounts.easySolved || 0) / (solvedCounts.easyTotal || 1)) *
                                                100
                                            }%; }`}
                                            {`.medium-line::after { width: ${
                                                ((solvedCounts.mediumSolved || 0) / (solvedCounts.mediumTotal || 1)) *
                                                100
                                            }%; }`}
                                            {`.hard-line::after { width: ${
                                                ((solvedCounts.hardSolved || 0) / (solvedCounts.hardTotal || 1)) *
                                                100
                                            }%; }`}
                                        </style>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    );
};

export default ProfilePage;
