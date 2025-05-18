import {invoke} from '@tauri-apps/api/core';

export interface Settings {
    theme: string;
    show_hero: boolean;
}

export async function load(): Promise<Settings> {
    return await invoke<Settings>('get_settings');
}

export async function save(cfg: Settings) {
    await invoke('set_settings', {settings: cfg});
}