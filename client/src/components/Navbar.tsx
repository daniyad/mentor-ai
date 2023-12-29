import { Link } from "react-router-dom"

const Navbar = () => {
    return <Link to={"/"}>
        <div
            id="logo-cont"
            className="inline-block relative text-[24px] left-1/2 -translate-x-1/2 font-bold italic mx-auto mt-[12px]"
        >
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 px-[1px]">
                Mentor
            </span>
            <span>Ai</span>
        </div>
    </Link>
}

export default Navbar