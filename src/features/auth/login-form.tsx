"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form";
import { toast } from "sonner";
import {email, z} from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
    email: z.email("Please enter the valid email"),
    password: z.string().min(1, "Password is required")
})

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm(){
    const router = useRouter();
    const form  = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    });

    const onSubmit = async(value: LoginFormValues)=>{
        await authClient.signIn.email({
            email: value.email,
            password: value.password,
            callbackURL: "/"
        }, {
            onSuccess: ()=>{
                router.push("/");
            },
            onError: (ctx)=>{
                toast.error(ctx.error.message || "Something went wrong");
            }
        },
    )
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6 ">
         <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>
                    Login to continue
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                            <Button
                                variant={"outline"}
                                className="w-full"
                                type="button"
                                disabled={isPending}
                            >   
                                Continue with Github
                            </Button>
                            <Button
                                variant={"outline"}
                                className="w-full"
                                type="button"
                                disabled={isPending}
                            >   
                                Continue with Google
                            </Button>
                        </div>
                        <div className="grid gap-6">
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField 
                                control={form.control}
                                name="password"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password"
                                                placeholder="Enter your Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isPending}>
                                Login
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            Don't have an account? {" "}
                            <Link href="/signup" className="underline underline-offset-4">
                                signup
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
         </Card>
        </div>
    );

}