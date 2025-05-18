import ReactDOM from "react-dom/client";
import Home from "./Home.tsx";
import Hero from "./components/Hero.tsx";
import {BrowserRouter, Route, Routes} from "react-router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/hero" element={<Hero/>}/>
        </Routes>
    </BrowserRouter>
);
