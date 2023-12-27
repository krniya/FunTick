import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { startTransition, useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import axios from "axios";
import { body } from "express-validator";

type DropdownProps = {
    value?: string;
    onChangeHandler?: () => void;
};

interface Category extends Document {
    id: string;
    name: string;
}

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");

    const handleAddCategory = () => {};

    useEffect(() => {
        const getCategories = async () => {
            const categoryList = await axios.get("/api/events/category").body;
            categoryList && setCategories(categoryList as Category[]);
        };
        getCategories();
    }, []);

    return (
        <Select onValueChange={onChangeHandler} defaultValue={value}>
            <SelectTrigger className='select-field'>
                <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
                {categories.length > 0 &&
                    categories.map((category) => (
                        <SelectItem
                            key={category.id}
                            value={category.id}
                            className='select-item p-regular-14'>
                            {category.name}
                        </SelectItem>
                    ))}

                <AlertDialog>
                    <AlertDialogTrigger className='p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500'>
                        Add new category
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-white'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>New Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Input
                                    type='text'
                                    placeholder='Category name'
                                    className='input-field mt-3'
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => startTransition(handleAddCategory)}>
                                Add
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SelectContent>
        </Select>
    );
};

export default Dropdown;
