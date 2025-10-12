export interface PacketField {
    name: string;
    type: string;
    comment: string;
}

export interface PacketConfig {
    packet_name: string;
    command_id: string;
    namespace?: string | null;
    packed: boolean;
    header_guard?: string;
    fields: PacketField[];
}

export const CPP_TYPES = [
    'uint8_t',
    'uint16_t',
    'uint32_t',
    'uint64_t',
    'int8_t',
    'int16_t',
    'int32_t',
    'int64_t',
    'float',
    'double',
    'bool',
    'char'
] as const;
