"use client"

import { useCurrentUser } from "@/hook/use-current-user"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { FaUser } from "react-icons/fa"
import { LogoutButton } from "./logout-button"
import { ExitIcon } from "@radix-ui/react-icons"

export const UserButton = () =>{

    const user = useCurrentUser()
    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""}/>
                    <AvatarFallback className="bg-pink-400">
                        <FaUser className=""/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="end">
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="w-4 h-4 mr-2"/>
                            Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}