export interface ServiceDefinition {
    name: string;
    icon: string | null;
    url: string | null;
    label: string;
}

export interface ServiceConfig {
    name: string;
    enabled: boolean;
    fmsURL: string;
    streamKey: string;
}
