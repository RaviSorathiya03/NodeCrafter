import { Button } from "@/components/ui/button";
import { caller } from "@/trpc/server";

const page = async()=>{
  const users = await caller.getusers();
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
     {JSON.stringify(users)}
    </div>
  );
}

export default page;