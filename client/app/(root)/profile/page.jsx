"use client";

import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventByUser, getOrderByUser } from "@/data/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const ProfilePage = async ({ searchParams, currentUser }) => {
    // const { sessionClaims } = auth();
    const userId = "5f5b689c8f3dbc1de053d5u1";
    const router = useRouter();
    if (!currentUser) {
        router.push("/signin");
    }

    const ordersPage = Number(searchParams?.ordersPage) || 1;
    const eventsPage = Number(searchParams?.eventsPage) || 1;

    const orders = {
        data: JSON.parse(JSON.stringify(getOrderByUser)),
        totalPages: 1,
    };

    const orderedEvents = orders?.data.map((order) => order.event) || [];
    const organizedEvents = {
        data: JSON.parse(JSON.stringify(getEventByUser)),
        totalPages: 1,
    };

    return (
        <>
            {/* My Tickets */}
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
                    <Button asChild size='lg' className='button hidden sm:flex'>
                        <Link href='/#events'>Explore More Events</Link>
                    </Button>
                </div>
            </section>

            <section className='wrapper my-8'>
                <Collection
                    data={orderedEvents}
                    emptyTitle='No event tickets purchased yet'
                    emptyStateSubtext='No worries - plenty of exciting events to explore!'
                    collectionType='My_Tickets'
                    limit={3}
                    page={ordersPage}
                    urlParamName='ordersPage'
                    totalPages={orders?.totalPages}
                />
            </section>

            {/* Events Organized */}
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
                    <Button asChild size='lg' className='button hidden sm:flex'>
                        <Link href='/events/create'>Create New Event</Link>
                    </Button>
                </div>
            </section>

            <section className='wrapper my-8'>
                <Collection
                    data={organizedEvents?.data}
                    emptyTitle='No events have been created yet'
                    emptyStateSubtext='Go create some now'
                    collectionType='Events_Organized'
                    limit={3}
                    page={eventsPage}
                    urlParamName='eventsPage'
                    totalPages={organizedEvents?.totalPages}
                />
            </section>
        </>
    );
};

export default ProfilePage;
