import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";

function Connection() {
    const [serialPorts, setSerialPorts] = useState<Array<String>>([])
    useEffect(() => {
        async function fetchSerialPorts() {
            try {
                const result = await invoke<Array<String>>("get_available_serial_port");
                setSerialPorts(result)
            } catch (error) {
                console.log(error);
                setSerialPorts([]);
            }
        }

        fetchSerialPorts();

    }, []);
    return (
        <div className="card-body">
            <h2 className="card-title">连接</h2>
            <select defaultValue="选择可用串口" className="select">
                <option disabled={true}>{`${serialPorts.length === 0 ? "未找到可用串口" : "选择可用串口"}`}</option>
                {serialPorts.map((el) => <option key={el}>{el}</option>)}
            </select>
        </div>
    );
}

export default Connection;