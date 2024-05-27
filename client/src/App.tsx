import { useEffect, useState } from "react";
import ProblemPage from "./pages/ProblemPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import axios from "axios";
import { AuthProvider, useAuth } from './AuthContext'; // Adjust the import path as necessary
import CoursePage from "./pages/CoursePage";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import CourseCongratulationsPage from "./pages/CourseCongratulationsPage";
import TermsAndConditions from "./pages/TermsAndConditionsPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

export const TOKEN_STORAGE_KEY = "authToken";
export const ID_STORAGE_KEY = "id";
export const API_URL = "http://localhost:80";

const theme = extendTheme({
    styles: {
        global: {
            // Applying styles globally
            body: {
                bg: 'black', // Set background color to black
            },
        },
    },
});

function App() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
    const [id, setId] = useState(localStorage.getItem(ID_STORAGE_KEY));

    const changeToken = (string: string) => {
        setToken(string);
    };
    const changeId = (string: string) => {
        setId(string);
    };

    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <div className="App" style={{ fontFamily: 'menlo' }}>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={<LandingPage />}
                            />
                            <Route
                                path="/problems/:courseId/:sectionId/:problemId"
                                element={<ProblemPage />}
                            />
                            <Route
                                path="/signup"
                                element={
                                    <SignupPage />
                                }
                            />
                            <Route
                                path="/login"
                                element={
                                    <LoginPage />
                                }
                            />
                            <Route
                                path="/sorry"
                                element={
                                    <ErrorPage
                                        data={{
                                            header: "Sorry :(",
                                            message:
                                                "If you already have an account, please log in. If you don't, please sign up.",
                                            links: [
                                                {
                                                    text: "Login",
                                                    link_path: "/login",
                                                },
                                                {
                                                    text: "Signup",
                                                    link_path: "/signup",
                                                },
                                            ],
                                        }}
                                    />
                                }
                            />
                            <Route
                                path="/settings"
                                element={<SettingPage />}
                            />
                            <Route
                                path="/profile"
                                element={<ProfilePage />}
                            />
                            <Route
                                path="/course"
                                element={<CoursePage />}
                            />
                            <Route
                                path="/course-end"
                                element={<CourseCongratulationsPage />}
                            />
                            <Route
                                path="/terms-and-conditions"
                                element={<TermsAndConditionsPage />}
                            />
                            <Route
                                path="/privacy-policy"
                                element={<PrivacyPolicyPage />}
                            />
                            <Route
                                path="/error"
                                element={
                                    <ErrorPage
                                        data={{
                                            header: "404",
                                            message: "Page not found.",
                                            links: [
                                                { text: "Main Page", link_path: "/" }
                                            ],
                                        }}
                                    />
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <ErrorPage
                                        data={{
                                            header: "404",
                                            message: "Page not found.",
                                            links: [
                                                { text: "Main Page", link_path: "/" }
                                            ],
                                        }}
                                    />
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </div>
            </AuthProvider>
        </ChakraProvider>
    );
}

export default App;
