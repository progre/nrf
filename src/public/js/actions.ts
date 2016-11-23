export const SET_NGINX_PATH = "SET_NGINX_PATH";
export function setNginxPath(path: string) {
    return {
        type: SET_NGINX_PATH,
        payload: path
    };
}

export const SET_NGINX_PORT = "SET_NGINX_PORT";
export function setNginxPort(port: number) {
    return {
        type: SET_NGINX_PORT,
        payload: port
    };
}

export const SET_FFMPEG_PATH = "SET_FFMPEG_PATH";
export function setFfmpegPath(path: string) {
    return {
        type: SET_FFMPEG_PATH,
        payload: path
    };
}

export const SET_ENABLED = "SET_ENABLED";
export function setEnabled(name: string, value: boolean) {
    return {
        type: SET_ENABLED,
        payload: { name, value }
    };
}

export const SET_FMS_URL = "SET_FMS_URL";
export function setFMSURL(name: string, value: string) {
    return {
        type: SET_FMS_URL,
        payload: { name, value }
    };
}

export const SET_STREAM_KEY = "SET_STREAM_KEY";
export function setStreamKey(name: string, value: string) {
    return {
        type: SET_STREAM_KEY,
        payload: { name, value }
    };
}
