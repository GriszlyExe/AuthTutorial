import { logout } from "@/action/action";
import { signOut } from "@/auth";
import { Children } from "react";

interface LogoutButtonProps{
    children?: React.ReactNode;
}

export const LogoutButton = ({
    children
}:LogoutButtonProps) =>{
    const onClick = () =>{
        logout()
    }

    return (
        <span onClick={onClick} className="cursor-pointer bg-pink-400">
            {children}
        </span>
    )
}