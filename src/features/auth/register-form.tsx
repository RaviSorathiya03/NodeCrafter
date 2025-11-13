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

const registerSchema = z.object({
    email: z.email("Please enter the valid email"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
    name: z.string().min(1, "Name is required")
})
.refine((data)=> data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm(){
    const router = useRouter();
    const form  = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues:{
            email: "",
            password: "",
            confirmPassword: "",
            name: ""
        }
    });

    const onSubmit = async(value: RegisterFormValues)=>{
        await authClient.signUp.email({
            name: value.name,
            email: value.email,
            password: value.password,
            callbackURL: "/"
        },
        {
            onSuccess: ()=>{
                router.push("/");
            },
            onError: (ctx) =>{
                toast.error(ctx.error.message || "Something went wrong");
            }
        }
    )
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col">
         <Card className="p-6">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
                <CardDescription>
                    Create your account to continue
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="flex flex-col gap-4">
                            <Button
                                variant={"outline"}
                                className="w-full"
                                type="button"
                                disabled={isPending}
                            >   
                                 <Image src="/github.svg" alt="github logo" width={20} height={20}/> 
                                Continue with Github
                            </Button>
                            <Button
                                variant={"outline"}
                                className="w-full"
                                type="button"
                                disabled={isPending}
                            >  
                                 <Image src="/google.svg" alt="google logo" width={20} height={20}/>  
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
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="text"
                                                placeholder="Enter your Name"
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
                             <FormField 
                                control={form.control}
                                name="confirmPassword"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
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
                                Signup
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            Already have an account? {" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
         </Card>
        </div>
    );

}