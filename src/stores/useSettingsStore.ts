import {create} from "zustand/react";
import {load} from "../tauri/settings.ts"

interface SettingsState {
    showHero: boolean;
    setShowHero: (show: boolean) => void;
    init: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
        showHero: true,
        setShowHero: (show) => set(() => ({showHero: show})),
        init: async () => {
            const cfg = await load();
            set({showHero: cfg.show_hero})
        }
    })
)