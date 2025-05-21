import {useXTerm} from "react-xtermjs";
import * as React from "react";

function Terminal() {
    const {instance, ref} = useXTerm()
    instance?.writeln("Hello One Framework!")
    instance?.onData((data) => instance?.write(data))
    return (
        <div className="card-body m-0 p-0">
            <div className="collapse">
                <input type="checkbox"/>
                <h2 className="collapse-title card-title">虚拟串口</h2>
                <div className="collapse-content m-0" ref={ref as React.RefObject<HTMLDivElement>}
                     style={{width: '100%', height: '100%'}}></div>
            </div>
        </div>
    );
}

export default Terminal;