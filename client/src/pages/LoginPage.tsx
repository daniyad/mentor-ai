import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';


// LoginPage component handles the user login process
// It includes form inputs for username/email and password, and a login button
// On successful login, it sets the user token and id, and navigates to the problem set page
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {isLoggedIn, setIsLoggedIn} = useAuth()

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        setIsLoggedIn(true);
        navigate("/")
        // Handle further logic here, e.g., redirecting the user or calling your backend with the token
    };

    const handleError = () => {
        console.error('Login failed!');
        // Handle errors here, such as showing an alert or updating the UI appropriately
    };

    useEffect(() => {
      if (isLoggedIn) {
        navigate("/")
      }  
    })

    const navigate = useNavigate();
    const isFormFilled = email.length > 0 && password.length > 0;

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/login-locally`, {
                username: email,
                password: password,
            }, {withCredentials: true});
            
            const data = response.data;
            if (data.success === false) {
                setMessage(data.message);
                setIsLoading(false);
                return;
            }
            setIsLoggedIn(true)
            navigate("/");
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                setMessage(error.response.data.message);
            } else {
                console.error("Login failed:", error);
            }
            setIsLoggedIn(false)
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        navigate("/");
    };

    // Login form layout with conditional rendering for loading state and error messages
    return (
        <>
            <Navbar/>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="relative bg-[#1A1A1A] rounded-lg p-8 max-w-md m-4 w-full">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <h2 className="text-white text-left text-2xl font-bold mb-2"> Log In </h2>
                    <p className="text-white text-left text-sm mb-6"> By continuing, you agree to our
                        <Link to="/user-agreement" className="text-blue-500 no-underline"> User Agreement </Link>
                        and acknowledge that you understand the
                        <Link to="/privacy-policy" className="text-blue-500 no-underline"> Privacy Policy</Link>.
                    </p>
                    <input
                        className="bg-[#2A2A2A] text-white rounded-full border border-[#2A2A2A] mb-4 px-5 py-3 w-full"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="bg-[#2A2A2A] text-white rounded-full border border-[#2A2A2A] mb-4 px-5 py-3 w-full"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                    <button
                        className={`w-full rounded-full py-3 font-bold text-white transition-colors ${isFormFilled ? 'bg-orange-600 hover:bg-orange-700' : 'bg-[#2A2A2A] cursor-not-allowed'}`}
                        type="button"
                        onClick={handleLogin}
                        disabled={!isFormFilled}
                    >
                        {isLoading ? <Loading /> : 'Login'}
                    </button>
                    {message && (
                        <div className="text-red-600 text-center mt-4">
                            {message}
                        </div>
                    )}
                    <div className="text-left mt-4 text-sm">
                        <span className="text-white">
                            New to Mentor.ai?
                        </span>{' '}
                        <Link to="/signup" className="text-blue-500 no-underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;