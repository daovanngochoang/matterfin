


const Layout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div className="flex justify-center">
      <div className="flex w-2/3 px-16 items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default Layout

