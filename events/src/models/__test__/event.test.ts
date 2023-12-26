import { Event } from "../event";

it("implements optimistic concurrency control", async () => {
    // * Create an instance of a Event
    const event = Event.build({
        title: "concert",
        price: 5,
        userId: "123",
    });

    // * Save the Event to the database
    await event.save();

    // * fetch the Event twice
    const firstInstance = await Event.findById(event.id);
    const secondInstance = await Event.findById(event.id);

    // * make two separate changes to the Events we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // * save the first fetched Event
    await firstInstance!.save();

    // * save the second fetched Event and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
    const event = Event.build({
        title: "concert",
        price: 20,
        userId: "123",
    });

    await event.save();
    expect(event.version).toEqual(0);
    await event.save();
    expect(event.version).toEqual(1);
    await event.save();
    expect(event.version).toEqual(2);
});
