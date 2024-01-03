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
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";

export default function CreateAccount() {
    const router = useRouter();
    const formSchema = z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
            .regex(/\d/, { message: "Password must contain at least one digit" }),
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const onClick = (provider) => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
    };
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
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
                        Login
                    </CardTitle>
                    <CardDescription>Use Github or Google to login to your account</CardDescription>
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
                            <Button className='w-full' type='submit'>
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
                                Join us using email
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push("/signup")} className='w-full green-button'>
                        Register
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
