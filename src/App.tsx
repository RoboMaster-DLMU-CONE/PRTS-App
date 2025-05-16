import {useState} from "react";
import {invoke} from "@tauri-apps/api/core";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const name = "PRTS"

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", {name}));
    }

    return (
        <>
            <button className="btn btn-primary" onClick={greet}>Hello</button>
            <p>{greetMsg}</p>
        </>
    );
}

export default App;
