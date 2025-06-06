import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        Finance App
        <div className="flex gap-5">
          <Button>
            <Link href={`signin`}>Sign In</Link>
          </Button>
          <Button>
            <Link href={`/signup`}>Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
