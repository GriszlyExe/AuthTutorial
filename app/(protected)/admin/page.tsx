"use client"

import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserInfo } from "@/components/user-info";
import { useCurrentRole, useCurrentUser } from "@/hook/use-current-user";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";


const AdminPage = () => {
    const role = useCurrentUser()?.role;

    const testApiRoute = () =>{
        fetch("/api/admin")
        .then((res) =>{
            if(res.ok){
                toast.success("Allowed API Router");
            }else{
                toast.error("Forbidden API Route");
            }
        })
    }
    
    // const user = await currentUser();
  return (
    <Card className="w-[600px]">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">
                ADMIN
            </p>
        </CardHeader>
        <CardContent className='space-y-4'>
            <RoleGate allowedRole={UserRole.ADMIN}>
                <FormSuccess message="You are in"/>
            </RoleGate>
            <div className="flex flex-row  items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">
                    Admin API Route Test
                </p>
                <Button onClick={testApiRoute}>
                    TEST
                </Button>
            </div>
            <div className="flex flex-row  items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">
                    Admin Server Test
                </p>
                <Button>
                    TEST
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default AdminPage