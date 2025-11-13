import { LoginForm } from "@/features/auth/login-form";
import { requireUnAuth } from "@/lib/auth-utils";
import Link from "next/link";
import Image from "next/image";

const Page = async()=>{
    await requireUnAuth();
    return(
       <LoginForm />
    );
}

export default Page;