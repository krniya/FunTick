import request from "supertest";
import { app } from "../../app";

// * Function to create dummy category
const createCategory = (category: string) => {
    return request(app).post("/api/events/category").set("Cookie", global.signin()).send({
        name: category,
    });
};

it("can fetch a list of Categorys", async () => {
    await createCategory("Concert");
    await createCategory("Party");
    await createCategory("MLM");

    const response = await request(app).get("/api/events/category").send().expect(200);
    expect(response.body.length).toEqual(3);
});
