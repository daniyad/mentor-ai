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
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');


    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegex.test(email);
    };

    // Email blur handler
    const handleEmailBlur = () => {
        console.log(email)
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        return password.length >= minLength && passwordRegex.test(password);
    };

    // Password change handler
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    // Password blur handler
    const handlePasswordBlur = () => {
        if (!validatePassword(password)) {
            setPasswordError(
                'Password must be at least 8 characters long and contain uppercase, lowercase, and digits.'
            );
        } else {
            setPasswordError('');
        }
    };


    const handleSignUp = () => {
        setisLoading(true);
        try {
            if (password !== confirmPassword) {
                setMessage(
                    "Password and confirm password do not match. Please make sure you enter the same password in both fields."
                );
                return;
            }
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
                    setMessage(
                        (
                            e.response?.data as {
                                success: boolean;
                                message: string;
                            }
                        ).message
                    );
                });
        } catch (error) {
            console.error("Sign-up failed:", error);
        }
    };

    const inputClassName = "bg-[#2A2A2A] text-white rounded-full border border-[#2A2A2A] mb-4 px-5 py-3 w-full";
    const errorInputClassName = "bg-[#2A2A2A] text-white rounded-full border border-red-500 mb-1 px-5 py-3 w-full";

    const handleConfirmPasswordBlur = () => {
        if (password !== confirmPassword) {
            setConfirmPasswordError('Password and confirm password do not match.');
        } else {
            setConfirmPasswordError('');
        }
    };

    return (
        <>
            <Navbar />
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="relative bg-[#1A1A1A] rounded-lg p-8 max-w-md m-4 w-full">
                    <button
                        onClick={() => navigate("/")}
                        className="absolute top-4 right-4 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-900"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    <h2 className="text-white text-left text-2xl font-bold mb-6">Sign Up</h2>

                    {/* Input fields */}
                    <input
                        className={inputClassName}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className={emailError ? errorInputClassName : inputClassName}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        required
                    />
                    {emailError && (
                        <p className="text-red-500 text-sm mt-1 mb-2">{emailError}</p>
                    )}
                    <input
                        className={passwordError ? errorInputClassName : inputClassName}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        required
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-1 mb-2">{passwordError}</p>
                    )}
                    <input
                        className={confirmPasswordError ? errorInputClassName : inputClassName}
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={handleConfirmPasswordBlur} // Add onBlur event handler here
                        required
                    />
                    {confirmPasswordError && (
                        <p className="text-red-500 text-sm mt-1 mb-2">{confirmPasswordError}</p>
                    )}

                    {/* Create Account Button */}
                    <button
                        className={`w-full rounded-full py-3 font-bold text-white transition-colors ${username && email && password && confirmPassword && !confirmPasswordError ? 'bg-orange-600 hover:bg-orange-700' : 'bg-[#2A2A2A] cursor-not-allowed'
                            }`}
                        type="button"
                        onClick={handleSignUp}
                        disabled={!username || !email || !password || !confirmPassword || confirmPasswordError.length > 0}
                    >
                        {isLoading ? <Loading /> : 'Create Account'}
                    </button>

                    {/* Message Display */}
                    {message && <div className="text-red-600 text-center mt-4">{message}</div>}

                    {/* Login Link */}
                    <div className="text-white text-center mt-4 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 no-underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;
