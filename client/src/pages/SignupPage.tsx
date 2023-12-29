import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

const SignupPage = ({
    Data,
}: {
    Data: {
        token: string;
        setTokenFunction: (string: string) => void;
        id: string;
        setIdFunction: (string: string) => void;
    };
}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setisLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const passwordValidation = () => {
        return !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
    }
    const emailValidation = () => {
        return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
    }

    const confirmPasswordValidation = () => {
        return password != confirmPassword
    }

    const usernameValidation = () => {
        return !/^[a-zA-Z0-9_-]{3,15}$/.test(username)
    }

    const inputValidation = () => {
        if (!username || !password || !confirmPassword || !email) {
            setMessage(
                "Please provide all the require fields."
            )
            return false
        }
        
        if (usernameValidation()) {
            setMessage(
                "Username must be between 3 to 15 characters and can only contain letters, numbers, hyphens, and underscores."
            )
            return false
        }

        if (emailValidation()) {
            setMessage(
                "Please provide a valid email"
            );
            return false
        }
        
        if (passwordValidation()) {
            setMessage(
                "Password must contain at least one letter (uppercase or lowercase) and one digit, and must be at least 8 characters in length."
            );
            return false
        }

        if (confirmPasswordValidation()) {
            setMessage(
                "Password and confirm password do not match. Please make sure you enter the same password in both fields."
            );
            return false
        }
        return true
    }

    const handleFailedRequest = (e: AxiosError) => {
        if (e.response != null && e.response.data != null) {
            setMessage(
                (
                    e.response?.data as {
                        success: boolean;
                        message: string;
                    }
                ).message
            );
        } else {
            setMessage("Failed to send the sign up request. Please try again in a bit")
        }
    }

    const handleSignUp = () => {
        setisLoading(true);
        if (!inputValidation()) {
            return
        }
        try {
            axios
                .post(`${API_URL}/api/accounts/signup`, {
                    username: username,
                    email: email,
                    password: password,
                })
                .then(({ data }) => {
                    Data.setTokenFunction(data.token);
                    Data.setIdFunction(data.id);
                    navigate("/problemset");
                })
                .catch((e: AxiosError) => {
                    setisLoading(false);
                    handleFailedRequest(e)
                });
        } catch (error) {
            console.error("Sign-up failed:", error);
        }
    };
    return (
        <>
            <Navbar/>
            <div className="min-h-fit w-[300px] mx-auto text-[14px]">
                <div className="relative bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-[34px] font-bold mb-[30px] text-center mt-[60px]">
                        Sign Up
                    </h2>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required={true}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={true}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={true}
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="appearance-none border w-full py-2 px-3 placeholder:text-text_2 focus:placeholder:text-orange-500 bg-black rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required={true}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-orange-500 hover:bg-red-600 text-black font-bold py-[6px] px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
                            type="button"
                            onClick={handleSignUp}
                        >
                            {isLoading ? (
                                <div className="w-full block h-[21px]">
                                    <div className="absolute left-1/2 -translate-x-1/2">
                                        <Loading />
                                    </div>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-[20px]">
                        <span className="text-text_2">
                            Already have an account?{" "}
                        </span>
                        <Link
                            to="/login"
                            className="text-orange-500 hover:text-red-600"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="text-center mt-[20px] text-red-600 w-full overflow-hidden">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;
