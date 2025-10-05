import ReactDOM from "react-dom/client";
import RuntimeTerminal from "./pages/RuntimeTerminal.tsx";
import PacketGeneration from "./pages/PacketGeneration.tsx";
import Hero from "./pages/Hero.tsx";
import Layout from "./components/Layout.tsx";
import {BrowserRouter, Route, Routes} from "react-router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/runtime" element={<Layout><RuntimeTerminal/></Layout>}/>
            <Route path="/packet-generation" element={<Layout><PacketGeneration/></Layout>}/>
            <Route path="/" element={<Hero/>}/>
        </Routes>
    </BrowserRouter>
);
