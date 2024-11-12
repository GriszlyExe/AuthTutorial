"use client"

import { useCurrentUser } from "@/hook/use-current-user";
import { UserRole } from "@prisma/client";
import { Children } from "react";
import { FormError } from "../form-error";

interface RoleGateProps{
    children: React.ReactNode;
    allowedRole: UserRole;
};

export const RoleGate = ({
    children,
    allowedRole
}:RoleGateProps
) =>{
    const role = useCurrentUser()?.role;

    if(role != allowedRole){
        return (<FormError message="You do not have permission!"></FormError>)
    }

    return(
        <>
            {children}
        </>
    )
}