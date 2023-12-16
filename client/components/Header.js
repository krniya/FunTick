import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

function AuthLink({ currentUser }) {
    const greet = `Hi`;
    if (currentUser) {
        return (
            <>
                <nav className='flex items-center gap-4 text-gray-500 font-semibold'>
                    <div>
                        <Link key={uuidv4()} href={"/profile"}>
                            {greet}
                        </Link>
                    </div>
                    <div>
                        <Link
                            key={uuidv4()}
                            href={"/auth/signout"}
                            className='bg-primary text-white px-4 py-2 rounded-full'>
                            Sign Out
                        </Link>
                    </div>
                </nav>
            </>
        );
    } else {
        return (
            <>
                <nav className='flex items-center gap-4 text-gray-500 font-semibold'>
                    <Link key={uuidv4()} href={"/auth/signin"}>
                        SignIn
                    </Link>
                    <Link
                        key={uuidv4()}
                        href={"/auth/signup"}
                        className='bg-primary text-white px-4 py-2 rounded-full'>
                        Register
                    </Link>
                </nav>
            </>
        );
    }
}

export default function Header({ currentUser }) {
    const links = [
        !currentUser && {
            label1: "login",
            label2: "Register",
            href1: "/auth/signin",
            href2: "/auth/signup",
        },
        currentUser && {
            label1: `Hi ${currentUser.name}`,
            label2: "Sign Out",
            href1: "/profile",
            href2: "/auth/signout",
        },
    ]
        .filter((linkConfig) => linkConfig)
        .map(({ label1, label2, href1, href2 }) => {
            return (
                <nav key={uuidv4()} className='flex items-center gap-4 text-gray-500 font-semibold'>
                    <Link key={uuidv4()} href={href1}>
                        {label1}
                    </Link>
                    <Link
                        key={uuidv4()}
                        href={href2}
                        className='bg-primary text-white px-4 py-2 rounded-full'>
                        {label2}
                    </Link>
                </nav>
            );
        });
    return (
        <header key={uuidv4()} className='flex items-center justify-between'>
            <a key={uuidv4()} href={"/"} className='text-primary font-semibold 2xl'>
                FunTick
            </a>
            <nav key={uuidv4()} className='flex items-center gap-8 text-gray-500 font-semibold'>
                <Link key={uuidv4()} href={"/"}>
                    Home
                </Link>
                <Link key={uuidv4()} href={""}>
                    Menu
                </Link>
            </nav>
            {links}
        </header>
    );
}
