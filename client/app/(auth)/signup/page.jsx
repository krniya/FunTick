"use client";

import * as z from "zod";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function CreateAccount() {
    const router = useRouter();
    const formSchema = z.object({
        name: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
            .regex(/\d/, { message: "Password must contain at least one digit" }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values) {
        const name = values.name.trim().split(" ");
        const firstName = name[0];
        const lastName = name.slice(1).join(" ");
        const email = values.email;
        const password = values.password;
        try {
            const res = await axios.post("/api/users/signup", {
                firstName,
                lastName,
                email,
                password,
            });
            console.log("🚀 ~ file: page.tsx:65 ~ onSubmit ~ res:", res);

            if (res.status === 201) {
                form.reset();
                router.push(`/`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='grid gap-4'>
            <Card className='space-y-2'>
                <CardHeader className='space-y-1 flex justify-center items-center'>
                    <Link href='/'>
                        <Image
                            src='/assets/images/logo.png'
                            width={60}
                            height={60}
                            alt='Evently logo'
                        />
                    </Link>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl flex items-center justify-center'>
                        Create an account
                    </CardTitle>
                    <CardDescription>Use Github or Google to create your account</CardDescription>
                </CardHeader>
                <CardContent className='grid gap-2'>
                    <div className='grid grid-cols-2 gap-6'>
                        <Button variant='outline'>
                            <Icons.gitHub className='mr-2 h-4 w-4' />
                            Github
                        </Button>
                        <Button variant='outline'>
                            <Icons.google className='mr-2 h-4 w-4' />
                            Google
                        </Button>
                    </div>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-card px-2 text-muted-foreground'>
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='John Doe' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder='me@functick.com' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='********'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className='w-full green-button' type='submit'>
                                Submit
                            </Button>
                        </form>
                    </Form>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-card px-2 text-muted-foreground'>
                                Already have an account, login
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push("/signin")} className='w-full'>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
