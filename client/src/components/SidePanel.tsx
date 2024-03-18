import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { MdPerson, MdList, MdSettings, MdExitToApp } from 'react-icons/md';
import axios from "axios";
import { API_URL } from "../App";
import { clearCookies } from "../ts/utils/utils";
import { useAuth } from "../AuthContext";

const SidePanelItem = ({
    text,
    to,
    Icon,
}: {
    text: string;
    to: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => {
    return (
        <Link
            to={to}
            className="flex items-center space-x-4 w-full my-2 rounded-md py-2 px-4 text-[14px] font-bold hover:text-white text-gray-400 hover:bg-gray-800 transition-colors"
        >
            <Icon className="text-lg" />
            <span>{text}</span>
        </Link>
    );
};

// SidePanel component
const SidePanel = ({
    displayFn,
    display,
    data,
}: {
    display: boolean;
    displayFn: React.Dispatch<React.SetStateAction<boolean>>;
    data: { username?: string };
}) => {
    const [logoutState, setLogoutState] = useState<boolean>(false);
    const { setIsLoggedIn } = useAuth()
    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            // Make an asynchronous request to the logout endpoint
            await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
            clearCookies(); // Clear cookies upon account deletion
            setIsLoggedIn(false);
            // Navigate to the home page after successful logout
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/");
            window.location.reload();
            // Handle any errors that occur during logout
            // You might want to show an error message to the user or handle specific cases differently
        }
    };

    return (
        <>
            <div
                onClick={() => displayFn(false)}
                className={`w-screen h-screen ${display ? "fixed" : "hidden"} top-0 left-0 z-[80] backdrop-blur-sm `}
            ></div>
            <div
                className={` fixed z-[90] ${display ? "translate-x-[-100%]" : " translate-x-[0]"
                    } left-full top-[-1px] rounded-l-lg bg-[#1A1A1A] h-[calc(100vh+2px)] w-[320px] transition ease-in-out border border-borders border-r-0`}
            >
                <div className="relative h-[100px]">
                    <div className="text-white text-xl p-4 font-bold">
                        {data.username}
                    </div>
                    <button
                        onClick={() => displayFn(false)} // Use displayFn here to close the side panel
                        className="absolute top-4 right-4 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                {/* Use the SidePanelItem for each link */}
                <SidePanelItem
                    text="Your Profile"
                    to={`/profile`}
                    Icon={MdPerson}
                />
                <SidePanelItem text="Problem List" to="/course" Icon={MdList} />
                <SidePanelItem text="Settings" to="/settings" Icon={MdSettings} />
                {/* Logout button */}
                <div
                    onClick={() => setLogoutState(!logoutState)}
                    className="flex items-center space-x-4 mx-auto my-2 rounded-md py-2 px-4 text-[14px] hover:text-white text-gray-400 font-bold hover:bg-orange-500 cursor-pointer transition-colors"
                >
                    <MdExitToApp />
                    <span>Log Out</span>
                </div>

                <ConfirmModal
                    display={logoutState}
                    displayFn={setLogoutState}
                    onOkFn={onLogout}
                    title="Log Out"
                    message={`Are you sure you want to log out?`}
                />
            </div>
        </>
    );
};

export default SidePanel;
