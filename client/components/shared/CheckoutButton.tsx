"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Checkout from "./Checkout";

interface Event {
    _id: string;
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price: string;
    isFree: boolean;
    url?: string;
    category: { _id: string; name: string };
    organizer: { _id: string; firstName: string; lastName: string };
}

const CheckoutButton = ({ event }: { event: Event }) => {
    const { user } = useUser();
    const userId = user?.publicMetadata.userId as string;
    const hasEventFinished = new Date(event.endDateTime) < new Date();

    return (
        <div className='flex items-center gap-3'>
            {hasEventFinished ? (
                <p className='p-2 text-red-400'>Sorry, tickets are no longer available.</p>
            ) : (
                <>
                    <SignedOut>
                        <Button asChild className='button rounded-full' size='lg'>
                            <Link href='/sign-in'>Get Tickets</Link>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <Checkout event={event} userId={userId} />
                    </SignedIn>
                </>
            )}
        </div>
    );
};

export default CheckoutButton;
