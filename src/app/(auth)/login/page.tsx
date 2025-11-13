import { LoginForm } from "@/features/auth/login-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async()=>{
    await requireUnAuth();
    return(
        <div className="">
           <LoginForm />
        </div>
    );
}

export default Page;