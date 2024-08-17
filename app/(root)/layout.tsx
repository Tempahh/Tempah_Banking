import MobileNavBar from "@/components/ui/MobileNavBar";
import SideBar from "@/components/ui/SideBar";
import Image from 'next/image';

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const loggedIn = { firstName: 'Tempah', lastName: 'T' };
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
