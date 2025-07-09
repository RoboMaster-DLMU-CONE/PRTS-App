import ReactDOM from "react-dom/client";
import RuntimeTerminal from "./pages/RuntimeTerminal.tsx";
import Hero from "./pages/Hero.tsx";
import {BrowserRouter, Route, Routes} from "react-router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<RuntimeTerminal/>}/>
            <Route path="/hero" element={<Hero/>}/>
        </Routes>
    </BrowserRouter>
);
