"use client";

import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import axios from "axios";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
    // const [currentUser, setcurrentUser] = useState(null);
    // useEffect(() => {
    //     (async () => {
    //         const { currentUser } = await getCurrentUser();
    //         setcurrentUser(currentUser);
    //     })();
    // }, []);
    return (
        <SessionProvider session={pageProp.session}>
            <div className='flex h-screen flex-col'>
                <Header currentUser={currentUser} />
                <main className='flex-1'>{children}</main>
                <Footer />
            </div>
        </SessionProvider>
    );
}

async function getCurrentUser() {
    try {
        const response = await axios.get("/api/users/currentUser");
        const { currentUser } = response.data;
        return { currentUser, error: null };
    } catch (e) {
        return { currentUser: null, error: e };
    }
}
