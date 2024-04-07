import React, { useEffect, useState } from "react";
import MainHeading from "../components/MainHeading";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import ConfirmModal from "../components/ConfirmModal";
import { API_URL } from "../App";
import { useAuth } from "../AuthContext";
import { clearCookies } from "../ts/utils/utils";
import LockedOut from "../components/LockedOut";


const SettingPage = () => {
    const [username, setUsername] = useState<string>("");
    const [deleteAccountConfirm, setDeleteAccountConfirm] = useState<boolean>(false);
    const [logoutConfirm, setLogoutConfirm] = useState<boolean>(false);

    const navigate = useNavigate();
    const {isLoggedIn, setIsLoggedIn} = useAuth(); // Fetches isLoggedIn status

    const onAccountDeletion = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/delete-account`, {}, { withCredentials: true });
            if (response.data.success) {
                clearCookies(); // Clear cookies upon account deletion
                setIsLoggedIn(false)
                navigate("/");
                window.location.reload()
            }
        } catch (e) {
            console.log(e);
        }
    };

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

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/profile/details`, // Adjusted endpoint for user data
                    { withCredentials: true } // Ensures cookies are sent with the request
                );
                setUsername(response.data.username);
                // Removed the cookie clearing after fetching user data
            } catch (e) {
                console.log(e);
                navigate("/");
            }
        };

        fetchUserData();
    }, [isLoggedIn]); // Depend on isLoggedIn to react to auth state changes

    if (!isLoggedIn) {
        return <LockedOut/>
    }

    return (
        <>
            <MainHeading data={{status: "logged-in"}} />
            <div className="px-[8px]">
                <div className="bg-black rounded-lg mx-auto justify-center mt-[8px] max-w-[1000px] h-fit px-6 py-2">
                <h1 className="text-white">Sign Out</h1>
                    <p className="setting-p text-white">
                        This will sign you out of the current session.
                    </p>
                    <button
                        className="p-2 text-white font-semibold bg-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 border rounded-md border-borders"
                        onClick={() => setLogoutConfirm(true)}
                    >
                        Sign out
                    </button>
                    <ConfirmModal
                        display={logoutConfirm}
                        displayFn={setLogoutConfirm}
                        onOkFn={onLogout}
                        title="Log out out of the current session"
                        message={`Are you sure you want to log out of your account?`}
                    />
                    <hr className="setting-hr" />

                    <h1 className="text-red-600">Delete Account</h1>
                    <p className="setting-p text-white">
                        This will delete your account permanently. All data will be lost. There is no going back.
                    </p>
                    <button
                        className="p-2 text-white font-semibold bg-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-900 border rounded-md border-borders"
                        onClick={() => setDeleteAccountConfirm(true)}
                    >
                        Delete your account
                    </button>
                    <ConfirmModal
                        display={deleteAccountConfirm}
                        displayFn={setDeleteAccountConfirm}
                        onOkFn={onAccountDeletion}
                        title="Delete Account"
                        message={`Are you sure you want to delete your account?`}
                    />
                    <hr className="setting-hr" />
                </div>
            </div>
        </>
    );
};
export default SettingPage;
