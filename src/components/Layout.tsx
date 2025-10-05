import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar.tsx";
import ThemeSwitcher from "./ThemeSwitcher.tsx";

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: "/runtime", label: "运行时终端", icon: "🖥️" },
        { path: "/packet-generation", label: "数据包生成", icon: "📦" },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsDrawerOpen(false);
    };

    return (
        <div className="drawer">
            <input
                id="main-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={isDrawerOpen}
                onChange={(e) => setIsDrawerOpen(e.target.checked)}
            />
            <div className="drawer-content flex flex-col h-screen">
                {/* Navbar */}
                <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

                {/* Page content */}
                <div className="flex-1 pt-8 overflow-hidden">
                    {children}
                </div>
            </div>
            <div className="drawer-side z-[60]">
                <label htmlFor="main-drawer" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {/* Drawer header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold px-4 py-2">PRTS</h2>
                        <div className="divider my-2"></div>
                    </div>

                    {/* Navigation menu */}
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <a
                                    className={`flex items-center gap-3 ${
                                        location.pathname === item.path ? "active" : ""
                                    }`}
                                    onClick={() => handleNavigate(item.path)}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="divider my-4"></div>

                    {/* Theme switcher */}
                    <div className="px-4">
                        <label className="block text-sm font-semibold mb-2">主题设置</label>
                        <ThemeSwitcher />
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-6">
                        <div className="text-center text-sm text-base-content/50">
                            <p>Primitive RoboMaster Terminal Service</p>
                            <p className="text-xs mt-1">v0.1.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;

