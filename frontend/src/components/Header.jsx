import { Link } from "react-router-dom"

export default function Header() {
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

                {/* Community */}
                <Link to={"/community"}>
                    <li>Community</li>
                </Link>

                {/* Sign In */}
                <Link to={"/sign-in"}>
                    <li>Sign In</li>    
                </Link>
            </ul>
        </div>
    </div>
  )
}
