"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

export function UserNav({ currentUser }) {
    const router = useRouter();
    const handleLogout = async () => {
        await axios.post("https://funtick.buy/api/users/signout", {});
        router.push("/");
        window.location.reload();
    };
    const handleProfile = () => {
        router.push("/profile");
    };

    const handleCreateEvent = () => {
        router.push("/events/create");
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src='/assets/images/avatar.jpg' alt='default' />
                        <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>{currentUser.name}</p>
                        <p className='text-xs leading-none text-muted-foreground'>
                            {currentUser.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={handleProfile}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleCreateEvent}>Create Event</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
