import MobileNavBar from "@/components/ui/MobileNavBar";
import SideBar from "@/components/ui/SideBar";
import { getLoggedInUser } from "@/lib/ServerActions/user.action";
import { Router } from "lucide-react";
import Image from 'next/image';
import { redirect} from "next/navigation";

export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const loggedIn = await getLoggedInUser();

    if (!loggedIn) redirect('/signin')
    return (
      <main className="flex h-screen w-full font-inter">
        <SideBar user={loggedIn}/>
        <div className="flex size-full flex-col font-inter">
          <div className="root-layout">
            <Image src="/icons/logo.svg" width={34} height={34} alt="Pressmoney Logo"/>
            <div>
              <MobileNavBar user={loggedIn}/>
            </div>
          </div>
          {children}
        </div>
      </main>
    );
}
