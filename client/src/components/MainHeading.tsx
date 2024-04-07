import { useState } from "react";
import { Link } from "react-router-dom";
import SidePanel from "./SidePanel";
import Notification from "./Notification";
import Navbar from "./Navbar";
import { MdMoreVert } from 'react-icons/md';
import { MdMenu } from 'react-icons/md'; // Importing the hamburger menu icon



interface MainHeadingData {
    status?: "logged-in" | "logged-out";
}

const MainHeading = ({ data }: { data?: MainHeadingData }) => {
    const [notifDisplayState, setNotifDisplayState] = useState<boolean>(false);

    // Function to render the user interface when logged in
    const renderLoggedInUI = () => (
        <>
            <Link
                to="/profile"
                className="inline-block font-bold py-[6px] px-[16px] bg-black text-white text-[14px]  hover:bg-borders">
                Profile
            </Link>
            <Link
                to="/course"
                className="inline-block font-bold py-[6px] px-[16px] bg-black text-white text-[14px]  hover:bg-borders rounded-md">
                Problems
            </Link>
            <Link
                to="/settings"
                className="inline-block font-bold py-[6px] px-[16px] bg-black text-white text-[14px]  hover:bg-borders rounded-md">
                Settings
            </Link>
            <div
                id="notification"
                className="inline-block p-[5px] text-[14px] text-[#808080]"
                onClick={() => setNotifDisplayState(!notifDisplayState)}
            >
                <Notification
                    display={notifDisplayState}
                    displayFn={setNotifDisplayState}
                />
            </div>

        </>
    );

    // Function to render the login and sign-up links when not logged in
    const renderLoggedOutUI = () => (
        <>
            <Link
                to="/profile"
                className="inline-block font-bold py-[6px] px-[16px] bg-black text-white text-[14px]  hover:bg-borders">
                Profile
            </Link>
            <Link
                to="/course"
                className="inline-block font-bold py-[6px] px-[16px] bg-black text-white text-[14px]  hover:bg-borders rounded-md">
                Problems
            </Link>
            <Link
                to="/settings"
                className="inline-block font-bold py-[6px] px-[16px] bg-black text-white text-[14px]  hover:bg-borders rounded-md">
                Settings
            </Link>
            <Link
                to="/login"
                className="inline-block font-bold py-[6px] px-[16px] bg-black hover:bg-borders border rounded-md border-borders text-white text-[14px]"
            >
                Sign In
            </Link>
            <Link
                to="/signup"
                className="ml-[8px] font-bold inline-block py-[6px] px-[16px] bg-gradient-to-r from-orange-500 to-red-600 border rounded-md border-borders text-black text-[14px] hover:bg-red-800"
            >
                Sign Up
            </Link>
        </>
    );

    return (
        <>
            <div className="fixed w-full h-[60px] bg-black border-b border-borders flex flex-row z-[100]">
                <div className="pl-4">
                    <Navbar />
                </div>
                {data?.status === "logged-in" ? (
                    <div className="fixed flex flex-row right-[36px] items-center h-[60px] justify-end space-x-12 pr-4">
                        {renderLoggedInUI()}
                    </div>
                ) : data?.status === "logged-out" ? (
                    <div className="fixed flex flex-row right-[36px] items-center h-[60px]">
                        {renderLoggedOutUI()}
                    </div>
                ) : null}
            </div>
            <div className="h-[60px]"></div> {/* Spacer */}
        </>
    );
};

export default MainHeading;
