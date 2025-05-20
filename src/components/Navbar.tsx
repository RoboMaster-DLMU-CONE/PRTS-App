import WindowButtons from "./WindowButtons.tsx";
import ThemeSwitcher from "./ThemeSwitcher.tsx";


function Navbar() {
    return (
        <div className="fixed top-0 left-0 w-full m-0 p-0 navbar min-h-5 h-8 bg-base-100 shadow-sm drag-region z-50">
            <div className="navbar-start px-2">
                <ThemeSwitcher/>
            </div>
            <div className="navbar-center text-center gap-2">
                <span className="status status-success"/>
                <h1 className="text-xl font-bold font-sans">PRTS</h1>
            </div>
            <div className="navbar-end">
                <WindowButtons/>
            </div>
        </div>
    );
}

export default Navbar;