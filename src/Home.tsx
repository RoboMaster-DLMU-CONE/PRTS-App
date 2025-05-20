import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import {useSettingsStore} from "./stores/useSettingsStore.ts"
import {useEffect} from "react";
import ToolKit from "./components/ToolKit.tsx";

function Home() {
    const {showHero, init} = useSettingsStore();
    useEffect(() => {
        init();
    }, []);
    return (<div className="h-screen pt-8">
            {showHero
                ? <Hero/>
                : <div className="h-full flex">
                    <Navbar/>
                    <ToolKit/>
                </div>
            }
        </div>
    );
}

export default Home;
