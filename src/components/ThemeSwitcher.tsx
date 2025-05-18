import {ThemeStore} from "../Icon/ThemeStore.tsx";
import ThemeListElement from "./ThemeListElement.tsx";

function ThemeSwitcher() {
    return (
        <div className="dropdown no-drag">
            <div tabIndex={0} role="button" className="btn btn-circle btn-ghost"><ThemeStore/></div>
            <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
                <li><ThemeListElement label="Darcula" themeName="darcula"/></li>
                <li><ThemeListElement label="Nord" themeName="nord"/></li>
                <li><ThemeListElement label="Acid" themeName="acid"/></li>
                <li><ThemeListElement label="Lofi" themeName="lofi"/></li>
                <li><ThemeListElement label="Forest" themeName="forest"/></li>
                <li><ThemeListElement label="Cyberpunk" themeName="cyberpunk"/></li>
            </ul>
        </div>
    );
}

export default ThemeSwitcher;