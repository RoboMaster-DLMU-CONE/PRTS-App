import WindowButtons from "./WindowButtons.tsx";

interface NavbarProps {
    onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <div className="fixed top-0 left-0 w-full m-0 p-0 navbar min-h-5 h-8 bg-base-100 shadow-sm drag-region z-50">
            <div className="navbar-start px-2">
                <button
                    className="btn btn-square btn-ghost btn-xs no-drag"
                    onClick={onMenuClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            <div className="navbar-center text-center">
                <span className="text-sm font-semibold">PRTS</span>
            </div>
            <div className="navbar-end">
                <WindowButtons/>
            </div>
        </div>
    );
}

export default Navbar;