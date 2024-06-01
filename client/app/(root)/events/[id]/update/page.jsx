import EventForm from "@/components/shared/EventForm";
import { useRouter } from "next/navigation";

const UpdateEvent = async ({ params: { id }, currentUser }) => {
    // const { sessionClaims } = auth();

    const userId = "5f5b689c8f3dbc1de053d5u1";
    const event = JSON.parse(JSON.stringify(getEventById));

    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <h3 className='wrapper h3-bold text-center sm:text-left'>Update Event</h3>
            </section>

            <div className='wrapper my-8'>
                <EventForm type='Update' event={event} eventId={event._id} userId={userId} />
            </div>
        </>
    );
};

export default UpdateEvent;
