import {Link} from "react-router";

function Hero() {
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold font-sans text-stone-900 mb-5">PRTS</h1>
                    <Link to="/home" className="btn btn-primary btn-outline">开始演算</Link>
                </div>
            </div>
        </div>
    );
}

export default Hero;

