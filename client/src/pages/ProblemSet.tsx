import { useState } from "react";
import CustomNavbar from "../components/CustomNavbar";
import ProblemList from "../components/ProblemList";
import MainHeading from "../components/MainHeading";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import { useAuth } from "../AuthContext";

const ProblemSet = ({
    token,
    id,
}: {
    token: string | null;
    id: string | null;
}) => {
    const {isLoggedIn} = useAuth()
    if (!isLoggedIn) {
        return <div>BYE</div>
    }
    return <div>HELLO</div>
};

export default ProblemSet;
