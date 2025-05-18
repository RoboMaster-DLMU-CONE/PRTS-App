import {ThemeStore} from "../Icon/ThemeStore.tsx";
import {CrossFilled} from "../Icon/CrossFilled.tsx";
import {BaselineMinus} from "../Icon/BaseLineMinus.tsx";
import {
    InterfaceAlignBackBackDesignLayerLayersPileStack
} from "../Icon/InterfaceAlignBackBackDesignLayerLayersPileStack.tsx";
import {getCurrentWindow} from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();


function Navbar() {
    return (
        <div className="m-0 p-0 navbar min-h-5 bg-base-100 shadow-sm drag-region">
            <div className="navbar-start px-2">
                <button className="btn btn-circle btn-ghost">
                    <ThemeStore/>
                </button>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">PRTS</a>
            </div>
            <div className="navbar-end">
                <div className="join">
                    <button className="btn btn-circle btn-ghost" onClick={() => appWindow.minimize()}><BaselineMinus/>
                    </button>
                    <button className="btn btn-circle btn-ghost" onClick={() => appWindow.toggleMaximize()}>
                        <InterfaceAlignBackBackDesignLayerLayersPileStack/>
                    </button>
                    <button className="btn btn-circle btn-ghost" onClick={() => appWindow.close()}><CrossFilled/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;