import {invoke} from '@tauri-apps/api/core';

export interface Settings {
    theme: string;
    show_hero: boolean;
}

export async function load(): Settings {
    const cfg = await invoke<Settings>('get_settings');
    return cfg;
}

export async function save(cfg: Settings) {
    await invoke('set_settings', cfg);
}