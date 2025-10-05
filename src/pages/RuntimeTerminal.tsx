import {useSettingsStore} from "../stores/useSettingsStore.ts"
import {useEffect} from "react";
import ToolKit from "../components/ToolKit.tsx";

function RuntimeTerminal() {
    const {init} = useSettingsStore();
    useEffect(() => {
        init();
    }, []);
    return (
        <div className="h-full flex">
            <ToolKit/>
        </div>
    );
}

export default RuntimeTerminal;
