"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Checkout from "./Checkout";

const CheckoutButton = ({ event }) => {
    const userId = "5f5b689c8f3dbc1de053d5u1"
    // const hasEventFinished = new Date(event.endDateTime) < new Date();
    const hasEventFinished = new Date(event.endDateTime) < new Date("2020-01-01T15:00:00Z")

    return (
        <div className='flex items-center gap-3'>
            {hasEventFinished ? (
                <p className='p-2 text-red-400'>Sorry, tickets are no longer available.</p>
            ) : (
                <>
                        <Button asChild className='button rounded-full' size='lg'>
                            <Link href='/sign-in'>Get Tickets</Link>
                        </Button>


                        <Checkout event={event} userId={userId} />
                </>
            )}
        </div>
    );
};

export default CheckoutButton;
