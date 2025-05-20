import UnitList from "./UnitList.tsx";
import Connection from "./Connection.tsx";
import Terminal from "./Terminal.tsx";

function ToolKit() {
    return (
        <div className="card card-border w-1/5 h-full flex flex-col">
            <UnitList/>
            <div className="divider"/>
            <Connection/>
            <div className="divider"/>
            <Terminal/>
        </div>
    );
}

export default ToolKit;