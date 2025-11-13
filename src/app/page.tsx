import { requireAuth } from "@/lib/auth-utils";

const page = async()=>{
  await requireAuth()
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
     protected server components
    
    </div>
  );
}

export default page;