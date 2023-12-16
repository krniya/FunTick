import Link from "next/link";

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
                <nav className='flex items-center gap-4 text-gray-500 font-semibold'>
                    <Link href={href1}>{label1}</Link>
                    <Link href={href2} className='bg-primary text-white px-4 py-2 rounded-full'>
                        {label2}
                    </Link>
                </nav>
            );
        });
    console.log(links);
    return (
        <header className='flex items-center justify-between'>
            <a href={"/"} className='text-primary font-semibold 2xl'>
                FunTick
            </a>
            <nav className='flex items-center gap-8 text-gray-500 font-semibold'>
                <Link href={"/"}>Home</Link>
                <Link href={""}>Menu</Link>
            </nav>
            {links}
        </header>
    );
}
