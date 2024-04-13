import CreatePaymenRequestProgressBar from "./status-bar";



const Layout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div className="flex justify-center">
      <div className="flex w-2/3 px-16">
        <CreatePaymenRequestProgressBar />
        <div className="flex flex-col w-full">
          <main className="flex w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:py-5 md:px-10">
            {children}
          </main>
          {/* <Toaster/> */}
        </div>
      </div>
    </div>
  )
}

export default Layout

