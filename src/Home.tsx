import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import {useSettingsStore} from "./stores/useSettingsStore.ts"
import {useEffect} from "react";

function Home() {
    const {showHero, init} = useSettingsStore();
    useEffect(() => {
        init();
    }, []);
    return (showHero ?
            <Hero/> :
            <Navbar/>
    );
}

export default Home;
