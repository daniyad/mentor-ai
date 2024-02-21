import React, { useEffect, useState } from "react";
import MainHeading from "../components/MainHeading";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import ConfirmModal from "../components/ConfirmModal";
import { API_URL } from "../App";
import { useAuth } from "../AuthContext";
import { clearCookies } from "../ts/utils/utils";


const SettingPage = () => {
    const [username, setUsername] = useState<string>("");
    const [deleteAccountConfirm, setDeleteAccountConfirm] = useState<boolean>(false);
    const navigate = useNavigate();
    const {isLoggedIn, setIsLoggedIn} = useAuth(); // Fetches isLoggedIn status

    const deleteAccountFn = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/delete-account`, // Adjusted endpoint assuming no ID needed
                {}, // No body data needed for cookie-based session auth
                { withCredentials: true } // Ensures cookies are sent with the request
            );
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

    useEffect(() => {
        console.log(isLoggedIn)
        if (!isLoggedIn) {
            navigate("/");
            return;
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

    return (
        <>
            <MainHeading data={{ username: username || "User" }} />
            <div className="px-[8px]">
                <div className="bg-black border border-borders rounded-lg mx-auto justify-center mt-[8px] max-w-[1000px] h-fit px-6 py-2">
                    <h1 className="setting-title text-red-600">Delete Account</h1>
                    <p className="setting-p">
                        This will delete your account permanently. All data will be lost. There is no going back.
                    </p>
                    <button
                        className="setting-button-red"
                        onClick={() => setDeleteAccountConfirm(true)}
                    >
                        Delete your account
                    </button>
                    <ConfirmModal
                        display={deleteAccountConfirm}
                        displayFn={setDeleteAccountConfirm}
                        onOkFn={deleteAccountFn}
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
