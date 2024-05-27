import axios, { AxiosError } from "axios";
import { API_URL } from "../App";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeading from "../components/MainHeading";
import { useAuth } from "../AuthContext";
import LockedOut from "../components/LockedOut";
import { Box, Image, HStack, VStack, Text } from "@chakra-ui/react";
import { FiLock } from 'react-icons/fi';


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

type AchievedAwardsCounts = {
    firstAward: boolean,
    secondAward: boolean,
    thirdAward: boolean,
}

const ProfilePage = () => {
    const { isLoggedIn } = useAuth(); // Fetches isLoggedIn status
    const [achievedAwards, setAchievedAwards] = useState<AchievedAwardsCounts>({
        firstAward: false,
        secondAward: false,
        thirdAward: false,
    })
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
        if (!isLoggedIn) {
            return;
        }
        // Fetch profile details
        axios.get(`${API_URL}/api/profile/achievements`, { withCredentials: true })
            .then(({ data }) => {
                setSolvedCounts(data.solvedCounts);
                setAchievedAwards({
                    firstAward: data.awards.some((award: { name: string; }) => award.name === 'First Award'),
                    secondAward: data.awards.some((award: { name: string; }) => award.name === 'Second Award'),
                    thirdAward: data.awards.some((award: { name: string; }) => award.name === 'Third Award'),
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return <LockedOut />
    }

    return (
        <div>
            <MainHeading data={{ status: "logged-in" }}></MainHeading>
            <div className="profile-stats">
                <div className="w-[calc(100%-72px)] min-h-[260px] sm:min-h-[160px] bg-black mx-auto mt-[8px] rounded-lg border border-borders">
                    <HStack justifyContent="space-between">
                        <VStack alignItems="flex-start">
                            <div className="text-[22px] font-bold mt-[40px] text-white ml-[50px]">
                                Your Awards
                            </div>
                            <div className="text-[72px] font-bold mt-[32px] text-white ml-[50px]">
                                {Object.values(achievedAwards).reduce((total, award) => award ? total + 1 : total, 0)}{" "}
                                <span className="text-text_2 text-[14px]">
                                    {"/ "}
                                    3
                                </span>
                            </div>
                        </VStack>
                        <HStack marginRight="50px">
                            <Box width="150px" height="150px" marginTop="40px" border="1px" borderColor="borders" marginLeft="20px" position="relative" borderRadius="lg" overflow="hidden" display="flex" justifyContent="center" alignItems="center">
                                {achievedAwards.firstAward ? (
                                    <Image src="/award-1.webp" alt="Award 1" objectFit="cover" />
                                ) : (
                                    <FiLock size={50} />
                                )}
                            </Box>
                            <Box width="150px" height="150px" marginTop="40px" border="1px" borderColor="borders" marginLeft="20px" position="relative" borderRadius="lg" overflow="hidden" display="flex" justifyContent="center" alignItems="center">
                                {achievedAwards.secondAward ? (
                                    <Image src="/award-2.webp" alt="Award 2" objectFit="cover" />
                                ) : (
                                    <FiLock size={50} />
                                )}
                            </Box>
                            <Box width="150px" height="150px" marginTop="40px" border="1px" borderColor="borders" marginLeft="20px" position="relative" borderRadius="lg" overflow="hidden" display="flex" justifyContent="center" alignItems="center">
                                {achievedAwards.thirdAward ? (
                                    <Image src="/award-3.webp" alt="Award 3" objectFit="cover" />
                                ) : (
                                    <FiLock size={50} />
                                )}
                            </Box>
                        </HStack>
                    </HStack>
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
                                    {`.easy-line::after { width: ${((solvedCounts.easySolved || 0) / (solvedCounts.easyTotal || 1)) *
                                        100
                                        }%; }`}
                                    {`.medium-line::after { width: ${((solvedCounts.mediumSolved || 0) / (solvedCounts.mediumTotal || 1)) *
                                        100
                                        }%; }`}
                                    {`.hard-line::after { width: ${((solvedCounts.hardSolved || 0) / (solvedCounts.hardTotal || 1)) *
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
