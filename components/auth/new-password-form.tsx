"use client"

import { useForm } from "react-hook-form"
import { CardWrapper } from "./card-wrapper"

import * as z from 'zod'
import { NewPasswordSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { login, newPassword, resetPassword } from "@/action/action"
import { useActionState, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

export const NewPasswordForm = () =>{

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();

    // const [errorMessage,formAction] = useActionState(login, undefined);

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues:{
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        console.log(values);
        setError("")
        setSuccess("")
        startTransition(() =>{
            newPassword(values,token)
            .then((data) =>{
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
        
    }
    return(
        <CardWrapper 
            headerLabel="Enter new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name='password'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>password</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    disabled = {isPending}
                                    placeholder="******"
                                    type="password"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                    disabled = {isPending}
                    type="submit"
                    className="bg-neutral-500"
                    >
                        reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}