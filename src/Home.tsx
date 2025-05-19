import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import {useSettingsStore} from "./stores/useSettingsStore.ts"
import {useEffect} from "react";
import UnitList from "./components/UnitList.tsx";
import Connection from "./components/Connection.tsx";
import Terminal from "./components/Terminal.tsx";

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
                    <div className="card card-border w-1/5 h-full flex flex-col">
                        <UnitList/>
                        <div className="divider"/>
                        <Connection/>
                        <div className="divider"/>
                        <Terminal/>
                    </div>
                </div>
            }
        </div>
    );
}

export default Home;
