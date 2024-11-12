const DashBoardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex flex-col gap-y-4">
            <nav className="bg-black text-white">
                This is shared Nav.
            </nav>
            {children}
        </div>
    );
}

export default DashBoardLayout