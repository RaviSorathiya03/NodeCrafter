import { RegisterForm } from "@/features/auth/register-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async()=>{
    await requireUnAuth();
    return (
        <div>
            <RegisterForm />
        </div>
    );

}

export default Page;