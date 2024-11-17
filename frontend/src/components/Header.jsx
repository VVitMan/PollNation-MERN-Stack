import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

// Vit Navbar
export default function Header() {
    /* ดึงข้อมูลจาก state ที่เก็บข้อมูล user */
    const { currentUser } = useSelector(state => state.user)

  return (
    <div className="bg-slate-200">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

            {/* PollNation Logo */}
            <Link to={"/"}>
                <h1 className="font-bold">PollNation</h1>
            </Link>
            <ul className="flex gap-4">
                {/* Home */}
                <Link to={"/"}>
                    <li>Home</li>
                </Link>

                {/* Poll */}
                <Link to={"/poll"}>
                    <li>Poll</li>
                </Link>

                {/* Community */}
                <Link to={"/community"}>
                    <li>Community</li>
                </Link>

                {/* Sign In && Profile*/}
                <Link to={"/profile"}>
                    {currentUser ? (<img src={currentUser.profilePicture} alt="profile"
                    className="h-7 w-7 rounded-full object-cover" />) : (<li>Sign In</li>)}
                </Link>
            </ul>
        </div>
    </div>
  )
}
