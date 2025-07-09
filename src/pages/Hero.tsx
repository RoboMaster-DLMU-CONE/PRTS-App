import {useNavigate} from "react-router";
import {useSettingsStore} from "../stores/useSettingsStore.ts";

function Hero() {
    const {setShowHero} = useSettingsStore();
    let navigate = useNavigate();
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold font-sans mb-5">PRTS</h1>

                    <button className="btn btn-primary btn-outline" onClick={() => {
                        setShowHero(false);
                        navigate("/")
                    }}>开始演算
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Hero;

