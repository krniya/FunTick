"use server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "../utils";
import axios from "axios";

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
    try {
        const newCategory = await axios.post("/api/events/category", { name: categoryName });

        return JSON.parse(JSON.stringify(newCategory));
    } catch (error) {
        handleError(error);
    }
};

export const getAllCategories = async () => {
    try {
        const categories = await axios.get("/api/events/category");

        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        handleError(error);
    }
};
