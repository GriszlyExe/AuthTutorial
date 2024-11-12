"use client"

import { useForm } from "react-hook-form"
import { CardWrapper } from "./card-wrapper"

import * as z from 'zod'
import { LoginSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { login } from "@/action/action"
import { useActionState, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export const LoginForm = () =>{
    const searchParams = useSearchParams();
    const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ? "Email is already use" : "";

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();

    // const [errorMessage,formAction] = useActionState(login, undefined);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            email: "",
            password:""
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        console.log(values);
        setError("")
        setSuccess("")
        startTransition(() =>{
            login(values)
            .then((data) =>{
                if(data?.error){
                    form.reset();
                    setError(data.error);
                }

                if(data?.success){
                    form.reset();
                    setSuccess(data.success);
                }

                if(data?.twoFactor){
                    setShowTwoFactor(true)
                }
            })
        })
        
    }
    return(
        <CardWrapper 
            headerLabel="Welcome Back"
            backButtonLabel="Dont Have an account"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <>
                                <FormField
                            control={form.control}
                            name='code'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Two Factor</FormLabel>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        disabled = {isPending}
                                        placeholder="123456"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                            </>)}
                        {!showTwoFactor && (
                            <>
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
                                        <Link className='hover:underline px-0 font-mono' href='/auth/reset'> forgot password?</Link>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </>
                    )}
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button 
                    disabled = {isPending}
                    type="submit"
                    className="bg-neutral-500"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}