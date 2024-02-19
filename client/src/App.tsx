import { useEffect, useState } from "react";
import ProblemPage from "./pages/ProblemPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProblemSet from "./pages/ProblemSet";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import axios from "axios";
import { AuthProvider } from './AuthContext'; // Adjust the import path as necessary

export const TOKEN_STORAGE_KEY = "authToken";
export const ID_STORAGE_KEY = "id";
export const API_URL = "http://localhost:80";

function App() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
    const [id, setId] = useState(localStorage.getItem(ID_STORAGE_KEY));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const changeToken = (string: string) => {
        setToken(string);
    };
    const changeId = (string: string) => {
        setId(string);
    };

    return (
        <AuthProvider>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={<LandingPage/>}
                        />
                        <Route
                            path="/problemset"
                            element={<ProblemSet token={token} id={id} />}
                        />
                        <Route
                            path="/problem/:name/editorial"
                            element={
                                <ProblemPage
                                    data={{ activeNavOption: "editorial" }}
                                    token={token}
                                    id={id}
                                />
                            }
                        />
                        <Route
                            path="/problem/:name/solutions"
                            element={
                                <ProblemPage
                                    data={{ activeNavOption: "solutions" }}
                                    token={token}
                                    id={id}
                                />
                            }
                        />
                        <Route
                            path="/problem/:name/submissions"
                            element={
                                <ProblemPage
                                    data={{ activeNavOption: "submissions" }}
                                    token={token}
                                    id={id}
                                />
                            }
                        />
                        <Route
                            path="/problem/:name/hint"
                            element={
                                <ProblemPage
                                    data={{ activeNavOption: "hint" }}
                                    token={token}
                                    id={id}
                                />
                            }
                        />
                        <Route
                            path="/problem/:name"
                            element={
                                <ProblemPage
                                    data={{ activeNavOption: "description" }}
                                    token={token}
                                    id={id}
                                />
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <SignupPage
                                    Data={{
                                        token: token || "",
                                        setTokenFunction: changeToken,
                                        id: id || "",
                                        setIdFunction: changeId,
                                    }}
                                />
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <LoginPage
                                    userData={{
                                        token: token || "",
                                        setTokenFunction: changeToken,
                                        id: id || "",
                                        setIdFunction: changeId,
                                        setIsLoggedIn: setIsLoggedIn,
                                        isLoggedIn: isLoggedIn,
                                    }}
                                />
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
                            element={<SettingPage token={token} id={id} />}
                        />
                        <Route
                            path="/profile"
                            element={<ProfilePage />}
                        />

                        <Route
                            path="*"
                            element={
                                <ErrorPage
                                    data={{
                                        header: "404",
                                        message: "Page not found.",
                                        links: [
                                            { text: "Main Page", link_path: "/" },
                                            {
                                                text: "Problem List",
                                                link_path: "/problemset",
                                            },
                                        ],
                                    }}
                                />
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthProvider>
    );
}

export default App;
