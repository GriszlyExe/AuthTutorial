"use client"

import { useForm } from "react-hook-form"
import { CardWrapper } from "./card-wrapper"

import * as z from 'zod'
import { ResetSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { login, resetPassword } from "@/action/action"
import { useActionState, useState, useTransition } from "react"

export const ResetForm = () =>{

    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();

    // const [errorMessage,formAction] = useActionState(login, undefined);

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues:{
            email: "",
        }
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        console.log(values);
        setError("")
        setSuccess("")
        startTransition(() =>{
            resetPassword(values)
            .then((data) =>{
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
        
    }
    return(
        <CardWrapper 
            headerLabel="Forget your password?"
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
                        name='email'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    disabled = {isPending}
                                    placeholder="ABC@email.com"
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
                        send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}