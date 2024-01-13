"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { UserNav } from "./UserNav";

const Header = ({ currentUser }) => {
    console.log("🚀 ~ Header ~ currentUser:", currentUser);
    return (
        <header className='w-full border-b'>
            <div className='wrapper flex items-center justify-between'>
                <Link href='/' className='w-36'>
                    <Image
                        src='/assets/images/logo.png'
                        width={35}
                        height={35}
                        alt='Evently logo'
                    />
                </Link>
                {currentUser ? (
                    <nav asChild>
                        <nav className='w-full max-w-xs'>
                            <UserNav currentUser={currentUser} />
                        </nav>
                    </nav>
                ) : (
                    <Button asChild className='rounded-full' size='lg'>
                        <Link href='/signin'>Login</Link>
                    </Button>
                )}
            </div>
        </header>
    );
};

export default Header;
