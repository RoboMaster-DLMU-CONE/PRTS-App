import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import {useSettings} from "./stores/useSettings.ts"
import {useEffect} from "react";

function Home() {
    const {showHero, init} = useSettings();
    useEffect(() => {
        init();
    }, []);
    return (showHero ?
            <Hero/> :
            <Navbar/>
    );
}

export default Home;
