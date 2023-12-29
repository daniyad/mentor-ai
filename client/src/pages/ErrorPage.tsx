import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

interface ErrorPage {
    header: string;
    message?: string;
    links?: Links[];
}

interface Links {
    text: string;
    link_path: string;
}

const ErrorPage = ({ data }: { data: ErrorPage }) => {
    return (
        <>
           <Navbar/>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 text-center ">
                <div className="">
                    <h1 className="text-[34px] font-bold mb-[30px]">
                        {data.header}
                    </h1>
                    <p className="text-text_2 text-[14px] max-w-[350px] mb-[20px]">
                        {data.message}
                    </p>
                    {data.links != undefined &&
                        data.links.length !== 0 &&
                        data.links.map((elem) => (
                            <Link
                                to={elem.link_path}
                                className="text-orange-500 hover:text-red-600 text-[14px] block w-fit mx-auto"
                            >
                                {elem.text}
                            </Link>
                        ))}
                </div>
            </div>
        </>
    );
};

export default ErrorPage;
