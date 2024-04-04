import SideBar from "@/components/SideBar";
import {Toaster} from "@/components/ui/toaster";


const Layout = ({children,}: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <>
            <div className="flex w-full h-[calc(100vh - 48px)] px-16">
                <SideBar/>
                <div className="flex flex-col w-full">
                    <main className="flex w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:py-5 md:px-10">
                        {children}
                    </main>
                    {/* <Toaster/> */}
                </div>
            </div>
        </>
    )
}

export default Layout
