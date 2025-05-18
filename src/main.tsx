import ReactDOM from "react-dom/client";
import Home from "./Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Hero from "./components/Hero.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Hero/>}/>
            <Route path="/home" element={<Home/>}/>
        </Routes>
    </BrowserRouter>
);
