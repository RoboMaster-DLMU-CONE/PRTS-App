import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import {useSettingsStore} from "./stores/useSettingsStore.ts"
import {useEffect} from "react";
// @ts-ignore
import GridLayout from "react-grid-layout";

const layout = [
    {i: "a", x: 0, y: 0, w: 3, h: 8},
    {i: "b", x: 0, y: 1, w: 3, h: 4},
    {i: "c", x: 0, y: 2, w: 3, h: 8},
    {i: "d", x: 3, y: 0, w: 8, h: 18},
]

function Home() {
    const {showHero, init} = useSettingsStore();
    useEffect(() => {
        init();
    }, []);
    return (showHero ?
            <Hero/> :
            <div className="w-full h-full">
                <Navbar/>
                <GridLayout className="layout" layout={layout} cols={12} rows={3} rowHeight={30}
                            width={1200} height={600}>
                    <div key="a" className="card card-border bg-base-100 w-30">
                        <div className="card-body">
                            <h2 className="card-title">Unit列表</h2>
                            <p>Chassis</p>
                        </div>
                    </div>
                    <div key="b" className="card card-border bg-base-100 w-30">
                        <div className="card-body">
                            <h2 className="card-title">连接</h2>
                            <p>COM5</p>
                        </div>
                    </div>
                    <div key="c" className="card card-border bg-base-100 w-30">
                        <div className="card-body">
                            <h2 className="card-title">虚拟终端</h2>
                            <p>$~:prts ls unit</p>
                        </div>
                    </div>
                    <div key="d" className="card card-border bg-base-100 w-30">
                        <div className="card-body">
                            <h2 className="card-title">Chassis</h2>
                            <p>显示元素</p>
                        </div>
                    </div>
                </GridLayout>
            </div>
    );
}

export default Home;
