"use client";

import EventForm from "@/components/shared/EventForm";
import { useRouter } from "next/navigation";

const CreateEvent = ({ currentUser }) => {
    // TODO - Authenticate user

    // TODO - Fetch user
    const userId = "fetch user";
    const router = useRouter();
    if (!currentUser) {
        router.push("/signin");
    }
    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <h3 className='wrapper h3-bold text-center sm:text-left'>Create Event</h3>
            </section>

            <div className='wrapper my-8'>
                <EventForm userId={userId} type='Create' />
            </div>
        </>
    );
};

export default CreateEvent;
