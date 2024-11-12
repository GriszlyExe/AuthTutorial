import { LoginButton } from "@/components/auth/login_button";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-neutral-500">
      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-white drop-shadow-md">
          Auth
        </h1>
        <LoginButton>
          <Button variant='secondary' size='lg'>
            login
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}
