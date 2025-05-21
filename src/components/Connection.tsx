// `src/components/Connection.tsx`
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";

function Connection() {
    const [serialPorts, setSerialPorts] = useState<string[]>([]);

    useEffect(() => {
        async function fetchSerialPorts() {
            try {
                const result = await invoke<string[]>("get_available_serial_port");
                setSerialPorts(result);
            } catch {
                setSerialPorts([]);
            }
        }

        fetchSerialPorts();
    }, []);

    return (
        <div className="card-body">
            <h2 className="card-title">连接</h2>
            <select defaultValue="选择可用串口" className="select">
                <option disabled>
                    {serialPorts.length === 0 ? "未找到可用串口" : "选择可用串口"}
                </option>
                {serialPorts.map((el) => (
                    <option key={el}>{el}</option>
                ))}
            </select>
        </div>
    );
}

export default Connection;