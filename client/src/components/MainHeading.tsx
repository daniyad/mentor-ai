import { useState } from "react";
import { Link } from "react-router-dom";
import SidePanel from "./SidePanel";
import Notification from "./Notification";
import Navbar from "./Navbar";
import { MdMoreVert } from 'react-icons/md';
import { MdMenu } from 'react-icons/md'; // Importing the hamburger menu icon



interface MainHeadingData {
    username?: string;
    status?: "loggedin" | "not-loggedin" | "none";
}

const MainHeading = ({ data }: { data?: MainHeadingData }) => {
    const [sidePanelState, setSidePanelState] = useState<boolean>(false);
    const [notifDisplayState, setNotifDisplayState] = useState<boolean>(false);

    // Function to render the user interface when logged in
    const renderLoggedInUI = () => (
        <>
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
            {/* Wrap the icon in a div with an onClick handler to toggle sidePanelState */}
            <div
                className="w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[#222]"
                onClick={() => setSidePanelState(!sidePanelState)}
            >
                <MdMenu color="white" size="25px" />
            </div>
            <SidePanel
                displayFn={setSidePanelState}
                display={sidePanelState}
                data={{
                    username: data?.username || "",
                }}
            />
        </>
    );

    // Function to render the login and sign-up links when not logged in
    const renderLoggedOutUI = () => (
        <>
            <Link
                to="/login"
                className="inline-block font-bold py-[6px] px-[16px] bg-black hover:bg-borders border rounded-md border-borders text-white text-[14px]"
            >
                Log In
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
                {data?.status === "loggedin" || data?.status == undefined ? (
                    <div className="fixed flex flex-row right-[36px] items-center h-[60px]">
                        {renderLoggedInUI()}
                    </div>
                ) : data?.status === "not-loggedin" ? (
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
