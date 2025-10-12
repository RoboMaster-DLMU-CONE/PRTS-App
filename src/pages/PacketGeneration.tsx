import {useState} from 'react';
import {invoke} from '@tauri-apps/api/core';
import {save, open} from '@tauri-apps/plugin-dialog';
import type {PacketConfig, PacketField} from '../types/packet';
import {CPP_TYPES} from '../types/packet';

function PacketGeneration() {
    const [config, setConfig] = useState<PacketConfig>({
        packet_name: '',
        command_id: '0x',
        namespace: null,
        packed: true,
        header_guard: undefined,
        fields: []
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    const toMessage = (err: unknown): string => {
        if (typeof err === 'string') return err;
        if (err instanceof Error) return err.message;
        try {
            return JSON.stringify(err);
        } catch {
            return String(err);
        }
    };

    const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
        setMessage({type, text});
        setTimeout(() => setMessage(null), 8000);
    };

    const addField = () => {
        setConfig({
            ...config,
            fields: [...config.fields, {name: '', type: 'uint8_t', comment: ''}]
        });
    };

    const removeField = (index: number) => {
        setConfig({
            ...config,
            fields: config.fields.filter((_, i) => i !== index)
        });
    };

    const updateField = (index: number, field: Partial<PacketField>) => {
        const newFields = [...config.fields];
        newFields[index] = {...newFields[index], ...field};
        setConfig({...config, fields: newFields});
    };

    const handleSaveConfig = async () => {
        try {
            const filePath = await save({
                defaultPath: `${config.packet_name || 'packet'}.json`,
                filters: [{name: 'JSON', extensions: ['json']}]
            });

            if (filePath) {
                await invoke('save_packet_config', {config, file: {filePath}});
                showMessage('success', `配置已保存到: ${filePath}`);
            }
        } catch (error) {
            showMessage('error', `保存失败:\n${toMessage(error)}`);
        }
    };

    const handleLoadConfig = async () => {
        try {
            const filePath = await open({
                multiple: false,
                filters: [{name: 'JSON', extensions: ['json']}]
            });

            if (filePath) {
                const loadedConfig = await invoke<PacketConfig>('load_packet_config', {
                    file: {filePath: filePath as string}
                });
                setConfig(loadedConfig);
                showMessage('success', '配置加载成功');
            }
        } catch (error) {
            showMessage('error', `加载失败:\n${toMessage(error)}`);
        }
    };

    const ensureRequiredFields = (): string | null => {
        if (!config.packet_name.trim()) return '请填写数据包名称';
        if (!config.command_id.trim()) return '请填写命令ID';
        if (config.fields.length === 0) return '请至少添加一个字段';
        // basic field checks
        for (const [i, f] of config.fields.entries()) {
            if (!f.name.trim()) return `第 ${i + 1} 个字段缺少名称`;
        }
        return null;
    };

    // Save current form to a temp file via backend and return its path
    const saveToTemp = async (): Promise<string> => {
        const tempConfigPath = await invoke<string>('save_temp_packet_config', {config});
        return tempConfigPath;
    };

    const ensureHeaderExt = (filePath: string): string => {
        const lower = filePath.toLowerCase();
        if (lower.endsWith('.hpp') || lower.endsWith('.h')) return filePath;
        return `${filePath}.hpp`;
    };

    const handleGenerateCode = async () => {
        const missing = ensureRequiredFields();
        if (missing) {
            showMessage('error', missing);
            return;
        }

        setIsGenerating(true);
        try {
            // Save current config to temp
            const configPath = await saveToTemp();

            // Ask for a single target file with default name
            const defaultName = `${config.packet_name || 'packet'}.hpp`;
            const target = await save({
                defaultPath: defaultName,
                filters: [{name: 'C++ Header', extensions: ['hpp', 'h']}]
            });

            if (!target) {
                showMessage('error', '已取消：需要选择输出文件');
                return;
            }

            const targetFile = ensureHeaderExt(String(target));

            // Generate the code via backend, move to chosen file
            const result = await invoke<string>('generate_packet_code', {
                args: {
                    configPath: configPath,
                    targetFile: targetFile
                }
            });

            showMessage('success', `代码已保存到: ${targetFile}\n${result}`);
        } catch (error) {
            showMessage('error', `生成失败:\n${toMessage(error)}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleValidateConfig = async () => {
        const missing = ensureRequiredFields();
        if (missing) {
            showMessage('error', missing);
            return;
        }
        try {
            const configPath = await saveToTemp();
            const result = await invoke<string>('validate_packet_config', {args: {configPath: configPath}});
            showMessage('success', result);
        } catch (error) {
            showMessage('error', `验证失败:\n${toMessage(error)}`);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 p-6 overflow-auto">
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="card-title text-2xl font-bold">数据包生成</h2>
                                <p className="text-base-content/70">
                                    RoboMaster Packet Library - 自定义数据包生成工具
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-outline btn-sm" onClick={handleLoadConfig}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                         fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    加载配置
                                </button>
                                <button className="btn btn-outline btn-sm" onClick={handleSaveConfig}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                         fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    保存配置
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div
                                className={`alert ${message.type === 'success' ? 'alert-success' : message.type === 'error' ? 'alert-error' : 'alert-info'} mt-4`}>
                                <pre className="whitespace-pre-wrap break-words m-0">{message.text}</pre>
                            </div>
                        )}

                        <div className="divider"></div>

                        {/* Basic Configuration */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">基本配置</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">数据包名称 *</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="PacketName"
                                        className="input input-bordered"
                                        value={config.packet_name}
                                        onChange={(e) => setConfig({...config, packet_name: e.target.value})}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">C++ 结构体名称</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">命令ID *</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="0x0104"
                                        className="input input-bordered"
                                        value={config.command_id}
                                        onChange={(e) => setConfig({...config, command_id: e.target.value})}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">支持十六进制(0x开头)或十进制</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">命名空间</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Robot::Sensors (可选)"
                                        className="input input-bordered"
                                        value={config.namespace || ''}
                                        onChange={(e) => setConfig({...config, namespace: e.target.value || null})}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Packed 属性</span>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary"
                                            checked={config.packed}
                                            onChange={(e) => setConfig({...config, packed: e.target.checked})}
                                        />
                                    </label>
                                    <label className="label">
                                        <span className="label-text-alt">添加 __attribute__((packed))</span>
                                    </label>
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">头文件保护宏（可选）</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="RPL_PACKETNAME_HPP (可留空，rplc 自动生成)"
                                        className="input input-bordered"
                                        value={config.header_guard || ''}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            header_guard: e.target.value || undefined
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="divider"></div>

                            {/* Fields Configuration */}
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">字段定义</h3>
                                <button className="btn btn-primary btn-sm" onClick={addField}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                         fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    添加字段
                                </button>
                            </div>

                            {config.fields.length === 0 ? (
                                <div className="alert alert-info">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         className="stroke-current shrink-0 w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>暂无字段，请点击"添加字段"按钮开始</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {config.fields.map((field, index) => (
                                        <div key={index} className="card bg-base-300 shadow-md">
                                            <div className="card-body p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text">字段名称</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="field_name"
                                                            className="input input-bordered input-sm"
                                                            value={field.name}
                                                            onChange={(e) => updateField(index, {name: e.target.value})}
                                                        />
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text">类型</span>
                                                        </label>
                                                        <select
                                                            className="select select-bordered select-sm"
                                                            value={field.type}
                                                            onChange={(e) => updateField(index, {type: e.target.value})}
                                                        >
                                                            {CPP_TYPES.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text">注释</span>
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="字段描述"
                                                                className="input input-bordered input-sm flex-1"
                                                                value={field.comment}
                                                                onChange={(e) => updateField(index, {comment: e.target.value})}
                                                            />
                                                            <button
                                                                className="btn btn-error btn-sm btn-square"
                                                                onClick={() => removeField(index)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     className="h-4 w-4" viewBox="0 0 20 20"
                                                                     fill="currentColor">
                                                                    <path fillRule="evenodd"
                                                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                          clipRule="evenodd"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="divider"></div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-end">
                                <button
                                    className="btn btn-outline"
                                    onClick={handleValidateConfig}
                                    disabled={isGenerating}
                                >
                                    验证配置
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleGenerateCode}
                                    disabled={isGenerating}
                                    title="将弹出文件保存框，请选择头文件保存位置"
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            生成中...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            生成代码
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-sm text-base-content/60">
                                提示：点击“生成代码”后会弹出保存对话框，默认文件名为“包名.hpp”。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PacketGeneration;

