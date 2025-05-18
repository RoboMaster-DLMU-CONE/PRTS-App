import {BaselineMinus} from "../Icon/BaseLineMinus.tsx";
import {
    InterfaceAlignBackBackDesignLayerLayersPileStack
} from "../Icon/InterfaceAlignBackBackDesignLayerLayersPileStack.tsx";
import {CrossFilled} from "../Icon/CrossFilled.tsx";
import {getCurrentWindow} from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

function WindowButtons() {
    return (
        <div className="join">
            <button className="btn btn-circle btn-ghost" onClick={() => appWindow.minimize()}><BaselineMinus/>
            </button>
            <button className="btn btn-circle btn-ghost" onClick={() => appWindow.toggleMaximize()}>
                <InterfaceAlignBackBackDesignLayerLayersPileStack/>
            </button>
            <button className="btn btn-circle btn-ghost" onClick={() => appWindow.close()}><CrossFilled/>
            </button>
        </div>
    );
}

export default WindowButtons;