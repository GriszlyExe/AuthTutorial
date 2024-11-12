'use client'

import { logout } from "@/action/action";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hook/use-current-user";
import { useSession } from "next-auth/react";


const SettingsPage = () =>{

    const data = useCurrentUser();
    const onClick = () =>{
        logout()
    };

    return(
        <div>
            {JSON.stringify(data)}
            <br></br>
            <Button onClick={onClick} type="submit">SignOut</Button>
        </div>
    )
}

export default SettingsPage