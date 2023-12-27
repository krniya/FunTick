import { Event } from "../event";

it("implements optimistic concurrency control", async () => {
    // * Create an instance of a Event
    const event = Event.build({
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        imageUrl: "https://example.com/image.jpg",
        startDateTime: new Date("2023-01-01T12:00:00Z"),
        endDateTime: new Date("2023-01-01T15:00:00Z"),
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        category: "5f5b689c8f3dbc1de053d5d5",
        organizer: "5f5b689c8f3dbc1de053d5d5",
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
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        imageUrl: "https://example.com/image.jpg",
        startDateTime: new Date("2023-01-01T12:00:00Z"),
        endDateTime: new Date("2023-01-01T15:00:00Z"),
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        category: "5f5b689c8f3dbc1de053d5d5",
        organizer: "5f5b689c8f3dbc1de053d5d5",
    });

    await event.save();
    expect(event.version).toEqual(0);
    await event.save();
    expect(event.version).toEqual(1);
    await event.save();
    expect(event.version).toEqual(2);
});
